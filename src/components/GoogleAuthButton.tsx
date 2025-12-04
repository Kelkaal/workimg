// components/GoogleAuthButton.tsx
"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              width?: number;
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface Props {
  onSuccess: (idToken: string) => void;
  buttonText?: "signin_with" | "signup_with" | "continue_with" | "signin";
}

export default function GoogleAuthButton({
  onSuccess,
  buttonText = "continue_with",
}: Props) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || initialized.current) return;

    const initializeGoogle = () => {
      if (!window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: (response) => {
          const idToken = response.credential; // <–– THIS IS THE GOOGLE ID TOKEN
          onSuccess(idToken);
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "filled_blue",
        size: "large",
        width: 300,
        text: buttonText,
      });

      initialized.current = true;
    };

    // Check if Google script is already loaded
    if (window.google) {
      initializeGoogle();
    } else {
      // Wait for the script to load
      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          initializeGoogle();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkGoogle), 10000);
    }
  }, [onSuccess, buttonText]);

  return <div ref={buttonRef} id="google-btn"></div>;
}
