import { NextResponse } from "next/server";
import { priceFeed } from "../../lib/mock";

export async function GET() {
  return NextResponse.json({
    priceFeed,
    fxRate: 1.36,
    updatedAt: new Date().toISOString(),
  });
}
