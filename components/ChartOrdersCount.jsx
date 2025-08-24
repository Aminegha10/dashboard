"use client";

import React, { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useGetLeadDataQuery } from "@/features/dataApi";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function ChartOrdersCount() {
  const { data: leadsData, isLoading, error } = useGetLeadDataQuery();

  const [teamFilter, setTeamFilter] = useState("all");

  // Get unique team names
  const teams = useMemo(() => {
    if (!leadsData?.data?.leads) return ["all"];
    const setTeams = new Set(
      leadsData.data.leads.map((l) => l.team?.label).filter(Boolean)
    );
    return ["all", ...Array.from(setTeams)];
  }, [leadsData]);

  // Aggregate orders per month based on selected team
  const chartData = useMemo(() => {
    if (!leadsData?.data?.leads) return [];

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthlyOrders = Array(12).fill(0);

    leadsData.data.leads.forEach((lead) => {
      if (
        lead.createdAt &&
        lead.pipeline?.label?.toLowerCase() === "commande" &&
        (teamFilter === "all" || lead.team?.label === teamFilter)
      ) {
        const date = new Date(lead.createdAt);
        monthlyOrders[date.getMonth()] += 1;
      }
    });

    return months.map((month, idx) => ({
      month,
      orders: monthlyOrders[idx],
    }));
  }, [leadsData, teamFilter]);

  // Calculate trend (percentage change from first to last month)
  const trend = useMemo(() => {
    if (chartData.length < 2) return 0;
    const first = chartData.find((c) => c.orders > 0)?.orders ?? 0;
    const last =
      chartData
        .slice()
        .reverse()
        .find((c) => c.orders > 0)?.orders ?? 0;
    return first === 0 ? 0 : ((last - first) / first) * 100;
  }, [chartData]);

  const chartConfig = {
    orders: {
      label: "Orders",
      color: "var(--chart-1)",
    },
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle>Orders Area Chart</CardTitle>
          <CardDescription>Monthly completed orders</CardDescription>
        </div>
        <div className="flex gap-2">
          <Select value={teamFilter} onValueChange={setTeamFilter}>
            <SelectTrigger className="min-w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team} value={team}>
                  {team === "all" ? "All Teams" : team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading && <div className="text-center py-20">Loading chart...</div>}
        {error && <div className="text-red-500">Error: {error.message}</div>}
        {!isLoading && chartData.length > 0 && (
          <ChartContainer config={chartConfig}>
            <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(val) => val.slice(0, 3)}
              />
              <YAxis allowDecimals={false} />
              <Tooltip content={<ChartTooltipContent indicator="line" />} />
              <Area
                dataKey="orders"
                type="natural"
                fill="var(--chart-3)"
                fillOpacity={0.4}
                stroke="var(--color-desktop)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {trend >= 0
                ? `Trending up by ${trend.toFixed(1)}% this month`
                : `Trending down by ${Math.abs(trend).toFixed(
                    1
                  )}% this month`}{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Showing total completed orders per month
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
