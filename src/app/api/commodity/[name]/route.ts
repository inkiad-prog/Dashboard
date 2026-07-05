import { NextRequest, NextResponse } from "next/server";
import {
  getWheatData,
  getCoalData,
  getSoybeanData,
  getMaizeData,
  getYellowPeasData,
} from "@/lib/queries";

export const dynamic = "force-dynamic"; // always fetch live, never cache

const HANDLERS: Record<string, () => Promise<unknown>> = {
  wheat: getWheatData,
  coal: getCoalData,
  soybean: getSoybeanData,
  maize: getMaizeData,
  yellowpeas: getYellowPeasData,
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const handler = HANDLERS[name];
  if (!handler) {
    return NextResponse.json({ error: `Unknown commodity: ${name}` }, { status: 404 });
  }
  try {
    const data = await handler();
    return NextResponse.json(data);
  } catch (err) {
    console.error(`Failed to load ${name} data`, err);
    return NextResponse.json(
      { error: "Failed to query the data warehouse. Check server logs." },
      { status: 502 }
    );
  }
}
