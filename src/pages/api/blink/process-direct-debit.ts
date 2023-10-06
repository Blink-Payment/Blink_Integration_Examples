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
  console.log(req.body, "req.body");

  try {
    const { access_token } = await getToken();
    const response = await axios.post(
      "https://secure.blinkpayment.co.uk/api/pay/v1/directdebits",
      {
        ...req.body,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    console.log(response.data, "response.data");

    return res.status(200).json({ url: response.data.url });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json(error);
  }
}
