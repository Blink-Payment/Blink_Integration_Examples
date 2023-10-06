import { useEffect, useState, useRef, useCallback } from "react";
import { PaymentFormSkeleton } from "../PaymentFormSkeleton";
import axios from "axios";
import { PaymentMethodButton } from "../PaymentMethodButton";
import Card from "../Icons/Card";
import DirectDebit from "../Icons/DirectDebit";
import OpenBanking from "../Icons/OpenBanking";
import CreditCardForm from "./CreditCardForm";
import OpenBankingForm from "./OpenBankingForm";
import DirectDebitForm from "./DirectDebitForm";

type PaymentFormProps = {
  price: number;
  currency: string;
};

type InitiatePaymentApiResponse = {
  id: number;
  payment_intent: string;
  transaction_type: string;
  expiry_date: string;
  amount: number;
  currency: string;
  payment_type: string;
  return_url: string;
  notification_url: string;
  card_layout: string;
  element: {
    ccElement: string;
    obElement: string;
    ddElement: string;
  };
  merchant_id: number;
  transaction_unique: string;
};

export default function PaymentForm({ price, currency }: PaymentFormProps) {
  const [paymentIntent, setPaymentIntent] =
    useState<InitiatePaymentApiResponse | null>(null);
  const [paymentType, setPaymentType] = useState<string>("credit-card");

  async function getPaymentIntent(
    price: number,
    currency: string,
    paymentType: string,
  ) {
    try {
      const response = await axios.post(
        `/api/blink/initiate-payment`,
        {
          price,
          currency,
          publishableKey: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
          amount: price,
          paymentType,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data.form;
    } catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchPaymentIntent() {
      setPaymentIntent(null);
      const response = await getPaymentIntent(price, currency, paymentType);
      if (!response) return;
      setPaymentIntent(response);
    }

    fetchPaymentIntent();
  }, [paymentType, currency, price]);

  return (
    <div className="w-full max-w-2xl px-4 md:px-12">
      {paymentIntent ? (
        <>
          <div className="mb-8 flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">Choose payment method</h2>
            <p className="text-lg">
              You can pay with card, open banking, or Direct Debit.
            </p>
          </div>
          <div className="mb-12 flex flex-col flex-wrap gap-4 md:flex-row md:gap-0 md:space-x-8">
            <PaymentMethodButton
              method="credit-card"
              paymentType={paymentType}
              setPaymentType={setPaymentType}
              icon={Card}
              name="Card"
            />
            <PaymentMethodButton
              method="open-banking"
              paymentType={paymentType}
              setPaymentType={setPaymentType}
              icon={OpenBanking}
              name="Open Banking"
            />
            <PaymentMethodButton
              method="direct-debit"
              paymentType={paymentType}
              setPaymentType={setPaymentType}
              icon={DirectDebit}
              name="Direct Debit"
            />
          </div>
          <h3 className="mb-8 text-xl font-semibold">
            Pay with{" "}
            {paymentType === "credit-card"
              ? "card"
              : paymentType === "open-banking"
              ? "open banking"
              : "Direct Debit"}
          </h3>
          {paymentType && paymentType === "credit-card" && (
            <CreditCardForm
              merchantId={paymentIntent.merchant_id}
              transactionUnique={paymentIntent.transaction_unique}
              paymentIntent={paymentIntent.payment_intent}
              currency={currency}
              price={price}
            />
          )}
          {paymentType && paymentType === "open-banking" && (
            <OpenBankingForm
              paymentIntent={paymentIntent.payment_intent}
              transactionUnique={paymentIntent.transaction_unique}
              merchantId={paymentIntent.merchant_id}
              currency={currency}
              price={price}
            />
          )}
          {paymentType && paymentType === "direct-debit" && (
            <DirectDebitForm
              paymentIntent={paymentIntent.payment_intent}
              transactionUnique={paymentIntent.transaction_unique}
              merchantId={paymentIntent.merchant_id}
              currency={currency}
              price={price}
            />
          )}
        </>
      ) : (
        <div className="h-fit w-full">
          <PaymentFormSkeleton />
        </div>
      )}
    </div>
  );
}
