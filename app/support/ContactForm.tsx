"use client";

/**
 * ContactForm component for the /support page.
 * Owns the client-side support request submission form and direct help access channels.
 * Does NOT own global site navigation, footer, or FAQ listings.
 */

import logger from "@/common/debug/logger";
import AnonymousChatBox from "@/components/app/AnonymousChatBox";
import SimpleButton from "@/components/common/SimpleButton";
import { useUserContext } from "@/contexts/UserSetupContext";
import SEND_FEEDBACK from "@/graphql/ops/generic/mutations/SEND_FEEDBACK";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import { TbMail, TbClock, TbArrowRight, TbChevronDown } from "react-icons/tb";

export default function ContactForm() {
  const [sendFeedback] = useMutation(SEND_FEEDBACK);
  const { user } = useUserContext();

  return (
    <section className="relative py-24 md:py-32 bg-cream text-forest overflow-hidden mt-16">
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Main Grid: Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Title & Direct Contact Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-sage font-bold">
                Confidential & Secure Support
              </span>
              <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-forest leading-tight mt-4">
                Need help?<br />
                <span className="italic font-normal text-forest/80">Get in touch.</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-forest/70 leading-relaxed font-medium font-gilroy">
                For platform support, encryption questions, or legacy planning assistance, our team is here to guide you with absolute privacy.
              </p>
            </div>

            {/* Direct Contact Side-by-Side Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-forest/10">
              {/* Direct Email Channel */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sage">
                  <TbMail className="w-5 h-5 stroke-[1.5]" />
                  <span className="text-xs font-semibold uppercase tracking-wider font-gilroy">
                    Direct Email
                  </span>
                </div>
                <div>
                  <a 
                    href="mailto:support@cipherwill.com" 
                    className="text-base font-bold text-forest hover:text-primary transition-colors duration-200 font-gilroy"
                  >
                    support@cipherwill.com
                  </a>
                  <p className="mt-2 text-sm text-forest/60 font-medium leading-relaxed font-gilroy">
                    Our team monitors this secure inbox around the clock.
                  </p>
                </div>
              </div>

              {/* Live Assistance Channel */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-clay">
                  <TbClock className="w-5 h-5 stroke-[1.5]" />
                  <span className="text-xs font-semibold uppercase tracking-wider font-gilroy">
                    Live Chat
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-forest font-gilroy">
                    Instant chat
                  </h4>
                  <p className="mt-2 text-sm text-forest/60 font-medium leading-relaxed font-gilroy">
                    Need quick key retrieval or verification help? Talk to us.
                  </p>
                  <AnonymousChatBox className="mt-4 bg-transparent border border-forest/15 hover:border-primary hover:text-primary text-forest hover:bg-primary/5 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all duration-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-forest/10 p-8 sm:p-10 rounded-2xl shadow-level-1">
              <h2 className="text-xl sm:text-2xl font-bold text-forest mb-6 font-gilroy">
                Send us a Message
              </h2>
              
              <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-forest/80 mb-2 font-gilroy">
                    Your name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your full name"
                    className="block w-full min-h-[44px] px-4 py-3 text-base font-medium placeholder-forest/30 bg-cream/20 border border-forest/15 rounded-xl focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none text-forest font-gilroy"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-forest/80 mb-2 font-gilroy">
                    Your email
                  </label>
                  <input
                    defaultValue={user?.email}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email address"
                    className="block w-full min-h-[44px] px-4 py-3 text-base font-medium placeholder-forest/30 bg-cream/20 border border-forest/15 rounded-xl focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none text-forest font-gilroy"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="topic" className="block text-xs font-semibold uppercase tracking-wider text-forest/80 mb-2 font-gilroy">
                    What kind of service are you looking for?
                  </label>
                  <div className="relative">
                    <select
                      name="topic"
                      id="topic"
                      className="block w-full min-h-[44px] px-4 py-3 pr-10 text-base font-medium bg-cream/20 border border-forest/15 rounded-xl focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none text-forest appearance-none font-gilroy"
                    >
                      <option value="" className="text-forest">Select a subject</option>
                      <option value="platform" className="text-forest">Platform Queries</option>
                      <option value="media" className="text-forest">Media Outreach</option>
                      <option value="other" className="text-forest">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-forest/50">
                      <TbChevronDown className="w-4 h-4 stroke-[2]" />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-forest/80 mb-2 font-gilroy">
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    placeholder="Write your message"
                    rows={4}
                    minLength={3}
                    className="block w-full px-4 py-3 text-base font-medium placeholder-forest/30 bg-cream/20 border border-forest/15 rounded-xl resize-y focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none text-forest font-gilroy"
                  ></textarea>
                </div>

                <div className="sm:col-span-2 mt-2">
                  <SimpleButton
                    className="w-full py-4 text-base font-semibold tracking-wide rounded-xl active:scale-[0.98] transition-all duration-200 shadow-level-1 font-gilroy"
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
                          const nameInput = document.getElementById("name") as any;
                          const emailInput = document.getElementById("email") as any;
                          const topicInput = document.getElementById("topic") as any;
                          const messageInput = document.getElementById("message") as any;
                          if (nameInput) nameInput.value = "";
                          if (emailInput) emailInput.value = "";
                          if (topicInput) topicInput.value = "";
                          if (messageInput) messageInput.value = "";
                          toast.success("Message sent successfully");
                        })
                        .catch((err) => {
                          logger.error(err);
                          toast.error("Something went wrong");
                        });
                    }}
                  >
                    Send Message &nbsp; <TbArrowRight className="w-5 h-5 inline text-white" />
                  </SimpleButton>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
