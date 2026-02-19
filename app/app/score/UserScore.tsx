"use client";

import { CiUndo } from "react-icons/ci";
import { useQuery } from "@apollo/client/react";
import GET_USER_SCORE from "@/graphql/ops/app/score/queries/GET_USER_SCORE";
import { GetUserScoreData } from "@/types/interfaces";
import { twMerge } from "tailwind-merge";
import { useState, useEffect, useRef } from "react";
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

export default function UserScore({
  maxScore = 950,
  description,
  className = "",
  improveScrollLink = false,
}: UserScoreProps) {
  const { data, loading, error, refetch } =
    useQuery<GetUserScoreData>(GET_USER_SCORE);
  const { current_theme } = useTheme();

  const score:number =
    data && data.getUserScore
      ? // sum of all values of keys in object
        Object.values(JSON.parse(data.getUserScore)).reduce(
          (a: number, b: number) => a + b,
          0,
        ) as number
      : 300;

  // Normalize score between 300 and maxScore (default 950)
  const minScore = 300;
  const percentage = Math.max(
    0,
    Math.min(((score - minScore) / (maxScore - minScore)) * 100, 100),
  );

  // Colors: red for low, yellow for medium, green for high
  const COLORS = ["rgb(231, 24, 49)", "rgb(239, 198, 0)", "rgb(140, 214, 16)"]; // red, yellow, green

  function getColorIndex(perc: number) {
    return perc < 33 ? 0 : perc < 66 ? 1 : 2; // red, yellow, green
  }

  // Animation state
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  // Set percentage after loading
  useEffect(() => {
    if (!loading) {
      setAnimatedPercentage(percentage);
    }
  }, [loading, percentage]);

  // Create chart
  useEffect(() => {
    if (chartRef.current && !loading && !chartInstanceRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        const data = {
          datasets: [
            {
              data: [percentage, 100 - percentage],
              backgroundColor(ctx: any) {
                const isDark = current_theme === "dark";
                if (ctx.type !== "data") {
                  return;
                }
                if (ctx.index === 1) {
                  return isDark ? "rgb(64, 64, 64)" : "rgb(234, 234, 234)"; // dark background for dark mode
                }
                return COLORS[getColorIndex(ctx.raw)];
              },
              borderWidth: 0,
            },
          ],
        };

        const annotation = {
          type: "doughnutLabel",
          content: ({ chart }: any) => [
            chart.data.datasets[0].data[0].toFixed(1) + "%",
            // 'Score',
          ],
          drawTime: "beforeDraw",
          position: {
            y: "-50%",
          },
          font: [{ size: 35, weight: "bold" }, { size: 20 }],
          color: ({ chart }: any) => [
            COLORS[getColorIndex(chart.data.datasets[0].data[0])],
            "grey",
          ],
        };

        const config = {
          type: "doughnut" as const,
          data,
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
  }, [loading, COLORS]);

  // Update chart on theme change
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.update();
    }
  }, [current_theme]);

  if (loading) {
    return (
      <div
        className={twMerge(
          "bg-secondary p-4 rounded-md border border-default h-96 overflow-auto customScrollbar flex flex-col gap-4",
          className,
        )}
      >
        <div className="text-xl font-semibold pb-2">Cipherwill Score</div>
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-20 h-10 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Loading Gauge */}
          <div className="flex items-center justify-center flex-1">
            <div className="w-full h-full p-4">
              <div className="w-full h-full bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-secondary p-4 rounded-md border border-default h-96 overflow-auto customScrollbar flex flex-col gap-4">
        <div className="text-xl font-semibold pb-2">Cipherwill Score</div>
        <div className="text-red-600 dark:text-red-400 text-sm">
          Failed to load Cipherwill score
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={twMerge(
          "bg-secondary p-4 rounded-md border border-default h-96 overflow-auto customScrollbar animate-in fade-in duration-300 flex flex-col gap-4",
          className,
        )}
      >
        <div className="text-xl flex justify-between">
          <h2 className="font-semibold">Cipherwill Score</h2>
          <div className="flex gap-4">
            {improveScrollLink && (
              <Link
                className="ml-2 text-sm opacity-70 hover:underline"
                href={"/app/score"}
              >
                Improve score
              </Link>
            )}
            <CiUndo
              className={`inline ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:cursor-pointer"
              }`}
              onClick={() => {
                if (loading) return;
                refetch();
              }}
            />
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-center justify-center flex-1">
          <div className="w-full h-full p-4">
            <canvas ref={chartRef} />
          </div>
        </div>

        {/* Score Text */}
        <div className="text-center">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {score}/{maxScore} points
          </span>
        </div>

        {description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-300 animate-in fade-in duration-500 delay-500 border-t border-default pt-4">
            {description}
          </p>
        )}
      </div>
    </>
  );
}
