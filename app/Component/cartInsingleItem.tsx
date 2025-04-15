"use client";
import { useAtom } from "jotai";
import React from "react";
import { localCart } from "@/app/lib/Atoms";
import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";
import { object } from "zod";

interface prop {
  product: Product;
}

export default function CartInSingleItem({ product }: prop) {
  const [cart, setCart] = useAtom(localCart);

  return (
    <div className="w-full flex-1 rounded-[20px] bg-[#303439]">
      <Button>Add to Cart</Button>
    </div>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const [cart, setCart] = useAtom(localCart);

  const handleAddToCart = () => {
    if(cart[product.slug]){
        setCart({
            ...cart,
            [product.slug]: {
            product,
            quantity: cart[product.slug].quantity + 1,
            },
        });
    }else{
        setCart({
            ...cart,
            [product.slug]: {
                product,
                quantity: 1,
            },
        })
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      className="bg-[#6345FE] rounded-[15px] w-[50%] h-full text-wrap relative"
    >
      Add to Cart
      {cart?.[product.slug]?.quantity > 0 && (
        <span className="absolute top-0 left-0 -translate-y-[3px] bg-gray-800 rounded-full p-1 text-xs w-5 h-5 flex items-center justify-center">
          {cart[product.slug]?.quantity}
        </span>
      )}
    </Button>
  );
}
