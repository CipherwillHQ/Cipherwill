/**
 * JobsFilterList component for the public careers page.
 * Owns the dynamic job filtering state, division selections, and grid rendering.
 * Does NOT own the individual JobCard details or the metadata header.
 */

"use client";

import React, { useState, useMemo } from "react";
import JobCard from "./JobCard";

interface Job {
  id: string;
  title: string;
  division: string;
  location: string;
  level: string;
  min_qualifications: string[];
}

interface JobsFilterListProps {
  jobs: Job[];
}

export default function JobsFilterList({ jobs }: JobsFilterListProps) {
  const [selectedDivision, setSelectedDivision] = useState<string>("All");

  // Dynamically extract divisions to prevent hardcoding mismatches
  const divisions = useMemo(() => {
    const unique = new Set(jobs.map((job) => job.division));
    return ["All", ...Array.from(unique)];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (selectedDivision === "All") return jobs;
    return jobs.filter((job) => job.division === selectedDivision);
  }, [jobs, selectedDivision]);

  return (
    <section className="w-full bg-cream text-forest py-24 px-4 border-t border-default">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-default/50">
          <div className="flex flex-col gap-2">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold">
              Open Positions
            </h2>
            <p className="font-gilroy text-sm sm:text-base text-forest/60">
              Select a team below to explore active opportunities.
            </p>
          </div>

          {/* Pill Filters */}
          <div className="flex flex-wrap gap-2">
            {divisions.map((division) => {
              const isActive = selectedDivision === division;
              return (
                <button
                  key={division}
                  onClick={() => setSelectedDivision(division)}
                  className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer active:scale-95
                    ${
                      isActive
                        ? "bg-gradient-to-r from-primary-700 to-primary text-white shadow-sm"
                        : "bg-parchment text-forest/70 border border-default hover:bg-white hover:text-forest"
                    }
                  `}
                >
                  {division}
                </button>
              );
            })}
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-parchment rounded-2xl border border-default">
            <p className="font-gilroy text-lg text-forest/60 font-medium">
              No open roles found in this department. Check back later or pitch us!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
