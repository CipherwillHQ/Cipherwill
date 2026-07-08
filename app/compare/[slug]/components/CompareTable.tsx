/**
 * CompareTable component.
 * Renders a side-by-side feature comparison matrix.
 * Does NOT manage hero headings or FAQs.
 */

import { CompetitorData } from "@/types/interfaces/compare";
import { TbCheck, TbX } from "react-icons/tb";
import SymbolicLogo from "@/components/public/logo/SymbolicLogo";
import CompetitorLogo from "./CompetitorLogo";

interface CompareTableProps {
  competitor: CompetitorData;
}

export default function CompareTable({ competitor }: CompareTableProps) {
  return (
    <section id="compare-table" className="w-full bg-cream py-20 sm:py-28 px-4 sm:px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold leading-tight text-forest">
            Feature Comparison Matrix
          </h2>
          <p className="text-base sm:text-lg text-forest/75 font-medium">
            See how Cipherwill compare directly with {competitor.name} across core technical and planning capabilities.
          </p>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto border border-forest/10 rounded-2xl bg-parchment/40 backdrop-blur-xs">
          <table className="min-w-full divide-y divide-forest/10 text-left border-collapse">
            <thead>
              <tr className="bg-parchment/80">
                <th className="px-6 py-5 text-sm sm:text-base font-bold text-forest/50 uppercase tracking-wider">
                  Feature / Capability
                </th>
                <th className="px-6 py-5 text-sm sm:text-base font-bold text-primary">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-xs border border-forest/5 shrink-0 p-1">
                      <SymbolicLogo size={20} overrideTheme="light" className="w-full h-full object-contain" />
                    </div>
                    <span className="hidden sm:inline">Cipherwill</span>
                  </div>
                </th>
                <th className="px-6 py-5 text-sm sm:text-base font-bold text-forest/70">
                  <CompetitorLogo slug={competitor.slug} size={20} />
                </th>
                <th className="hidden lg:table-cell px-6 py-5 text-sm sm:text-base font-bold text-forest/50 uppercase tracking-wider">
                  Why it matters
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/10">
              {competitor.metrics.map((metric, index) => (
                <tr key={index} className="hover:bg-parchment/30 transition-colors">
                  <td className="px-6 py-5 text-base font-semibold text-forest">
                    {metric.featureName}
                  </td>
                  <td className="px-6 py-5 text-base font-medium">
                    {typeof metric.cipherwill === "boolean" ? (
                      metric.cipherwill ? (
                        <span className="inline-flex items-center gap-1.5 text-sage font-bold">
                          <TbCheck className="w-5 h-5" /> Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-red-600 font-bold">
                          <TbX className="w-5 h-5" /> No
                        </span>
                      )
                    ) : (
                      <span className="text-forest font-semibold">{metric.cipherwill}</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-base font-medium text-forest/80">
                    {typeof metric.competitor === "boolean" ? (
                      metric.competitor ? (
                        <span className="inline-flex items-center gap-1.5 text-sage/80 font-bold">
                          <TbCheck className="w-5 h-5" /> Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-red-500 font-bold">
                          <TbX className="w-5 h-5" /> No
                        </span>
                      )
                    ) : (
                      <span>{metric.competitor}</span>
                    )}
                  </td>
                  <td className="hidden lg:table-cell px-6 py-5 text-sm text-forest/65 font-medium max-w-sm">
                    {metric.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Deep Dive Summary Text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-4">
          <div className="bg-parchment/60 border border-forest/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-forest/40">
              The {competitor.name} Approach
            </h4>
            <p className="text-base text-forest/85 leading-relaxed font-medium">
              {competitor.competitorFocus}
            </p>
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-primary/80">
              The Cipherwill Advantage
            </h4>
            <p className="text-base text-forest/85 leading-relaxed font-medium">
              {competitor.cipherwillAdvantage}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
