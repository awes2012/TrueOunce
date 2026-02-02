"use client";

import Link from "next/link";
import { use, useMemo } from "react";
import { MarkdownLite } from "../../components/MarkdownLite";
import { Quiz } from "../../components/Quiz";
import { getLesson, lessons } from "../../lib/lessons";
import { useLessonProgress } from "../../lib/lessonProgress";

export default function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const lesson = getLesson(slug);
  const { map, markComplete, setQuizResult } = useLessonProgress();

  const progress = map[slug];
  const done = Boolean(progress?.completedAt);

  const nextSlug = useMemo(() => {
    const idx = lessons.findIndex((l) => l.slug === slug);
    return idx >= 0 ? lessons[idx + 1]?.slug : undefined;
  }, [slug]);

  const noteTemplate = useMemo(() => {
    return `Lesson: ${lesson?.title}\nEntry: \nTarget: \nInvalidation: \nConfidence (1-5): \nNotes: `;
  }, [lesson?.title]);

  if (!lesson) {
    return (
      <div className="glass rounded-[32px] p-8">
        <p className="text-sm text-[color:var(--smoke)]">Lesson not found.</p>
        <Link
          href="/learn"
          className="mt-4 inline-flex rounded-full border border-[color:var(--ink)]/15 bg-white/70 px-4 py-2 text-sm font-semibold"
        >
          Back to lessons
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="glass rounded-[32px] p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--smoke)]">
          Lesson · {lesson.minutes} min
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[color:var(--smoke)]">
          {lesson.summary}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/learn"
            className="rounded-full border border-[color:var(--ink)]/15 bg-white/70 px-4 py-2 text-sm font-semibold"
          >
            All lessons
          </Link>
          <Link
            href="/trade"
            className="rounded-full border border-[color:var(--ink)]/15 bg-white/70 px-4 py-2 text-sm font-semibold"
          >
            Open Trade
          </Link>
          {done ? (
            <span className="rounded-full bg-[color:var(--verdigris)]/15 px-4 py-2 text-sm font-semibold text-[color:var(--verdigris)]">
              Completed
            </span>
          ) : (
            <button
              type="button"
              onClick={() => markComplete(lesson.slug)}
              className="rounded-full bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)]"
            >
              Mark complete
            </button>
          )}
        </div>
      </header>

      <section className="glass rounded-[32px] p-8">
        <MarkdownLite markdown={lesson.contentMd} />

        <div className="mt-6 rounded-2xl border border-[color:var(--ink)]/10 bg-white/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--smoke)]">
            Suggested action
          </p>
          <p className="mt-2 text-sm text-[color:var(--smoke)]">
            If you place a trade, use a note template so each click teaches you
            something.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/trade?note=${encodeURIComponent(noteTemplate)}`}
              className="rounded-full bg-[color:var(--vermilion)] px-4 py-2 text-sm font-semibold text-white"
            >
              Open Trade w/ note template
            </Link>
            <button
              type="button"
              className="rounded-full border border-[color:var(--ink)]/15 bg-white/70 px-4 py-2 text-sm font-semibold"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(noteTemplate);
                } catch {
                  // ignore
                }
              }}
            >
              Copy note template
            </button>
          </div>
        </div>

        {lesson.quiz?.length ? (
          <Quiz
            questions={lesson.quiz}
            onComplete={(score, total) => {
              const passed = score / total >= 0.7;
              setQuizResult(lesson.slug, score, total, passed);
              if (passed) markComplete(lesson.slug);
            }}
          />
        ) : null}
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3">
        {nextSlug ? (
          <Link
            href={`/learn/${nextSlug}`}
            className="rounded-full bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)]"
          >
            Next lesson
          </Link>
        ) : (
          <Link
            href="/learn"
            className="rounded-full bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)]"
          >
            Back to lessons
          </Link>
        )}
      </footer>
    </div>
  );
}
