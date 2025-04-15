import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the type for the request body
interface CreateCategoryRequest {
  name: string;
  slug?: string; // Optional slug field
}

// Function to generate a default slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// POST /api/categories
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body: CreateCategoryRequest = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is a required field.' },
        { status: 400 }
      );
    }

    // Generate a slug if not provided
    const slug = body.slug ? body.slug : generateSlug(body.name);

    // Validate slug format (only letters, numbers, and hyphens allowed)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: 'Slug can only contain letters, numbers, and hyphens.' },
        { status: 400 }
      );
    }

    // Check if the category or slug already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name: body.name }, { slug }],
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name or slug already exists.' },
        { status: 409 }
      );
    }

    // Create the category in the database
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug,
      },
    });

    // Return the created category
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category.' },
      { status: 500 }
    );
  }
}