import Button from "../Button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { z } from "zod";

type OpenBankingFormProps = {
  merchantId: number;
  transactionUnique: string;
  paymentIntent: string;
  currency: string;
  price: number;
};

export default function OpenBankingForm({
  merchantId,
  transactionUnique,
  paymentIntent,
  currency,
  price,
}: OpenBankingFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState({
    name: {
      error: false,
      message: "",
    },
    email: {
      error: false,
      message: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  async function processPayment(data: any) {
    try {
      const response = await axios.post(
        `/api/blink/process-open-banking`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data.redirect_url;
    } catch (error: any) {
      alert("Error processing payment");
      router.reload();
    }
  }

  const openBankingFormSchema = z.object({
    merchant_id: z.string(),
    transaction_unique: z.string(),
    payment_intent: z.string(),
    customer_name: z.string().min(1, "Enter the name on your card"),
    customer_email: z
      .string()
      .min(1, "Enter your email address")
      .email("Enter a valid email address"),
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const object: { [key: string]: string } = {};
    formData.forEach((value, key) => (object[key] = value as string));

    const result = openBankingFormSchema.safeParse(object);

    if (!result.success) {
      const name = result.error.issues.find(
        (issue) => issue.path[0] === "customer_name",
      );

      const email = result.error.issues.find(
        (issue) => issue.path[0] === "customer_email",
      );

      if (name) {
        setErrors((prevState) => ({
          ...prevState,
          name: {
            error: true,
            message: name.message,
          },
        }));
      } else {
        setErrors((prevState) => ({
          ...prevState,
          name: {
            error: false,
            message: "",
          },
        }));
      }

      if (email) {
        setErrors((prevState) => ({
          ...prevState,
          email: {
            error: true,
            message: email.message,
          },
        }));
      } else {
        setErrors((prevState) => ({
          ...prevState,
          email: {
            error: false,
            message: "",
          },
        }));
      }
      setIsLoading(false);
      return;
    }

    if (result.success) {
      setErrors((prevState) => ({
        ...prevState,
        name: {
          error: false,
          message: "",
        },
        email: {
          error: false,
          message: "",
        },
      }));
      const redirectUrl = await processPayment(result.data);
      setIsLoading(false);
      if (!redirectUrl) return;
      router.push(redirectUrl);
    }
  }

  return (
    <form onSubmit={handleSubmit} id="payment" className="h-fit w-full">
      <input type="hidden" name="merchant_id" defaultValue={merchantId} />
      <input type="hidden" name="payment_intent" defaultValue={paymentIntent} />
      <input
        type="hidden"
        name="transaction_unique"
        defaultValue={transactionUnique}
      />
      <input type="hidden" name="resource" defaultValue="openbankings" />
      <label className="mb-4 block">Your details</label>
      <div className="fieldgroup-container mb-4">
        <input type="text" name="customer_name" placeholder="Your name" />
      </div>
      {errors.name.error && (
        <p className="mb-4 text-red-500">{errors.name.message}</p>
      )}

      <div className="fieldgroup-container mb-4">
        <input type="text" placeholder="Your email" name="customer_email" />
      </div>
      {errors.email.error && (
        <p className="mb-4 text-red-500">{errors.email.message}</p>
      )}

      <Button type="submit" variant="fullWidth">
        {!isLoading ? (
          <>
            Pay {currency === "USD" && "$"} {currency === "EUR" && "€"}{" "}
            {currency === "GBP" && "£"}
            {price?.toFixed(2)}{" "}
          </>
        ) : (
          <>
            <svg
              className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        )}
      </Button>
    </form>
  );
}
