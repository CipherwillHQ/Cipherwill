/**
 * CompareGrid component.
 * Renders the 3-column key architectural differences in a dark slate theme.
 * Does NOT manage metrics tables or FAQs.
 */

import { CompetitorData } from "@/types/interfaces/compare";
import { TbClockBolt, TbLockBolt, TbCoins, TbCode } from "react-icons/tb";

const iconMap: Record<string, React.ComponentType<any>> = {
  TbClockBolt,
  TbLockBolt,
  TbCoins,
  TbCode,
};

interface CompareGridProps {
  competitor: CompetitorData;
}

export default function CompareGrid({ competitor }: CompareGridProps) {
  return (
    <section className="w-full bg-[#2A363B] text-cream py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-4 max-w-3xl">
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold leading-tight">
            How Cipherwill Differs from {competitor.name}
          </h2>
          <p className="text-base sm:text-lg text-cream/70 leading-relaxed font-medium">
            {competitor.diffIntro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          {competitor.diffCards.map((card, index) => {
            const Icon = iconMap[card.iconName] || TbLockBolt;
            return (
              <div
                key={index}
                className="bg-cream/[0.04] border border-cream/10 rounded-[20px] p-6 sm:p-8 flex flex-col gap-5 hover:bg-cream/[0.06] transition-all duration-300"
              >
                <div className="p-3.5 bg-cream/10 text-cream rounded-xl w-12 h-12 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-cream">
                    {card.title}
                  </h3>
                  <p className="text-sm sm:text-base text-cream/65 leading-relaxed font-medium">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
