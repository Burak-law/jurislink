"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import StatCard from "./StatCard";
import AreaProgressBar from "./AreaProgressBar";
import ContinueLearningCard from "./ContinueLearningCard";
import ActivityFeed from "./ActivityFeed";
import VerifyEmailBanner from "./VerifyEmailBanner";
import { StaggerGroup, StaggerItem } from "./StaggerGroup";
import Skeleton from "./Skeleton";

export default function DashboardContent() {
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;

    fetch("/api/progress")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load progress");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setProgress(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

  if (status === "loading") {
    return (
      <section className="px-6 md:px-16 py-14 max-w-5xl mx-auto">
        <Skeleton className="h-4 w-40 mb-4" />
        <Skeleton className="h-10 w-2/3 mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </section>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <section className="px-6 md:px-16 py-24 max-w-md mx-auto text-center">
        <h1 className="font-heading font-bold text-juris-accent text-2xl md:text-3xl mb-4">
          İlerlemenizi görmek için giriş yapın.
        </h1>
        <p className="text-juris-text/60 font-medium text-sm mb-8">
          İncelediğiniz içtihatları, öğrendiğiniz terimleri ve ne kadar yol aldığınızı takip edin.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/login"
            className="border border-slate-200 text-juris-text px-6 py-3 rounded-full text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            Giriş Yap
          </Link>
          <Link
            href="/signup"
            className="bg-juris-accent text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-juris-accent/90 transition-colors shadow-sm"
          >
            Ücretsiz Kayıt Ol
          </Link>
        </div>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="px-6 md:px-16 py-24 text-center">
        <p className="text-juris-text/60 text-sm">
          Şu anda ilerlemeniz yüklenemedi. Sayfayı yenilemeyi deneyin.
        </p>
      </section>
    );
  }

  if (!progress) {
    return (
      <section className="px-6 md:px-16 py-14 max-w-5xl mx-auto">
        <Skeleton className="h-4 w-40 mb-4" />
        <Skeleton className="h-10 w-2/3 mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </section>
    );
  }

  const { stats, areaProgress, continueLearning, recentActivity } = progress;

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-16 pt-14 pb-24">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm relative">
        <section className="pb-8">
          <p className="uppercase tracking-[0.3em] text-juris-accent text-xs font-bold mb-3">
            İlerlemeniz
          </p>
          <h1 className="font-heading font-bold text-juris-accent text-3xl md:text-4xl drop-shadow-sm">
            Tekrar hoş geldin, {session.user.name} — harika bir momentum yakaladın!
          </h1>
        </section>

        {!session.user.emailVerified && (
          <section className="mb-8">
            <VerifyEmailBanner />
          </section>
        )}

        <section className="pb-14">
          <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StaggerItem><StatCard value={stats.casesStudied} label="İncelenen İçtihat" /></StaggerItem>
            <StaggerItem><StatCard value={stats.termsLearned} label="Öğrenilen Terim" /></StaggerItem>
            <StaggerItem><StatCard value={stats.essaysDrafted} label="Hazırlanan Taslak" /></StaggerItem>
            <StaggerItem><StatCard value={stats.quizAverage} label="Test Ortalaması" /></StaggerItem>
          </StaggerGroup>
        </section>

        <section className="pb-14 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-heading font-bold text-xl text-juris-accent mb-6 group-hover:text-juris-accent/80 transition-colors">
              Hukuk Alanlarına Göre İlerleme
            </h2>
            {areaProgress.length > 0 ? (
              <div className="flex flex-col gap-5">
                {areaProgress.map((item) => (
                  <AreaProgressBar key={item.area} area={item.area} percent={item.percent} />
                ))}
              </div>
            ) : (
              <p className="text-juris-text/60 font-medium text-sm">
                Henüz kaydedilen bir ilerleme yok — başlamak için bir içtihat okuyun veya terim öğrenin.
              </p>
            )}
          </div>

          <div>
            <h2 className="font-heading font-bold text-xl text-juris-accent mb-6 group-hover:text-juris-accent/80 transition-colors">
              Son Aktiviteler
            </h2>
            {recentActivity.length > 0 ? (
              <ActivityFeed activity={recentActivity} />
            ) : (
              <p className="text-juris-text/60 font-medium text-sm">
                JurisLink'i kullandıkça aktiviteleriniz burada görünecek.
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-heading font-bold text-xl text-juris-accent mb-6 group-hover:text-juris-accent/80 transition-colors">
            Kaldığınız Yerden Devam Edin
          </h2>
          {continueLearning.length > 0 ? (
            <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {continueLearning.map((item) => (
                <StaggerItem key={`${item.type}-${item.slug}`}>
                  <ContinueLearningCard item={item} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          ) : (
            <p className="text-juris-text/60 font-medium text-sm">
              Tüm çalışmalarınızı tamamladınız — harika iş çıkardınız!
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
