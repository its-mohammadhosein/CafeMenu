import { Prisma } from "@/app/lib/Prisma";
import { NextRequest, NextResponse } from "next/server";

// Function to generate a slug from a name
const generateSlug = (name: string) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-") // Replace invalid characters with "-"
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
};

// GET - Fetch product by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    const product = await Prisma.product.findUnique({
      where: { slug },
      include: { category: true }, // Include category details
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product." },
      { status: 500 }
    );
  }
}

// PUT - Update product by slug
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();

    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    // Check if the product exists
    const existingProduct = await Prisma.product.findUnique({
      where: { slug },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    // Auto-generate slug from name if updating name
    const updatedSlug = body.name
      ? generateSlug(body.name)
      : existingProduct.slug;

    // Ensure unique name and slug
    const duplicateProduct = await Prisma.product.findFirst({
      where: {
        OR: [{ name: body.name }, { slug: updatedSlug }],
        NOT: { id: existingProduct.id }, // Exclude current product
      },
    });

    if (duplicateProduct) {
      return NextResponse.json(
        { error: "Another product with this name or slug already exists." },
        { status: 409 }
      );
    }

    // Update the product
    const updatedProduct = await Prisma.product.update({
      where: { slug },
      data: {
        name: body.name ?? existingProduct.name,
        slug: updatedSlug,
        description: body.description,
        price: body.price ?? existingProduct.price,
        isOffer: body.isOffer ?? existingProduct.isOffer,
        offerPrice: body.offerPrice,
        categoryId: body.categoryId ?? existingProduct.categoryId,
        isAvailable: body.isAvailable ?? existingProduct.isAvailable,
        imageUrl: body.imageUrl ?? existingProduct.imageUrl,
        stock: body.stock ?? existingProduct.stock,
        tags: body.tags ?? existingProduct.tags,
        servingTimes: body.servingTimes ?? existingProduct.servingTimes,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}
