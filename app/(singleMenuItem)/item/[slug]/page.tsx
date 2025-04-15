import CartInsingleItem, { AddToCart } from "@/app/Component/cartInsingleItem";
import { params } from "@/app/lib/generalTypes";
import { links } from "@/app/lib/links";
import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";

export default async function Page({ params }: { params: params }) {
  const isShortItem = true;
  const slug = await params;
  try {
    const response = await fetch(
      `${links.baseUrl.dev}/api/products/${slug.slug}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const item = (await response.json()) as Product;

    return (
      <div className="@container flex flex-col items-center py-8 bg-[#1D1E21] h-screen gap-6">
        <div
          className={`bg-[#929292] font-d p-4 rounded-[35px] w-[90%] flex  gap-2 h-[65%] items-center justify-between tranition-transform z`}
        >
          <div className="bg-[#929292] flex flex-col gap-2 justify-between transition-transform h-[50%]">
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-[24px] font-semibold">{item.name}</h2>
              <p className="text--100 line-clamp-3">{item.description}</p>
            </div>
            <div className="w-full bg-white rounded-[30px] h-[60px] flex items-center px-4 justify-between">
              <span className="font-medium">{item.name}</span>
              <span className="text-lg font-bold">${item.price}</span>
            </div>
          </div>
        </div>
        <div className="gap-4 w-[90%] flex-1 [&>div]:h-full flex">
          <div className="bg- -700 flex-[0_0_53%] flex flex-col gap-3">
            <div className="flex flex-1 [&>div]:h-full gap-4  -2">
              <AddToCart product={item} />
              <div className="bg-white rounded-[15px] w-[50%]"></div>
            </div>
            {/* <CartInsingleItem product={item} /> */}
            <div className="w-full flex-1 rounded-[20px] bg-[#303439]"></div>
          </div>
          <div className="bg-[#E7F0FF] flex-1 rounded-[20px]"></div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching product:", error);

    return (
      <div className="p-4 text-red-500 text-center">
        <h1 className="text-2xl font-bold">Error Loading Product</h1>
        <p className="mt-2">
          The product could not be loaded. Please try again later.
        </p>
      </div>
    );
  }
}
// Note: The error handling is basic and can be improved further.
