import Button from "../Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { z } from "zod";

type CreditCardFormProps = {
  merchantId: number;
  transactionUnique: string;
  paymentIntent: string;
  currency: string;
  price: number;
};

export default function CreditCardForm({
  merchantId,
  transactionUnique,
  paymentIntent,
  currency,
  price,
}: CreditCardFormProps) {
  const [companyOrIndividual, setCompanyOrIndividual] = useState("individual");

  const router = useRouter();
  const [errors, setErrors] = useState({
    given_name: {
      error: false,
      message: "",
    },
    family_name: {
      error: false,
      message: "",
    },
    company_name: {
      error: false,
      message: "",
    },
    email: {
      error: false,
      message: "",
    },
    account_holder_name: {
      error: false,
      message: "",
    },
    branch_code: {
      error: false,
      message: "",
    },
    account_number: {
      error: false,
      message: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  async function processPayment(data: any) {
    try {
      const response = await axios.post(
        `/api/blink/process-direct-debit`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data.url;
    } catch (error: any) {
      alert("Error processing payment, check your account details");
      router.reload();
    }
  }

  useEffect(() => {
    setErrors((prevState) => ({
      ...prevState,
      given_name: {
        error: false,
        message: "",
      },
      family_name: {
        error: false,
        message: "",
      },
      company_name: {
        error: false,
        message: "",
      },
      email: {
        error: false,
        message: "",
      },
      account_holder_name: {
        error: false,
        message: "",
      },
      branch_code: {
        error: false,
        message: "",
      },
      account_number: {
        error: false,
        message: "",
      },
    }));
  }, [companyOrIndividual]);

  const directDebitgCompanyFormSchema = z.object({
    transaction_unique: z.string(),
    payment_intent: z.string(),
    company_name: z.string().min(1, "Enter your company name"),
    email: z
      .string()
      .min(1, "Enter your email address")
      .email("Enter a valid email address"),
    account_holder_name: z.string().min(1, "Enter the account holder name"),
    branch_code: z.string().min(1, "Enter the branch code"),
    account_number: z.string().min(1, "Enter the account number"),
  });

  const directDebitIndividualFormSchema = z.object({
    transaction_unique: z.string(),
    payment_intent: z.string(),
    given_name: z.string().min(1, "Enter your first name"),
    family_name: z.string().min(1, "Enter your last name"),
    email: z
      .string()
      .min(1, "Enter your email address")
      .email("Enter a valid email address"),
    account_holder_name: z.string().min(1, "Enter the account holder name"),
    branch_code: z.string().min(1, "Enter the branch code"),
    account_number: z.string().min(1, "Enter the account number"),
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const object: { [key: string]: string } = {};
    formData.forEach((value, key) => (object[key] = value as string));

    let resultData;

    if (companyOrIndividual === "individual") {
      const result = directDebitIndividualFormSchema.safeParse(object);
      if (!result.success) {
        const given_name = result.error.issues.find(
          (issue) => issue.path[0] === "given_name",
        );

        const family_name = result.error.issues.find(
          (issue) => issue.path[0] === "family_name",
        );

        const email = result.error.issues.find(
          (issue) => issue.path[0] === "email",
        );

        const account_holder_name = result.error.issues.find(
          (issue) => issue.path[0] === "account_holder_name",
        );

        const branch_code = result.error.issues.find(
          (issue) => issue.path[0] === "branch_code",
        );

        const account_number = result.error.issues.find(
          (issue) => issue.path[0] === "account_number",
        );

        if (given_name) {
          setErrors((prevState) => ({
            ...prevState,
            given_name: {
              error: true,
              message: given_name.message,
            },
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            given_name: {
              error: false,
              message: "",
            },
          }));
        }

        if (family_name) {
          setErrors((prevState) => ({
            ...prevState,
            family_name: {
              error: true,
              message: family_name.message,
            },
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            family_name: {
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

        if (account_holder_name) {
          setErrors((prevState) => ({
            ...prevState,
            account_holder_name: {
              error: true,
              message: account_holder_name.message,
            },
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            account_holder_name: {
              error: false,
              message: "",
            },
          }));
        }

        if (branch_code) {
          setErrors((prevState) => ({
            ...prevState,
            branch_code: {
              error: true,
              message: branch_code.message,
            },
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            branch_code: {
              error: false,
              message: "",
            },
          }));
        }

        if (account_number) {
          setErrors((prevState) => ({
            ...prevState,
            account_number: {
              error: true,
              message: account_number.message,
            },
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            account_number: {
              error: false,
              message: "",
            },
          }));
        }

        setIsLoading(false);
        return;
      }

      if (result.success) {
        resultData = result.data;
      }
    }

    if (companyOrIndividual === "company") {
      const result = directDebitgCompanyFormSchema.safeParse(object);

      if (!result.success) {
        const company_name = result.error.issues.find(
          (issue) => issue.path[0] === "company_name",
        );

        const email = result.error.issues.find(
          (issue) => issue.path[0] === "email",
        );

        const account_holder_name = result.error.issues.find(
          (issue) => issue.path[0] === "account_holder_name",
        );

        const branch_code = result.error.issues.find(
          (issue) => issue.path[0] === "branch_code",
        );

        const account_number = result.error.issues.find(
          (issue) => issue.path[0] === "account_number",
        );

        if (company_name) {
          setErrors((prevState) => ({
            ...prevState,
            company_name: {
              error: true,
              message: company_name.message,
            },
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            company_name: {
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

        if (account_holder_name) {
          setErrors((prevState) => ({
            ...prevState,
            account_holder_name: {
              error: true,
              message: account_holder_name.message,
            },
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            account_holder_name: {
              error: false,
              message: "",
            },
          }));
        }

        if (branch_code) {
          setErrors((prevState) => ({
            ...prevState,
            branch_code: {
              error: true,
              message: branch_code.message,
            },
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            branch_code: {
              error: false,
              message: "",
            },
          }));
        }

        if (account_number) {
          setErrors((prevState) => ({
            ...prevState,
            account_number: {
              error: true,
              message: account_number.message,
            },
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            account_number: {
              error: false,
              message: "",
            },
          }));
        }

        setIsLoading(false);
        return;
      }
      if (result.success) {
        resultData = result.data;
      }
    }

    const redirectUrl = await processPayment(resultData);
    console.log(redirectUrl);
    setIsLoading(false);
    if (!redirectUrl) return;
    router.push(redirectUrl);
  }

  return (
    <form id="payment" onSubmit={handleSubmit} className="h-fit w-full">
      <div className="pb-8 font-medium">
        <label className="mb-4 block">
          Are you an individual or a company?
        </label>
        <button
          type="button"
          onClick={() => setCompanyOrIndividual("individual")}
          className={`${
            companyOrIndividual === "individual"
              ? "border-2 border-solid border-black text-gray-900"
              : "border-2 border-solid border-gray-200 text-gray-900"
          } mr-4 rounded-md px-4 py-2`}
        >
          Individual
        </button>

        <button
          type="button"
          onClick={() => setCompanyOrIndividual("company")}
          className={`${
            companyOrIndividual === "company"
              ? "border-2 border-solid border-black text-gray-900"
              : "border-2 border-solid border-gray-200 text-gray-900"
          } rounded-md px-4 py-2`}
        >
          Company
        </button>
      </div>
      <input type="hidden" name="merchantID" defaultValue={merchantId} />
      <input
        type="hidden"
        name="transaction_unique"
        defaultValue={transactionUnique}
      />
      <input type="hidden" name="payment_intent" defaultValue={paymentIntent} />
      <input
        type="hidden"
        name="transaction_unique"
        defaultValue={transactionUnique}
      />
      <input type="hidden" name="resource" defaultValue="directdebits" />

      {companyOrIndividual === "individual" && (
        <>
          <label className="mb-4 block">Your info</label>
          <div className="fieldgroup-container mb-4">
            <input
              type="text"
              name="given_name"
              placeholder="Your first name"
            />
          </div>
          {errors.given_name.error && (
            <p className="mb-4 text-red-500">{errors.given_name.message}</p>
          )}

          <div className="fieldgroup-container mb-4">
            <input
              type="text"
              placeholder="Your last name"
              name="family_name"
            />
          </div>
          {errors.family_name.error && (
            <p className="mb-4 text-red-500">{errors.family_name.message}</p>
          )}
        </>
      )}

      {companyOrIndividual === "company" && (
        <>
          <div className="fieldgroup-container mb-4">
            <label className="mb-2 block">Your company info</label>
            <input
              type="text"
              placeholder="Your company name"
              name="company_name"
            />
          </div>
          {errors.company_name.error && (
            <p className="mb-4 text-red-500">{errors.company_name.message}</p>
          )}
        </>
      )}

      <div className="fieldgroup-container mb-8">
        <input type="text" placeholder="Your email" name="email" />
        {errors.email.error && (
          <p className="mt-4 text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="fieldgroup-container mb-4">
        <label className="mb-4 block">Account details</label>
        <input
          type="text"
          placeholder="Account holder name"
          name="account_holder_name"
        />
      </div>
      {errors.account_holder_name.error && (
        <p className="mb-4 text-red-500">
          {errors.account_holder_name.message}
        </p>
      )}

      <div className="fieldgroup-container mb-4">
        <input type="text" placeholder="Branch code" name="branch_code" />
      </div>
      {errors.branch_code.error && (
        <p className="mb-4 text-red-500">{errors.branch_code.message}</p>
      )}

      <div className="fieldgroup-container mb-4">
        <input
          type="text"
          placeholder="Bank account number"
          name="account_number"
        />
      </div>
      {errors.account_number.error && (
        <p className="mb-4 text-red-500">{errors.account_number.message}</p>
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
