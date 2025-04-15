// general types
export enum Role {
  GUEST = "GUEST",
  STAFF = "STAFF",
  ADMIN = "ADMIN",
}

export enum ServingTime {
  BREAKFAST = "BREAKFAST",
  LUNCH = "LUNCH",
  DINNER = "DINNER",
  ANYTIME = "ANYTIME",
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  orders: Order[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  isOffer: boolean;
  offerPrice?: number;
  categoryId: number;
  category: Category;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  stock?: number;
  tags: string[];
  orders: Order[];
  servingTimes: ServingTime[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  products: Product[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: number;
  userId: string;
  user: User;
  products: Product[];
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface params {
  [key: string]: string;
}
