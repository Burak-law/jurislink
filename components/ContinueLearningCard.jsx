import Link from "next/link";
import TiltCard from "./TiltCard";

const typeConfig = {
  case: { label: "Case Law", path: "/case" },
  vocabulary: { label: "Vocabulary", path: "/term" },
  quiz: { label: "Quiz", path: "/practice" },
  essay: { label: "Essay", path: "/practice" },
};

export default function ContinueLearningCard({ item }) {
  const config = typeConfig[item.type];

  return (
    <TiltCard maxTilt={6}>
      <Link
        href={`${config.path}/${item.slug}`}
        className="block bg-slate-50 text-juris-text rounded-xl p-5 border border-slate-200 border-l-4 border-l-juris-accent hover:shadow-md hover:-translate-y-1 hover:border-juris-accent/30 transition-all"
      >
        <span className="text-[10px] uppercase tracking-widest font-bold text-juris-accent">
          {config.label}
        </span>
        <p className="font-heading font-bold text-lg mt-2 mb-1 group-hover:text-juris-accent transition-colors">{item.title}</p>
        <p className="text-juris-text/60 font-medium text-sm">{item.note}</p>
      </Link>
    </TiltCard>
  );
}
