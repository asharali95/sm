import React from "react";
import { EnvelopeOpenIcon } from "@heroicons/react/24/outline";

const ConfirmationModal = ({ email }) => {
  return (
    <div className="fixed inset-0 z-10 bg-tertiary-100 bg-opacity-90 backdrop-filter backdrop-blur-md backdrop-grayscale animate__animated animate-zoomIn">
      <div className="min-h-screen px-6 flex flex-col items-center justify-center ">
        <div className="flex flex-col items-center justify-center text-center max-w-sm">
          <EnvelopeOpenIcon className="h-10 w-10 text-primary-100" />
          <h3 className="mt-2 text-2xl font-semibold">Confirm your email</h3>
          <p className="mt-4 text-lg">
            We emailed a magic link to <strong>{email}</strong>. Check your
            inbox and click the link in the email to login.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
