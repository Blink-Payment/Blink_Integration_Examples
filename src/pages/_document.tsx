import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          defer
          src="https://code.jquery.com/jquery-3.6.3.min.js"
        ></script>
        <script
          defer
          src="https://gateway2.blinkpayment.co.uk/sdk/web/v1/js/hostedfields.min.js"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="modal-root"></div>
      </body>
    </Html>
  );
}
