// components/GoogleAuthButton.tsx
"use client";

import { useEffect, useCallback } from "react";

interface Props {
  onSuccess: (idToken: string) => void;
}

export default function GoogleAuthButton({ onSuccess }: Props) {
  const handleCallback = useCallback(
    (response: { credential: string }) => {
      const idToken = response.credential; // <–– THIS IS THE GOOGLE ID TOKEN
      onSuccess(idToken);
    },
    [onSuccess]
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleCallback,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-btn")!,
      {
        theme: "filled_blue",
        size: "large",
        width: 300,
      }
    );
  }, [handleCallback]);

  return <div id="google-btn"></div>;
}
