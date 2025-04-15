import { getPaginationParams } from "@/app/lib/pagination";
import { Prisma } from "@/app/lib/Prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { skip, take, page, pageSize } = getPaginationParams(request.url);

    // Get total count of products
    const totalProducts = await Prisma.product.count();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalProducts / pageSize);

    // If page exceeds total pages, return the last page instead
    if (page > totalPages) {
      return NextResponse.json({
        totalProducts,
        totalPages,
        products: [],
        message: "No more products available",
       
      });
    }

    const products = await Prisma.product.findMany({ take, skip });

    return NextResponse.json({
      totalProducts,
      totalPages,
      currentPage: page,
      pageSize,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "We got an error while finding products" },
      { status: 500 }
    );
  }
}
