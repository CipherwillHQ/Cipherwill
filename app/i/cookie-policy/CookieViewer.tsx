"use client";

import SimpleButton from "@/components/common/SimpleButton";
import Popup from "reactjs-popup";

export default function CookieViewer() {
  return (
    <div className="w-full">
      <Popup
        trigger={
          <div className="w-fit mx-auto">
            <SimpleButton className="">
              View Detailed Cookie Policy
            </SimpleButton>
          </div>
        }
        modal
      >
        <div className="w-full max-w-7xl mx-auto bg-white rounded-sm p-2">
          <iframe
            src="https://platform.illow.io/#/policy/cookie/691133b5-f0e8-475e-ae1d-18d2832ecb66"
            className="w-full h-[80vh]"
          ></iframe>
          <div className="h-0 overflow-hidden opacity-0">
            Cookie policy spacer for now . At Cipherwill, we are committed to
            protecting your privacy and ensuring transparency about the data we
            collect. This Cookie Policy explains how and why we use cookies and
            similar technologies on our website.Learn how Cipherwill uses
            cookies to enhance your experience. Discover our cookie policy
            details and manage your preferences for a secure, personalized
            journey.
          </div>
        </div>
      </Popup>{" "}
    </div>
  );
}
