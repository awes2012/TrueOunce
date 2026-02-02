export type LessonQuizQuestion = {
  id: string;
  prompt: string;
  options: { id: string; text: string; correct?: boolean }[];
  explanation?: string;
};

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  contentMd: string;
  quiz?: LessonQuizQuestion[];
};

export const lessons: Lesson[] = [
  {
    slug: "silver-101",
    title: "Silver 101: Spot, premiums, and what you’re actually trading",
    summary:
      "Learn the difference between spot price, products, and why premiums matter even in paper trading.",
    minutes: 7,
    contentMd: `# Silver 101

You’ll see a **spot price** for silver (XAG/USD). That’s the global reference price for a *theoretical* ounce of silver.

## Key ideas

- **Spot price**: the market price of silver per ounce.
- **Physical price**: spot + **premium** (minting, shipping, dealer margin).
- **Paper trading**: you practice *decision-making* and *risk management* without real money.

## Practical takeaway

When you paper trade, treat spot as your execution price, but remember real-world fills usually include slippage/premium.

## Next

Go to the Trade screen and place a tiny paper trade (e.g., 1 oz) just to learn the workflow.`,
    quiz: [
      {
        id: "q1",
        prompt: "What does ‘spot price’ represent?",
        options: [
          { id: "a", text: "A dealer’s final price including shipping", correct: false },
          { id: "b", text: "A reference market price per ounce of silver", correct: true },
          { id: "c", text: "The price after sales tax", correct: false },
        ],
        explanation:
          "Spot is the reference market price. Real-world physical purchases often add a premium.",
      },
    ],
  },
  {
    slug: "risk-basics",
    title: "Risk basics: position size, cash, and not blowing up",
    summary:
      "Use position sizing and constraints to avoid outsized losses and emotional trading.",
    minutes: 8,
    contentMd: `# Risk basics

A good trade is one where your **downside is defined**.

## Rules of thumb

- Don’t risk more than **1–2%** of your account on a single idea.
- Keep a **maximum position size**.
- Avoid revenge trading: take breaks after losses.

## In TrueOunce

- Use **Daily trade limit** to prevent over-trading.
- Use **Max position (oz)** to cap exposure.

## Next

Set your max position to something conservative (ex: 25 oz) in Settings.`,
    quiz: [
      {
        id: "q1",
        prompt: "Why use a max position size?",
        options: [
          { id: "a", text: "To guarantee profits", correct: false },
          { id: "b", text: "To limit exposure if you’re wrong", correct: true },
          { id: "c", text: "To increase trading frequency", correct: false },
        ],
      },
    ],
  },
  {
    slug: "entries-exits",
    title: "Entries & exits: making a plan before clicking buy",
    summary:
      "Define entry, target, and invalidation so your trade isn’t just a feeling.",
    minutes: 9,
    contentMd: `# Entries & exits

Before you buy, write down:

- **Entry**: why here?
- **Target**: where would you take profit?
- **Invalidation**: where are you wrong?

## Notes

TrueOunce lets you add a **note** to each trade. Use it to record your plan.

## Next

Do one paper trade with a note containing entry/target/invalidation.`,
  },
  {
    slug: "journal",
    title: "Journaling: turning trades into lessons",
    summary:
      "A journal makes you better by turning outcomes into feedback.",
    minutes: 6,
    contentMd: `# Journaling

A trading journal answers:

- What did I expect?
- What happened?
- What will I do differently?

## Next

Review your last trade in History and write a short journal note (even if it was small).`,
  },
  {
    slug: "buddy-paper",
    title: "Buddy paper trading (preview)",
    summary:
      "How buddy mode will work: propose trades, approve together, learn faster.",
    minutes: 4,
    contentMd: `# Buddy paper trading (preview)

Buddy mode will let you:

- Pair with a friend
- Propose a paper trade
- Have your buddy approve/reject
- Keep a shared trade log

For MVP week, we focus on solo lessons + your own simulator.`,
  },
];

export function getLesson(slug: string) {
  return lessons.find((l) => l.slug === slug);
}
