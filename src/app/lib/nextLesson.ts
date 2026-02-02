import { lessons } from "./lessons";
import type { LessonProgressMap } from "./lessonProgress";

export function getNextLessonSlug(progress: LessonProgressMap) {
  return lessons.find((l) => !progress[l.slug]?.completedAt)?.slug;
}
