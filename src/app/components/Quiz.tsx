"use client";

import { useMemo, useState } from "react";
import type { LessonQuizQuestion } from "../lib/lessons";

export function Quiz({
  questions,
  onComplete,
}: {
  questions: LessonQuizQuestion[];
  onComplete: (score: number, total: number) => void;
}) {
  const total = questions.length;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    if (!submitted) return 0;
    let s = 0;
    for (const q of questions) {
      const chosen = answers[q.id];
      const correct = q.options.find((o) => o.correct)?.id;
      if (chosen && correct && chosen === correct) s++;
    }
    return s;
  }, [submitted, answers, questions]);

  const passed = submitted ? score / total >= 0.7 : false;

  return (
    <div className="mt-6 rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--smoke)]">
        Quick check
      </p>
      <div className="mt-4 space-y-5">
        {questions.map((q) => {
          const correctId = q.options.find((o) => o.correct)?.id;
          return (
            <div key={q.id} className="space-y-3">
              <p className="text-sm font-semibold">{q.prompt}</p>
              <div className="grid gap-2">
                {q.options.map((o) => {
                  const chosen = answers[q.id] === o.id;
                  const isCorrect = submitted && correctId === o.id;
                  const isWrong =
                    submitted && chosen && correctId && chosen && o.id !== correctId;

                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: o.id }))
                      }
                      className={`text-left rounded-xl border px-3 py-2 text-sm transition ${
                        chosen
                          ? "border-[color:var(--ink)]/40 bg-[color:var(--steel)]"
                          : "border-[color:var(--ink)]/10 bg-white/70 hover:bg-[color:var(--steel)]"
                      } ${isCorrect ? "ring-2 ring-[color:var(--verdigris)]" : ""} ${
                        isWrong ? "ring-2 ring-red-400" : ""
                      }`}
                      aria-pressed={chosen}
                      disabled={submitted}
                    >
                      {o.text}
                    </button>
                  );
                })}
              </div>
              {submitted && q.explanation ? (
                <p className="text-xs text-[color:var(--smoke)]">{q.explanation}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {submitted ? (
          <div>
            <p className="text-sm font-semibold">
              Score: {score}/{total}
            </p>
            <p
              className={`mt-1 text-xs font-semibold ${
                passed
                  ? "text-[color:var(--verdigris)]"
                  : "text-[color:var(--vermilion)]"
              }`}
            >
              {passed ? "Passed" : "Not passed"}
            </p>
          </div>
        ) : (
          <p className="text-xs text-[color:var(--smoke)]">
            Answer all questions, then submit.
          </p>
        )}

        <button
          type="button"
          className="rounded-full bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)]"
          onClick={() => {
            if (submitted) return;
            // compute score once
            let s = 0;
            for (const q of questions) {
              const chosen = answers[q.id];
              const correct = q.options.find((o) => o.correct)?.id;
              if (chosen && correct && chosen === correct) s++;
            }
            setSubmitted(true);
            onComplete(s, total);
          }}
          disabled={submitted || Object.keys(answers).length < total}
        >
          {submitted ? "Submitted" : "Submit"}
        </button>
      </div>
    </div>
  );
}
