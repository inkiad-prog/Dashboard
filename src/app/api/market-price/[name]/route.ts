import { NextRequest, NextResponse } from "next/server";
import { getWheatMarketPrices, getCoalMarketPrices } from "@/lib/queries";

export const dynamic = "force-dynamic";

const HANDLERS: Record<string, () => Promise<unknown>> = {
  wheat: getWheatMarketPrices,
  coal: getCoalMarketPrices,
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const handler = HANDLERS[name];
  if (!handler) {
    return NextResponse.json({ error: `No market price data for: ${name}` }, { status: 404 });
  }
  try {
    const data = await handler();
    return NextResponse.json(data);
  } catch (err) {
    console.error(`Failed to load ${name} market price`, err);
    return NextResponse.json(
      { error: "Failed to query the data warehouse. Check server logs." },
      { status: 502 }
    );
  }
}
