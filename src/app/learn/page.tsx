"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { lessons } from "../lib/lessons";
import { useLessonProgress } from "../lib/lessonProgress";

const DEMO_STORAGE_KEY = "trueounce-demo-mode";

export default function LearnIndex() {
  const { map, completedCount, resetAll, markAllComplete } =
    useLessonProgress();
  const searchParams = useSearchParams();
  const demoParam = searchParams.get("demo") === "1";
  const [showDemoActions, setShowDemoActions] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(DEMO_STORAGE_KEY) === "1";
    const enabled = demoParam || stored;
    if (demoParam && !stored) {
      window.localStorage.setItem(DEMO_STORAGE_KEY, "1");
    }
    setShowDemoActions(enabled);
  }, [demoParam]);

  return (
    <div className="flex flex-col gap-8">
      <header className="glass rounded-[32px] p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--smoke)]">
          Learn
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Silver trading lessons
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--smoke)]">
          Short lessons + small quizzes. This is paper trading — the goal is to
          build decision-making and discipline.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[color:var(--ink)]/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--smoke)]">
            Completed {completedCount}/{lessons.length}
          </span>
          {showDemoActions ? (
            <button
              type="button"
              onClick={() => {
                const confirmed = window.confirm(
                  "Mark all lessons as complete? This updates your local progress.",
                );
                if (!confirmed) return;
                markAllComplete(lessons.map((lesson) => lesson.slug));
              }}
              className="rounded-full border border-[color:var(--ink)]/15 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink)]"
            >
              Mark all complete
            </button>
          ) : null}
          <button
            type="button"
            onClick={resetAll}
            className="rounded-full border border-[color:var(--ink)]/15 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink)]"
          >
            Reset progress
          </button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {lessons.map((lesson) => {
          const progress = map[lesson.slug];
          const done = Boolean(progress?.completedAt);
          const quiz = progress?.quiz;

          return (
            <Link
              key={lesson.slug}
              href={`/learn/${lesson.slug}`}
              className="rounded-[28px] border border-[color:var(--ink)]/10 bg-white/70 p-6 transition hover:bg-[color:var(--steel)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--smoke)]">
                    {lesson.minutes} min
                  </p>
                  <p className="mt-2 text-lg font-semibold">{lesson.title}</p>
                  <p className="mt-2 text-sm text-[color:var(--smoke)]">
                    {lesson.summary}
                  </p>
                </div>
                <div className="shrink-0">
                  {done ? (
                    <span className="rounded-full bg-[color:var(--verdigris)]/15 px-3 py-1 text-xs font-semibold text-[color:var(--verdigris)]">
                      Done
                    </span>
                  ) : (
                    <span className="rounded-full border border-[color:var(--ink)]/10 bg-white/70 px-3 py-1 text-xs font-semibold text-[color:var(--smoke)]">
                      Not started
                    </span>
                  )}
                  {quiz ? (
                    <p className="mt-2 text-xs text-[color:var(--smoke)]">
                      Quiz: {quiz.score}/{quiz.total}
                    </p>
                  ) : null}
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
