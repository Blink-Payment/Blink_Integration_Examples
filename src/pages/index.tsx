import { useState } from "react";
import { ProductCard, Product, ProductProps } from "../components/ProductCard";
import PaymentForm from "../components/PaymentForm";
import ProductDetails from "@/components/ProductDetails";
import { Plus_Jakarta_Sans } from "next/font/google";
import Logo from "@/components/Logo";

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <main
      className={`${plusJakartaSans.variable} flex h-screen flex-col items-center gap-12 bg-orange-100 font-sans`}
    >
      {selectedProduct ? (
        <>
          <div className="flex h-full w-full flex-col bg-white lg:flex-row">
            <ProductDetails
              {...selectedProduct}
              setSelectedProduct={setSelectedProduct}
            />
            <div className="mx-auto flex h-full w-full max-w-4xl items-center justify-center py-10">
              <PaymentForm
                price={selectedProduct.price}
                currency={selectedProduct.currency}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gradient-winter flex h-fit w-full flex-col justify-center gap-20  px-10 py-20 lg:h-full">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-8">
            <Logo />
            <h1 className=" mt-5 text-center text-5xl font-semibold">
              Example storefront
            </h1>
            <h2 className="mb-12 text-center text-2xl font-normal">
              An demo example of how to use Blink{"'"}s API{"'"}s to start
              accepting payments.
            </h2>
          </div>
          <div className="container mx-auto">
            <div className="flex flex-col items-center gap-4">
              <div className="grid h-full w-fit grid-cols-1 gap-12 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.name}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    currency={product.currency}
                    setSelectedProduct={setSelectedProduct}
                    image={product.image}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
