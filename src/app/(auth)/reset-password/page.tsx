

import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm"; 


export default function ResetPasswordPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <p className="text-xl text-gray-500">Loading reset form...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
