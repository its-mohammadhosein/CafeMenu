import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import HomePageProductsLists from "./Component/homePageProductsLists";

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* <LoginForm /> */}
      <HomePageProductsLists/>
    </div>
  );
}
