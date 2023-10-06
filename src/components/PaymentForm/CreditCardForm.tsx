import { useState, useEffect, useCallback } from "react";
import Button from "../Button";
import { z } from "zod";
import axios from "axios";
import Modal from "../Modal";
import { useRouter } from "next/router";
import {
  getRemoteAddress,
  getDeviceDetails,
  decodeAndSanitize,
  hostedFieldsSetup,
} from "./utils";

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
  const [deviceDetails, setDeviceDetails] = useState<{
    device_timezone: string;
    device_capabilities: string;
    device_accept_language: string;
    device_screen_resolution: string;
  } | null>(null);

  const [remoteAddress, setRemoteAddress] = useState<string | null>(null);
  const [secureForm, setSecureForm] = useState<TrustedHTML | null>(null);
  const [formIsLoading, setFormIsLoading] = useState<boolean>(false);
  const [paymentToken, setPaymentToken] = useState<string>("");
  const [errors, setErrors] = useState<{
    cardDetails: {
      error: boolean;
      message: string;
    };
    name: {
      error: boolean;
      message: string;
    };
    email: {
      error: boolean;
      message: string;
    };
  }>({
    cardDetails: {
      error: false,
      message: "",
    },
    name: {
      error: false,
      message: "",
    },
    email: {
      error: false,
      message: "",
    },
  });

  const router = useRouter();

  const creditCardFormSchema = z.object({
    paymentToken: z.string().min(1),
    merchantID: z.string(),
    transaction_unique: z.string(),
    payment_intent: z.string(),
    customer_name: z.string().min(1, "Enter the name on your card"),
    customer_email: z
      .string()
      .min(1, "Enter your email address")
      .email("Enter a valid email address"),
    device_timezone: z.string(),
    device_capabilities: z.string(),
    device_accept_language: z.string(),
    device_screen_resolution: z.string(),
    remote_address: z.string(),
    type: z.string(),
  });

  async function processPayment(data: any) {
    try {
      const response = await axios.post(`/api/blink/process-card`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const form = decodeAndSanitize(
        response.data.acsform,
      ) as unknown as TrustedHTML;

      setSecureForm(form);
    } catch (error: any) {
      console.log(error);
      alert("Error processing payment");
      router.reload();
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form: HTMLFormElement | null = document.querySelector("#payment");
    async function getPaymentDetails() {
      if (!form) return;
      const hostedForm: any = $(form).hostedForm("instance");
      try {
        const response = await hostedForm.getPaymentDetails();
        if (response.success) {
          setPaymentToken(response.paymentToken);
          setErrors((prevState) => ({
            ...prevState,
            cardDetails: {
              error: false,
              message: "",
            },
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            cardDetails: {
              error: true,
              message: response.message,
            },
          }));
        }
        return response.paymentToken;
      } catch {
        setErrors((prevState) => ({
          ...prevState,
          cardDetails: {
            error: true,
            message: "Failed to get payment details",
          },
        }));
      }
    }

    async function validateFormThenProcessPayment() {
      setFormIsLoading(true);
      const paymentToken = await getPaymentDetails();
      if (!form) return;
      const formData = new FormData(form);
      const object: { [key: string]: string } = {};
      formData.forEach((value, key) => (object[key] = value as string));
      if (object.paymentToken === "" || !object.paymentToken)
        object.paymentToken = paymentToken;

      const result = creditCardFormSchema.safeParse(object);

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
        setFormIsLoading(false);
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
        await processPayment(result.data);
        setFormIsLoading(false);
      }
    }
    validateFormThenProcessPayment();
  }

  useEffect(() => {
    async function fetchRemoteAddress() {
      try {
        const remoteAddress = await getRemoteAddress();
        setRemoteAddress(remoteAddress);
      } catch (error) {
        console.log(error);
        setRemoteAddress(null);
      }
    }
    fetchRemoteAddress();
    const deviceDetails = getDeviceDetails();
    setDeviceDetails((prevState) => ({
      ...prevState,
      ...deviceDetails,
    }));
    hostedFieldsSetup("#payment");
  }, []);

  return (
    <>
      <form onSubmit={onSubmit} id="payment" className="h-fit w-full">
        <input type="hidden" name="paymentToken" value={paymentToken} />
        <input type="hidden" name="merchantID" defaultValue={merchantId} />
        <input
          type="hidden"
          name="transaction_unique"
          defaultValue={transactionUnique}
        />
        <input
          type="hidden"
          name="payment_intent"
          defaultValue={paymentIntent}
        />
        <label className="block pb-3">Card information</label>
        <div className="fieldgroup-container nowrap relative mb-4">
          <input
            type="hostedfield:cardNumber"
            placeholder="1234 1234 1234 1234"
          />
          <input type="hostedfield:cardExpiryDate" placeholder="MM/YY" />
          <input type="hostedfield:cardCVV" placeholder="CVV" />
        </div>
        {errors.cardDetails.error && (
          <p className="mb-4 text-red-500">{errors.cardDetails.message}</p>
        )}
        <label className="block pb-3">Name on card</label>
        <div className="fieldgroup-container mb-4">
          <input type="text" name="customer_name" placeholder="Your name" />
        </div>
        {errors.name.error && (
          <p className="mb-4 text-red-500">{errors.name.message}</p>
        )}
        <label className="block pb-3">Email</label>
        <div className="fieldgroup-container mb-4">
          <input type="text" name="customer_email" placeholder="Your email" />
        </div>
        {errors.email.error && (
          <p className="mb-4 text-red-500">{errors.email.message}</p>
        )}
        <input
          type="hidden"
          id="device_timezone"
          name="device_timezone"
          defaultValue={deviceDetails?.device_timezone ?? ""}
        />
        <input
          type="hidden"
          id="device_capabilities"
          name="device_capabilities"
          defaultValue={deviceDetails?.device_capabilities ?? ""}
        />
        <input
          type="hidden"
          id="device_accept_language"
          name="device_accept_language"
          defaultValue={deviceDetails?.device_accept_language ?? ""}
        />
        <input
          type="hidden"
          id="device_screen_resolution"
          name="device_screen_resolution"
          defaultValue={deviceDetails?.device_screen_resolution ?? ""}
        />
        <input
          type="hidden"
          id="remote_address"
          name="remote_address"
          defaultValue={remoteAddress ? remoteAddress : ""}
        />
        <input type="hidden" id="type" name="type" value="1" />
        <Button isLoading={false} type="submit" variant="fullWidth">
          {!formIsLoading ? (
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
      <Modal
        isOpen={secureForm !== null}
        onClose={() => {
          setSecureForm(null);
          router.reload();
        }}
        iframeEnabled
        iframeContent={secureForm ? secureForm : ""}
      />
    </>
  );
}
