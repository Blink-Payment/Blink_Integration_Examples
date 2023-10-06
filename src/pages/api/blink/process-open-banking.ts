import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

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
      "https://secure.blinkpayment.co.uk/api/pay/v1/openbankings",
      {
        payment_intent: req.body.payment_intent,
        customer_email: req.body.customer_email,
        customer_name: req.body.customer_name,
        transaction_unique: req.body.transaction_unique,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return res.status(200).json({ redirect_url: response.data.redirect_url });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json(error);
  }
}
