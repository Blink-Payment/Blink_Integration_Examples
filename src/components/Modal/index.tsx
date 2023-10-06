import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Close from "../Icons/Close";

interface ModalProps {
  isOpen: boolean;
  children?: React.ReactNode;
  iframeEnabled?: boolean;
  iframeContent?: string | TrustedHTML;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  children,
  onClose,
  iframeEnabled = false,
  iframeContent = "",
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (iframeEnabled && iframeRef.current && iframeContent) {
      const iframeDoc = iframeRef.current.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(iframeContent as string);
        iframeDoc.close();
      }
    }
  }, [iframeEnabled, iframeContent]);

  useEffect(() => {
    if (!iframeEnabled) return;
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.origin !== process.env.NEXT_PUBLIC_BASE_URL) return;
      console.log("Received message:", event.data);
    };

    window.addEventListener("message", handleIframeMessage);
    return () => {
      window.removeEventListener("message", handleIframeMessage);
    };
  }, [iframeEnabled]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 p-4 sm:p-0">
      <div className="relative flex h-full w-full items-center justify-center overflow-y-auto rounded-2xl bg-white pt-6 shadow-lg sm:h-[33rem] sm:max-w-[30rem]">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full bg-gray-300 p-2 focus:outline-none sm:right-4 sm:top-4"
          aria-label="Close modal"
        >
          <Close />
        </button>

        {iframeEnabled ? (
          <iframe
            title="Embedded Content"
            ref={iframeRef}
            className="h-[25rem] w-full border-none"
          />
        ) : (
          children
        )}
      </div>
    </div>,
    document.getElementById("modal-root")!,
  );
};

export default Modal;
