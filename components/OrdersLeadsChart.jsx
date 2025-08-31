"use client";

import React, { useState, useMemo } from "react";
import { useGetRadarStatsQuery } from "@/features/dataApi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { ThreeDot } from "react-loading-indicators";
import { TrendingUp } from "lucide-react";

export function OrdersLeadsChart() {
  const [agentFilter, setAgentFilter] = useState("global");

  // Fetch radar stats
  const { data: stats, isLoading, error } = useGetRadarStatsQuery({});
  
  // Build chart data based on filter
  const chartData = useMemo(() => {
    if (!stats) return [];
    if (agentFilter === "global") return stats.monthlyData || [];
    return stats.monthlyDataByAgent?.[agentFilter] || [];
  }, [stats, agentFilter]);

  // Build agent dropdown including global
  const agentOptions = useMemo(() => {
    if (!stats) return ["global"];
    return ["global", ...Object.keys(stats.monthlyDataByAgent || {})];
  }, [stats]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <CardTitle>Orders vs Leads</CardTitle>
            <CardDescription>Monthly breakdown</CardDescription>
          </div>

          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="min-w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {agentOptions.map((agent) => (
                <SelectItem key={agent} value={agent}>
                  {agent === "global" ? "All Agents" : agent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="pb-0">
        {isLoading && (
          <div className="flex justify-center py-6">
            <ThreeDot
              variant="pulsate"
              color="var(--color-primary)"
              size="medium"
            />
          </div>
        )}

        {error && (
          <div className="flex justify-center py-6 text-red-500">
            Error loading radar stats
          </div>
        )}

        {chartData.length > 0 && (
          <ChartContainer
            className="mx-auto aspect-square max-h-[300px]"
            config={{
              orders: { label: "Orders", color: "var(--chart-1)" },
              leads: { label: "Leads", color: "var(--chart-2)" },
            }}
          >
            <ResponsiveContainer>
              <RadarChart
                data={chartData}
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <PolarAngleAxis dataKey="month" />
                <PolarGrid />
                <Radar
                  name="Leads"
                  dataKey="leads"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Orders"
                  dataKey="orders"
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this year <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          Yearly breakdown
        </div>
      </CardFooter>
    </Card>
  );
}
