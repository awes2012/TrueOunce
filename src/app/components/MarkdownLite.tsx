"use client";

import React from "react";

function renderInline(text: string) {
  // very small inline renderer: **bold**
  const parts: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <strong key={`${m.index}-${m[1]}`} className="font-semibold">
        {m[1]}
      </strong>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function MarkdownLite({ markdown }: { markdown: string }) {
  const lines = markdown.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push(
        <h1 key={`h1-${i}`} className="text-3xl font-semibold tracking-tight">
          {renderInline(line.slice(2).trim())}
        </h1>,
      );
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={`h2-${i}`} className="mt-6 text-xl font-semibold">
          {renderInline(line.slice(3).trim())}
        </h2>,
      );
      i++;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2).trim());
        i++;
      }
      blocks.push(
        <ul key={`ul-${i}`} className="ml-5 list-disc space-y-1 text-sm">
          {items.map((item, idx) => (
            <li key={idx} className="text-[color:var(--smoke)]">
              <span className="text-[color:var(--ink)]">
                {renderInline(item)}
              </span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // paragraph: gather until blank line
    const paras: string[] = [];
    while (i < lines.length && lines[i].trim()) {
      paras.push(lines[i]);
      i++;
    }
    const text = paras.join(" ").trim();
    blocks.push(
      <p key={`p-${i}`} className="text-sm leading-7 text-[color:var(--smoke)]">
        {renderInline(text)}
      </p>,
    );
  }

  return <div className="space-y-4">{blocks}</div>;
}
