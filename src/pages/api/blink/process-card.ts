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
      "https://secure.blinkpayment.co.uk/api/pay/v1/creditcards",
      {
        payment_intent: req.body.payment_intent,
        paymentToken: req.body.paymentToken,
        type: req.body.type,
        raw_amount: req.body.raw_amount,
        transaction_unique: req.body.transaction_unique,
        device_timezone: req.body.device_timezone,
        device_capabilities: req.body.device_capabilities,
        device_accept_language: req.body.device_accept_language,
        device_screen_resolution: req.body.device_screen_resolution,
        remote_address: req.body.remote_address,
        customer_email: req.body.customer_email,
        customer_name: req.body.customer_name,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
          "Accept-Charset": "",
          "Accept-Encoding": "gzip, deflate, br",
          Accept: "*/*",
        },
      },
    );

    return res.status(200).json(response.data);
  } catch (error: any) {
    return res.status(500).json(error);
  }
}
