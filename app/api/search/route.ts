import { NextRequest, NextResponse } from "next/server";
import { searchService } from "@/lib/services/searchService";
import { products } from "@/data/products";
import { logger } from "@/lib/logger";

// Forzar renderizado dinámico ya que usamos searchParams
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ products: [] }, { status: 200 });
  }

  try {
    const results = searchService.intelligentSearch(query, products);
    return NextResponse.json({ products: results }, { status: 200 });
  } catch (error) {
    logger.error("Search error:", error);
    return NextResponse.json(
      { error: "Error en la búsqueda" },
      { status: 500 }
    );
  }
}


