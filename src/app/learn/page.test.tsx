import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import LearnIndex from "./page";
import { lessons } from "../lib/lessons";

const useSearchParamsMock = vi.hoisted(
  () => vi.fn(() => new URLSearchParams("")),
);

const lessonProgressMock = vi.hoisted(() => ({
  resetAll: vi.fn(),
  markAllComplete: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => useSearchParamsMock(),
}));

vi.mock("../lib/lessonProgress", () => ({
  useLessonProgress: () => ({
    map: {},
    completedCount: 0,
    resetAll: lessonProgressMock.resetAll,
    markAllComplete: lessonProgressMock.markAllComplete,
  }),
}));

describe("/learn page", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useSearchParamsMock.mockReturnValue(new URLSearchParams(""));
  });

  it("renders a working link for each lesson", () => {
    render(<LearnIndex />);

    lessons.forEach((lesson) => {
      const title = screen.getByText(lesson.title);
      const anchor = title.closest("a");
      expect(anchor).not.toBeNull();
      expect(anchor).toHaveAttribute("href", `/learn/${lesson.slug}`);
    });
  });

  it("shows a confirm step before marking all complete in demo mode", async () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams("demo=1"));
    const confirmSpy = vi
      .spyOn(window, "confirm")
      .mockImplementation(() => true);

    const user = userEvent.setup();
    render(<LearnIndex />);

    const button = await screen.findByRole("button", {
      name: "Mark all complete",
    });
    await user.click(button);

    expect(confirmSpy).toHaveBeenCalledWith(
      "Mark all lessons as complete? This updates your local progress.",
    );
    expect(lessonProgressMock.markAllComplete).toHaveBeenCalledWith(
      lessons.map((lesson) => lesson.slug),
    );

    confirmSpy.mockRestore();
  });
});
