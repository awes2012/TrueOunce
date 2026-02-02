import { describe, expect, it } from "vitest";
import type { LessonProgressMap } from "./lessonProgress";
import { lessons } from "./lessons";
import { getNextLessonSlug } from "./nextLesson";

describe("getNextLessonSlug", () => {
  it("returns first lesson when no progress exists", () => {
    const progress: LessonProgressMap = {};
    expect(getNextLessonSlug(progress)).toBe(lessons[0]?.slug);
  });

  it("skips completed lessons", () => {
    const progress: LessonProgressMap = {
      [lessons[0]!.slug]: { completedAt: new Date().toISOString() },
    };
    expect(getNextLessonSlug(progress)).toBe(lessons[1]?.slug);
  });

  it("returns undefined when all lessons are completed", () => {
    const now = new Date().toISOString();
    const progress: LessonProgressMap = Object.fromEntries(
      lessons.map((l) => [l.slug, { completedAt: now }]),
    );
    expect(getNextLessonSlug(progress)).toBe(undefined);
  });
});
