/**
 * JobCard component for the public careers page.
 * Owns the visual representation of an individual job opening.
 * Does NOT own the layout grid or filtering mechanism.
 */

import React from "react";
import Link from "next/link";
import { TbBuilding, TbMapPin, TbChevronRight } from "react-icons/tb";

interface Job {
  id: string;
  title: string;
  division: string;
  location: string;
  level: string;
  min_qualifications: string[];
}

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="flex flex-col justify-between p-6 sm:p-8 bg-parchment rounded-2xl border border-default transition-all duration-300 hover:border-primary/30 hover:shadow-level-1 group">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold tracking-wider uppercase px-2.5 py-1 bg-cream rounded-full text-forest/70 border border-default">
            {job.level}
          </span>
          <span className="text-xs font-semibold tracking-wider uppercase px-2.5 py-1 bg-primary/10 rounded-full text-primary">
            {job.division}
          </span>
        </div>

        <h3 className="font-playfair text-2xl font-bold text-forest group-hover:text-primary transition-colors duration-200">
          {job.title}
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-forest/60 font-medium pb-2 border-b border-default/50">
          <div className="flex items-center gap-1.5">
            <TbBuilding className="w-4 h-4 text-forest/40" />
            <span>{job.division}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TbMapPin className="w-4 h-4 text-forest/40" />
            <span>{job.location}</span>
          </div>
        </div>

        <div className="py-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-forest/40 mb-2">
            Minimum Qualifications
          </h4>
          <ul className="flex flex-col gap-1.5 list-disc list-inside text-sm text-forest/70 font-medium">
            {job.min_qualifications.slice(0, 2).map((qual, idx) => (
              <li key={idx} className="truncate">
                {qual}
              </li>
            ))}
            {job.min_qualifications.length > 2 && (
              <li className="list-none text-xs text-forest/50 italic pl-5">
                +{job.min_qualifications.length - 2} more qualification(s)...
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="pt-6 mt-4">
        <Link
          href={`/careers/${job.id}`}
          className="inline-flex items-center gap-1.5 text-primary hover:text-primary-700 font-semibold text-sm transition-all duration-200 active:scale-[0.98] group-hover:translate-x-1"
        >
          View Opening
          <TbChevronRight className="w-4 h-4 transition-transform duration-200" />
        </Link>
      </div>
    </div>
  );
}
