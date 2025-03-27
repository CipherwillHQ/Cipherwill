"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import delivery_img from "./delivery.png";

const sections = [
  {
    heading: "Fail safe data delivery",
    capsule: "100% guaranteed delivery",
    points: [
      "Your data is guaranteed to reach your loved ones, no matter what - even if our system crashes, gets hacked, or disappears completely.",
      "We’ve built multiple layers of security and backup systems to ensure your information stays safe.",
      "When the time comes, your data will always be delivered to the right people, just as you intended.",
    ],
    image: delivery_img.src,
  },
  {
    heading: "End to end encryption",
    capsule: "Your data is safe with us",
    points: [
      "Your data is encrypted on your device before it ever leaves, so not even Cipherwill can see it.",
      "Only you - and the people you choose - can access your information.",
      "Your privacy is 100% in your control, ensuring complete security and peace of mind.",
    ],
    image:
      "https://images.pexels.com/photos/18715887/pexels-photo-18715887/free-photo-of-close-up-of-pouring-coffee-to-cup.jpeg",
  },
  {
    heading: "Beyond just a software",
    capsule: "Your data, our responsibility",
    points: [
      "We personally ensure your data reaches the right people when it matters most.",
      "If needed, we manually step in to inform your beneficiaries and guide them on accessing your information.",
      "Your peace of mind is our top priority.",
    ],
    image:
      "https://images.pexels.com/photos/30170452/pexels-photo-30170452/free-photo-of-colorful-houses-and-boats-at-nyhavn-copenhagen.jpeg",
  },
];

export default function StickyImageScroll() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const sectionElements = document.querySelectorAll(".text-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(sectionElements).indexOf(entry.target);
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6 }
    );

    sectionElements.forEach((section) => observer.observe(section));

    return () => {
      sectionElements.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto flex items-start flex-col md:flex-row py-20">
      <div className="md:w-1/2">
        {sections.map((section, index) => (
          <div
            key={index}
            className="text-section flex flex-col md:h-screen max-h-[1000px] justify-start p-4"
          >
            <img
              src={section.image}
              alt={`Image ${index + 1}`}
              className="md:hidden max-h-[400px] object-cover p-4"
            />
            <div className="p-2 rounded-full w-fit mt-8 uppercase text-black/50 font-bold mx-4">
              {section.capsule}
            </div>
            <h2 className="text-4xl md:text-7xl font-bold py-4 sm:py-6 px-4">
              {section.heading}
            </h2>
            <ul className="text-lg md:text-xl px-4 font-medium text-black/75">
              {section.points.map((point, pointIndex) => (
                <li key={pointIndex} className="list-disc list-inside py-2">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="hidden md:block md:w-1/2 h-[80vh] max-h-[1000px] sticky top-20 p-8 -z-10">
        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence>
            <motion.img
              key={sections[activeIndex].image}
              src={sections[activeIndex].image}
              alt={`Image ${activeIndex + 1}`}
              className="absolute w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
