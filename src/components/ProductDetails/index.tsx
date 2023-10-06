import Back from "../Icons/Back";
import Logo from "../Logo";
import { Product } from "../ProductCard";

type ProductDetailsProps = {
  currency: string;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  price: number;
  name: string;
  description: string;
  image: string;
};

export default function ProductDetails({
  currency,
  setSelectedProduct,
  price,
  name,
  description,
  image,
}: ProductDetailsProps) {
  function handleBack() {
    setSelectedProduct(null);
  }
  return (
    <div className="flex w-full flex-col  justify-center gap-4 rounded-bl-2xl rounded-br-2xl bg-blue-100  bg-gradient-winter lg:w-2/3 lg:rounded-none xl:w-2/5 2xl:w-5/12">
      <div className="xl:max-w-1xl y-10 mx-auto flex w-full max-w-2xl flex-col gap-4 px-6 py-10 pr-14 md:px-14 lg:max-w-md xl:max-w-xl 2xl:max-w-2xl  ">
        <Logo />
        <div className="pb-4" />
        <button onClick={handleBack} className="mb-8 flex items-center gap-2">
          <Back />
          <span className="text-lg font-medium">Back to store</span>
        </button>
        <h2 className="text-4xl font-semibold ">{name}</h2>
        <p className="text-xl text-slate-500">{description}</p>
        <div className="mt-4">
          <span className="text-md rounded-3xl bg-primary px-5 py-2 text-white ">
            {currency === "USD" && "$"}
            {currency === "EUR" && "€"}
            {currency === "GBP" && "£"}
            {price.toFixed(2)}
          </span>
        </div>
        <div className="mt-7 h-[10rem] w-[10rem] lg:mt-14 lg:h-[15rem] lg:w-[15rem]">
          <img
            className="h-full w-full rounded-xl object-cover"
            src={image}
            alt={name}
          />
        </div>
      </div>
    </div>
  );
}
