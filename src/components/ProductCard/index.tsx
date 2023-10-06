import axios from "axios";
import Button from "../Button";

export type Product = {
  price: number;
  name: string;
  description: string;
  currency: string;
  image: string;
};

export type ProductProps = Product & {
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  image: string;
};

export function ProductCard({
  price,
  name,
  description,
  currency,
  image,
  setSelectedProduct,
}: ProductProps) {
  return (
    <div className="flex max-w-sm flex-col justify-between rounded-xl bg-white p-6 shadow-lg">
      <img
        src={image}
        alt="Product Image"
        className="mb-6 h-48 w-full rounded-md object-cover"
      />

      <h2 className="mb-2 text-xl font-bold">{name}</h2>
      <p className="mb-24 text-gray-700">{description}</p>

      <div className="mb-4 flex items-center justify-between">
        <span className="text-lg font-semibold">
          {currency === "USD" && "$"}
          {currency === "EUR" && "€"}
          {currency === "GBP" && "£"}
          {price.toFixed(2)}
        </span>
        <Button
          onClick={() =>
            setSelectedProduct({
              price,
              name,
              description,
              currency,
              image,
            })
          }
          variant="pill"
        >
          Buy now
        </Button>
      </div>
    </div>
  );
}
