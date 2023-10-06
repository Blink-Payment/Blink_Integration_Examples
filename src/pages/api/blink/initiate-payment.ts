import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { z } from "zod";

type TokenResponse = {
  access_token: string;
  expired_on: string;
  payment_types: string[];
  currency: string;
  payment_api_status: boolean;
  send_blink_receipt: boolean;
  enable_moto_payments: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { BLINK_API_KEY, BLINK_API_SECRET, NEXT_PUBLIC_PUBLISHABLE_KEY } =
    process.env;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL
    : process.env.NEXT_PUBLIC_VERCEL_URL;

  if (
    !BLINK_API_KEY ||
    !BLINK_API_SECRET ||
    !NEXT_PUBLIC_PUBLISHABLE_KEY ||
    !baseUrl
  ) {
    return res.status(500).json({ error: "Invalid config" });
  }

  const schema = z.object({
    amount: z.number(),
    currency: z.string(),
    paymentType: z.union([
      z.literal("open-banking"),
      z.literal("credit-card"),
      z.literal("direct-debit"),
    ]),
    publishableKey: z.string(),
  });

  const parsedBody = schema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({ error: parsedBody.error });
  }

  if (req.body.publishableKey !== NEXT_PUBLIC_PUBLISHABLE_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  async function getToken(): Promise<TokenResponse> {
    try {
      const response = await axios.post(
        "https://secure.blinkpayment.co.uk/api/pay/v1/tokens",
        {
          api_key: BLINK_API_KEY,
          secret_key: BLINK_API_SECRET,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.dir(error, { depth: null });
      throw new Error(error);
    }
  }

  try {
    const { access_token } = await getToken();
    const response = await axios.post(
      "https://secure.blinkpayment.co.uk/api/pay/v1/intents",
      {
        amount: parsedBody.data.amount,
        currency: parsedBody.data.currency,
        transaction_type: "SALE",
        payment_type: parsedBody.data.paymentType,
        return_url: `${baseUrl}/payment-success`,
        notification_url: `${baseUrl}/api/blink/payment-notification`,
        card_layout: "single-line",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    console.dir(response.data, { depth: null });

    return res.status(200).json({ form: response.data });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json(error);
  }
}
