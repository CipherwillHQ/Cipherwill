"use client";

import logger from "@/common/debug/logger";
import AnonymousChatBox from "@/components/app/AnonymousChatBox";
import { useUserContext } from "@/contexts/UserSetupContext";
import SEND_FEEDBACK from "@/graphql/ops/generic/mutations/SEND_FEEDBACK";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [sendFeedback] = useMutation(SEND_FEEDBACK);
  const { user } = useUserContext();

  return (
    <section className="relative py-12 overflow-hidden sm:py-16 lg:py-20 xl:py-24 mt-20">
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Need help? Get in touch
          </h1>
          <p className="mt-4 text-base font-normal text-gray-400 sm:text-lg">
            For any enquiries or support, please fill out the form below.
          </p>
        </div>
        <div className="grid grid-cols-1 mt-12 sm:mt-16 lg:mt-20 lg:grid-cols-6 lg:gap-x-24 gap-y-12">
          <div className="space-y-8 lg:space-y-12 lg:col-span-2 lg:order-last">
            <div>
              <h3 className="text-xl font-normal  sm:text-2xl">
                <a href="#" title="" className="">
                  support@cipherwill.com
                </a>
              </h3>
              <p className="my-2">
                Email us directly if you need any help. Our team will help you.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-normal  sm:text-2xl">
                Live Chat with us
              </h3>
              <p className="my-2">
                We're always available to help you with any questions or
                concerns. Just click on the start chat button below.
              </p>
              <AnonymousChatBox/>
            </div>
          </div>
          <div className="lg:col-span-4">
            <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-base font-normal ">
                  Your name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your full name"
                    className="block w-full px-5 py-4 text-base font-normal  placeholder-gray-500  border border-gray-800 rounded-md focus:border-white focus:ring-white focus:ring-1"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="text-base font-normal ">
                  Your email
                </label>
                <div className="mt-2">
                  <input
                    defaultValue={user?.email}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email address"
                    className="block w-full px-5 py-4 text-base font-normal  placeholder-gray-500  border border-gray-800 rounded-md focus:border-white focus:ring-white focus:ring-1"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="topic" className="text-base font-normal ">
                  What kind of service are you looking for?
                </label>
                <div className="mt-2">
                  <select
                    name="topic"
                    id="topic"
                    className="block w-full py-4 pl-5 pr-10 text-base font-normal  placeholder-gray-500  border border-gray-800 rounded-md focus:border-white focus:ring-white focus:ring-1"
                  >
                    <option value="">Select a subject</option>
                    <option value="platform">Platform Queries</option>
                    <option value="media">Media Outreach</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="text-base font-normal ">
                  Message
                </label>
                <div className="mt-2">
                  <textarea
                    name="message"
                    id="message"
                    placeholder="Write your message"
                    rows={4}
                    minLength={3}
                    className="block w-full px-5 py-4 text-base font-normal  placeholder-gray-500  border border-gray-800 rounded-md resize-y focus:border-white focus:ring-white focus:ring-1"
                  ></textarea>
                </div>
              </div>
              <div className="sm:col-span-2">
                <button
                  className="bg-black text-white py-2 px-4 rounded-full text-sm"
                  onClick={async (e) => {
                    e.preventDefault();
                    const email = (document.getElementById("email") as any)
                      ?.value;
                    const topic = (document.getElementById("topic") as any)
                      ?.value;
                    const message = (document.getElementById("message") as any)
                      ?.value;
                    if (!email || !topic || !message) {
                      toast.error("Please fill all the fields");
                      return;
                    }
                    await sendFeedback({
                      variables: {
                        email,
                        message: `${topic}: ${message}`,
                      },
                    })
                      .then((res) => {
                        (document.getElementById("name") as any).value = "";
                        (document.getElementById("email") as any).value = "";
                        (document.getElementById("topic") as any).value = "";
                        (document.getElementById("message") as any).value = "";
                        toast.success("Message sent successfully");
                      })
                      .catch((err) => {
                        logger.error(err);
                        toast.error("Something went wrong");
                      });
                  }}
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
