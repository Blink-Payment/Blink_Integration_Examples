import { useState } from "react";
import { ProductCard, Product, ProductProps } from "../components/ProductCard";
import PaymentForm from "../components/PaymentForm";
import ProductDetails from "@/components/ProductDetails";
import { Plus_Jakarta_Sans } from "next/font/google";
import Logo from "@/components/Logo";
import { useSearchParams } from "next/navigation";

const products: Product[] = [
  {
    name: "Donut",
    description: "A tasty treat to start your day",
    price: 2.99,
    currency: "GBP",
    image: "https://loremflickr.com/250/250/coffee-beans?lock=2743448612372480",
  },
  {
    name: "Latte",
    description: "A delicious caffeinated cup of joy",
    price: 2.5,
    currency: "GBP",
    image: "https://loremflickr.com/250/250/coffee-beans?lock=1518637902987264",
  },
  {
    name: "Beans",
    description: "Make our delicious coffee in the comfort of your own home",
    price: 8.99,
    currency: "GBP",
    image: "https://loremflickr.com/250/250/coffee-beans?lock=5383783945601024",
  },
];

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export default function Home() {
  const searchParams = useSearchParams();

  function decodeAndReplace(input: string): string {
    return decodeURIComponent(input).replace("+", " ");
  }

  const transactionId = searchParams.get("transaction_id") || null;
  const status = searchParams.get("status") || null;
  const note = searchParams.get("note") || null;

  return (
    <main
      className={`${plusJakartaSans.variable} flex h-screen flex-col items-center gap-12 font-sans`}
    >
      <div className="flex h-fit w-full flex-col justify-center gap-20  px-10 py-20 lg:h-full">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-8">
          <h1 className=" mt-5 text-center text-2xl font-semibold">
            Payment success 🎉
          </h1>
          <h2 className="mb-12 text-center text-2xl font-normal">
            {transactionId && status && note ? (
              <>
                <p>Transaction ID: {decodeAndReplace(transactionId)}</p>
                <p>Status: {decodeAndReplace(status)}</p>
                <p>Note: {decodeAndReplace(note)}</p>
              </>
            ) : (
              <p>Your payment has been processed successfully!</p>
            )}
          </h2>
        </div>
      </div>
    </main>
  );
}
