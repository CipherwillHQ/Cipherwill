"use client";

import { useQuery } from "@apollo/client/react";
import GET_USER_SCORE from "@/graphql/ops/app/score/queries/GET_USER_SCORE";
import { GetUserScoreData } from "@/types/interfaces";
import { twMerge } from "tailwind-merge";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeSelector";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  annotationPlugin,
);

interface UserScoreProps {
  maxScore?: number;
  description?: string;
  className?: string;
  improveScrollLink?: boolean;
}

const SCORE_COLORS = [
  "rgb(231, 24, 49)",
  "rgb(239, 198, 0)",
  "rgb(140, 214, 16)",
];

function getColorIndex(perc: number) {
  return perc < 33 ? 0 : perc < 66 ? 1 : 2;
}

function getScoreLabel(perc: number) {
  if (perc < 33) return "Needs Work";
  if (perc < 66) return "In Progress";
  return "Strong";
}

export default function UserScore({
  maxScore = 950,
  description,
  className = "",
  improveScrollLink = false,
}: UserScoreProps) {
  const { data, loading, error } = useQuery<GetUserScoreData>(GET_USER_SCORE);
  const { current_theme } = useTheme();

  const score: number =
    data && data.getUserScore
      ? (Object.values(JSON.parse(data.getUserScore)).reduce(
          (a: number, b: number) => a + b,
          0,
        ) as number)
      : 300;

  const minScore = 300;
  const percentage = Math.max(
    0,
    Math.min(((score - minScore) / (maxScore - minScore)) * 100, 100),
  );

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (chartRef.current && !loading) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }

      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        const chartData = {
          datasets: [
            {
              data: [percentage, 100 - percentage],
              backgroundColor(bgCtx: any) {
                const isDark = current_theme === "dark";
                if (bgCtx.type !== "data") {
                  return;
                }
                if (bgCtx.index === 1) {
                  return isDark ? "rgb(64, 64, 64)" : "rgb(234, 234, 234)";
                }
                return SCORE_COLORS[getColorIndex(bgCtx.raw)];
              },
              borderWidth: 0,
            },
          ],
        };

        const annotation = {
          type: "doughnutLabel",
          content: ({ chart }: any) => [
            chart.data.datasets[0].data[0].toFixed(1) + "%",
          ],
          drawTime: "beforeDraw",
          position: {
            y: "-50%",
          },
          font: [{ size: 35, weight: "bold" }, { size: 20 }],
          color: ({ chart }: any) => [
            SCORE_COLORS[getColorIndex(chart.data.datasets[0].data[0])],
            "grey",
          ],
        };

        const config = {
          type: "doughnut" as const,
          data: chartData,
          options: {
            aspectRatio: 2,
            circumference: 180,
            rotation: -90,
            plugins: {
              annotation: {
                annotations: {
                  annotation,
                },
              },
              tooltip: {
                enabled: false,
              },
              legend: {
                display: false,
              },
            },
            responsive: true,
            maintainAspectRatio: false,
          },
        };

        chartInstanceRef.current = new ChartJS(ctx, config as any);
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [loading, current_theme, percentage]);

  if (loading) {
    return (
      <div
        className={twMerge(
          "rounded-2xl border border-default bg-secondary p-5",
          className,
        )}
      >
        <div className="space-y-4">
          <div className="h-6 w-40 animate-pulse rounded bg-neutral-300 dark:bg-neutral-600" />
          <div className="mx-auto h-44 w-full max-w-[360px] animate-pulse rounded-xl bg-neutral-300 dark:bg-neutral-600" />
          <div className="h-4 w-32 animate-pulse rounded bg-neutral-300 dark:bg-neutral-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-default bg-secondary p-5">
        <div className="text-xl font-semibold pb-2">Cipherwill Score</div>
        <div className="text-red-600 dark:text-red-400 text-sm">
          Failed to load Cipherwill score
        </div>
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        "rounded-2xl border border-default bg-secondary p-5 animate-in fade-in duration-300",
        className,
      )}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold">Cipherwill Score</h2>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Updated from your account completeness
            </p>
          </div>
          {improveScrollLink && (
            <Link
              className="ml-auto shrink-0 whitespace-nowrap text-right text-sm text-primary hover:underline"
              href="/app/score"
            >
              Improve score
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center">
          <div className="mx-auto h-[170px] w-full max-w-[360px] sm:h-[190px] md:h-[170px] lg:h-[190px]">
            <canvas ref={chartRef} />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <p className="text-3xl font-semibold tracking-tight">{score}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              out of {maxScore} points
            </p>
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: `${SCORE_COLORS[getColorIndex(percentage)]}22`,
                color: SCORE_COLORS[getColorIndex(percentage)],
              }}
            >
              {getScoreLabel(percentage)}
            </span>
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-default p-3">
          <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${percentage}%`,
                backgroundColor: SCORE_COLORS[getColorIndex(percentage)],
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Low</span>
            <span>Improving</span>
            <span>Excellent</span>
          </div>
        </div>

        {description && (
          <p className="border-t border-default pt-4 text-sm text-neutral-600 dark:text-neutral-300 animate-in fade-in duration-500 delay-500">
            {description}
          </p>
        )}

      </div>
    </div>
  );
}
