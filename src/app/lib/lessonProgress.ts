"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type LessonProgress = {
  completedAt?: string;
  quiz?: {
    score: number;
    total: number;
    passed: boolean;
    answeredAt: string;
  };
};

export type LessonProgressMap = Record<string, LessonProgress>;

const STORAGE_KEY = "trueounce-lesson-progress";

function safeParse(raw: string | null): LessonProgressMap {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as LessonProgressMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function useLessonProgress() {
  const [map, setMap] = useState<LessonProgressMap>({});

  useEffect(() => {
    setMap(safeParse(window.localStorage.getItem(STORAGE_KEY)));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  }, [map]);

  const markComplete = useCallback((slug: string) => {
    setMap((prev) => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        completedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const setQuizResult = useCallback(
    (slug: string, score: number, total: number, passed: boolean) => {
      setMap((prev) => ({
        ...prev,
        [slug]: {
          ...prev[slug],
          quiz: {
            score,
            total,
            passed,
            answeredAt: new Date().toISOString(),
          },
        },
      }));
    },
    [],
  );

  const resetAll = useCallback(() => setMap({}), []);

  const markAllComplete = useCallback((slugs: string[]) => {
    const completedAt = new Date().toISOString();
    setMap((prev) => {
      const next = { ...prev };
      slugs.forEach((slug) => {
        next[slug] = {
          ...next[slug],
          completedAt,
        };
      });
      return next;
    });
  }, []);

  const completedCount = useMemo(
    () => Object.values(map).filter((p) => Boolean(p.completedAt)).length,
    [map],
  );

  return {
    map,
    markComplete,
    markAllComplete,
    setQuizResult,
    resetAll,
    completedCount,
  };
}
