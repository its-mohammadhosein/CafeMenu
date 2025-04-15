import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Function to generate a slug from a name
const generateSlug = (name: string) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-") // Replace invalid characters with "-"
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
};

// GET - Fetch category by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { slug },
      include: { products: true }, // Include related products
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category." },
      { status: 500 }
    );
  }
}

// PUT - Update category by slug
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

    // Check if the category exists
    const existingCategory = await prisma.category.findUnique({ where: { slug } });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    // Auto-generate slug from name if updating name
    const updatedSlug = body.name ? generateSlug(body.name) : existingCategory.slug;

    // Ensure unique name and slug
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name: body.name }, { slug: updatedSlug }],
        NOT: { id: existingCategory.id }, // Exclude current category
      },
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { error: "Another category with this name or slug already exists." },
        { status: 409 }
      );
    }

    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { slug },
      data: {
        name: body.name ?? existingCategory.name,
        slug: updatedSlug,
        description: body.description ?? existingCategory.description,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category." },
      { status: 500 }
    );
  }
}
