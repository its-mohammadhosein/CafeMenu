import { Prisma } from "@/app/lib/Prisma";
import {  Product } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


function generateSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-") // Replace invalid characters with "-"
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}

export async function POST(request: NextRequest) {
  try {
    const body: Omit<Product, "id" | "createdAt" | "updatedAt"> = await request.json();

    // Validate required fields
    if (!body.name || !body.price || !body.categoryId) {
      return NextResponse.json(
        { error: "Name, price, and categoryId are required fields." },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const processedSlug = body.slug ? generateSlug(body.slug) : generateSlug(body.name);

    // Validate slug format
    if (!processedSlug || !/^[a-z0-9-]+$/.test(processedSlug)) {
      return NextResponse.json(
        { error: "Slug can only contain lowercase letters, numbers, and hyphens." },
        { status: 400 }
      );
    }

    // Check category exists
    const category = await Prisma.category.findUnique({
      where: { id: body.categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    // Check for existing product with the same name or slug
    const existingProduct = await Prisma.product.findFirst({
      where: {
        OR: [{ name: body.name }, { slug: processedSlug }],
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this name or slug already exists." },
        { status: 409 }
      );
    }

    // Create the product
    const product = await Prisma.product.create({
      data: {
        name: body.name,
        slug: processedSlug,
        description: body.description,
        price: body.price,
        isOffer: body.isOffer ?? false,
        offerPrice: body.offerPrice,
        categoryId: body.categoryId,
        isAvailable: body.isAvailable ?? true,
        imageUrl: body.imageUrl,
        stock: body.stock,
        tags: body.tags || [],
        servingTimes: body.servingTimes?.length ? body.servingTimes : ["ANYTIME"],
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
