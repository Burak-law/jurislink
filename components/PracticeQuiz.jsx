"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

export default function PracticeQuiz({ questions, slug, title }) {
  const [answers, setAnswers] = useState({});
  const { status } = useSession();
  const hasLoggedRef = useRef(false);

  function selectAnswer(questionId, optionIndex) {
    setAnswers((prev) => {
      if (prev[questionId] !== undefined) return prev;
      return { ...prev, [questionId]: optionIndex };
    });
  }

  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correctIndex
  ).length;
  const allAnswered = answeredCount === questions.length;

  useEffect(() => {
    if (!allAnswered || hasLoggedRef.current || status !== "authenticated") return;
    hasLoggedRef.current = true;

    fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "quiz_completed",
        targetTitle: title,
        targetSlug: slug,
        resultCorrect: correctCount,
        resultTotal: questions.length,
      }),
    }).catch(() => {
      // Best-effort — a failed activity log shouldn't block the UI.
    });
  }, [allAnswered, status, correctCount, questions.length, slug, title]);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-heading font-bold text-xl text-juris-cream">
          Questions
        </h2>
        <p className="text-juris-cream/50 text-sm">
          {answeredCount}/{questions.length} answered
          {allAnswered && ` · ${correctCount}/${questions.length} correct`}
        </p>
      </div>
      {status !== "authenticated" && (
        <p className="text-juris-cream/30 text-xs mb-6">
          Log in to save this result to your progress.
        </p>
      )}

      <div className="flex flex-col gap-6">
        {questions.map((q, qi) => {
          const selected = answers[q.id];
          const isAnswered = selected !== undefined;

          return (
            <div key={q.id} className="bg-juris-cream text-juris-navy rounded-sm p-6">
              <p className="font-medium mb-4">
                {qi + 1}. {q.question}
              </p>

              <div className="flex flex-col gap-2">
                {q.options.map((option, oi) => {
                  const isCorrectOption = oi === q.correctIndex;
                  const isSelectedOption = oi === selected;

                  let stateClasses =
                    "border border-juris-navy/15 hover:border-juris-burgundy";
                  if (isAnswered) {
                    if (isCorrectOption) {
                      stateClasses =
                        "border-2 border-juris-burgundy bg-juris-burgundy/10 font-medium";
                    } else if (isSelectedOption) {
                      stateClasses =
                        "border border-juris-navy/30 opacity-50 line-through";
                    } else {
                      stateClasses = "border border-juris-navy/10 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={oi}
                      onClick={() => selectAnswer(q.id, oi)}
                      disabled={isAnswered}
                      className={`text-left text-sm px-4 py-3 rounded-sm transition-colors ${stateClasses}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <p className="text-juris-navy/60 text-sm mt-4 leading-relaxed">
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
