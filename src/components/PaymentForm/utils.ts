import DOMPurify from "dompurify";

export async function getRemoteAddress() {
  const response = await fetch("https://api.ipify.org?format=json");
  const data = await response.json();
  return data.ip;
}

export function getDeviceDetails() {
  const screen = window.screen || {};
  const navigator = window.navigator || {};
  const language = navigator.language || "";
  const timezoneOffset = new Date().getTimezoneOffset().toString();
  return {
    device_timezone: timezoneOffset,
    device_capabilities: "javascript",
    device_accept_language: language,
    device_screen_resolution: `${screen.width || 0}x${screen.height || 0}x${
      screen.colorDepth || 0
    }`,
  };
}

export function decodeAndSanitize(inputString: string) {
  // this function will decode the form string and sanitize it to prevent XSS attacks
  // Decode the input string by replacing encoded characters.
  const decodedString = inputString.replace(/\\\"/g, '"').replace(/\\n/g, "\n");
  DOMPurify.addHook("uponSanitizeAttribute", (node, event) => {
    if (
      event.attrName === "type" &&
      event.attrValue.startsWith("hostedfield:")
    ) {
      event.attrName = "type";
      event.attrValue = event.attrValue;
      event.forceKeepAttr = true;
      return node;
    }
  });
  const sanitizedHTML = DOMPurify.sanitize(decodedString);
  DOMPurify.removeHook("uponSanitizeAttribute");
  return sanitizedHTML;
}

export async function hostedFieldsSetup(selector: string) {
  const form: HTMLFormElement | null = document.querySelector(selector);

  if (!form) return;

  try {
    $("input[type='hostedfield:cardNumber']").hostedField({
      nativeEvents: true,
    });
    $("input[type='hostedfield:cardExpiryDate']").hostedField({
      nativeEvents: true,
    });
    $("input[type='hostedfield:cardCvv']").hostedField({
      nativeEvents: true,
    });
  } catch (error) {
    console.log("failed to create fields", error);
  }
}
