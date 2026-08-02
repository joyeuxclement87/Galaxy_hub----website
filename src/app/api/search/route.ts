import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/data/public-products";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";
  const results = query ? await searchProducts(query) : [];

  return NextResponse.json({ query, results });
}
