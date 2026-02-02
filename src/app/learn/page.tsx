import { Suspense } from "react";
import LearnClient from "./LearnClient";

export default function LearnIndex() {
  return (
    <Suspense
      fallback={
        <div className="glass rounded-[32px] p-8 text-sm text-[color:var(--smoke)]">
          Loading lessons…
        </div>
      }
    >
      <LearnClient />
    </Suspense>
  );
}
