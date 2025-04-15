import { Prisma } from "@/app/lib/Prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const categories = await Prisma.category.findMany()
    if(categories){
        return NextResponse.json(categories)
    }
  return NextResponse.json(
    {
      message: "we got an error while finding categories",
    },
    { status: 500 }
  );
}
