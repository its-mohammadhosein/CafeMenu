import React from "react";
import { params } from "@/app/lib/generalTypes";

export default function page({ params }: { params: params }) {
  const isShortItem = true;
  return (
    <div className="@container flex flex-col items-center pt-8 bg-[#1D1E21]  h-screen gap-6">
      <div
        // key={item.id}
        className={`bg-[#929292] font-d p-4 rounded-[35px] w-[90%] flex flex-col gap-2 ${
          isShortItem ? "h-[250px]" : "h-[300px]"
        } justify-between transition-transform z`}
      >
        <div className="w-full flex flex-col gap-2">
          <h2 className="text-[24px] font-semibold">item.name</h2>
          <p className="text-gray-100 line-clamp-3">item.description</p>
        </div>
        <div className="w-full bg-white rounded-[30px] h-[60px] flex items-center px-4 justify-between">
          <span className="font-medium">item.name</span>
          <span className="text-lg font-bold">item.price$</span>
        </div>
      </div>
      <div className="gap-4 w-[90%] flex-1 [&>div]:h-full flex">
        <div className="bg- -700 flex-[0_0_53%] flex flex-col gap-3">
          <div className="flex flex-1 [&>div]:h-full gap-4 [&>div]:flex-1 -2">
            <div className="bg-[#6345FE] rounded-[15px]"></div>
            <div className="bg-white rounded-[15px]"></div>
          </div>
          <div className="w-full flex-1 rounded-[20px] bg-[#303439]"></div>
        </div>
        <div className="bg-[#E7F0FF] flex-1 rounded-[20px]"></div>
      </div>
    </div>
  );
}
