import { Product } from "@prisma/client";
import { atomWithStorage } from "jotai/utils";
interface Cart {
  [key: string]: {
    product: Product;
    quantity: number;
  };
}

export const localCart = atomWithStorage<Cart>("cart", {});
