import React from "react";
import { Product } from "../lib/generalTypes";
import { links } from "../lib/links";
import Link from "next/link";
interface ProductResponse {
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  products: Product[];
}
export default async function HomePageProductsLists() {
  try {
    const response = await fetch(`${links.baseUrl.dev}/api/products`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = (await response.json()) as ProductResponse;

    // Split data into three columns
    const columns = data.products.reduce(
      (acc: Product[][], item, index) => {
        const columnIndex = index % 3;
        acc[columnIndex].push(item);
        return acc;
      },
      [[], [], []]
    );

    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <div className="w-full flex justify-start">
          <h1 className="text-2xl font-bold mb-6">Home Page Products Lists</h1>
        </div>
        <div id="mainContainer" className="@container flex gap-4 w-[80%]">
          {columns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className="flex-1 flex flex-col flex-wrap gap-4"
            >
              {column.map((item, itemIndex) => {
                const originalIndex = columnIndex + itemIndex * 3;
                const isShortItem = [1, 3].includes(originalIndex % 5);

                return (
                  <Link
                    href={`/item/${item.slug}`}
                    key={item.id}
                    className={`bg-[#929292] font-d p-4 rounded-[35px] w-full flex flex-col gap-2 ${
                      isShortItem ? "h-[250px]" : "h-[300px]"
                    } justify-between transition-transform z`}
                  >
                    <div className="w-full flex flex-col gap-2">
                      <h2 className="text-[24px] font-semibold">{item.name}</h2>
                      <p className="text-gray-100 line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                    <div className="w-full bg-white rounded-[30px] h-[60px] flex items-center px-4 justify-between">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-lg font-bold">{item.price}$</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <div className="p-4 text-red-500">
        <h1 className="text-2xl font-bold">Error Loading Products</h1>
        <p className="mt-2">Please try again later.</p>
      </div>
    );
  }
}
