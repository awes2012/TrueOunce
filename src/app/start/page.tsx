"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLessonProgress } from "../lib/lessonProgress";
import { getNextLessonSlug } from "../lib/nextLesson";

export default function StartPage() {
  const router = useRouter();
  const { map } = useLessonProgress();

  useEffect(() => {
    const next = getNextLessonSlug(map);
    router.replace(next ? `/learn/${next}` : "/learn");
  }, [map, router]);

  return (
    <div className="glass rounded-[32px] p-8">
      <p className="text-sm text-[color:var(--smoke)]">Starting…</p>
    </div>
  );
}
