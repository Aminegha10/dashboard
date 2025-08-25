"use client";

import { useState, useMemo } from "react";
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
import { LifeLine } from "react-loading-indicators";

export function ChartOrdersCount() {
  const { data: leadsData, isLoading, error } = useGetLeadDataQuery();
  const [agentFilter, setAgentFilter] = useState("all");

  // Get unique agents for the dropdown
  const agents = useMemo(() => {
    if (!leadsData?.data?.leads) return ["all"];
    const setAgents = new Set(
      leadsData.data.leads
        .map((lead) => lead.createdBy?.label)
        .filter(Boolean)
    );
    return ["all", ...Array.from(setAgents)];
  }, [leadsData]);

  // Aggregate orders per month based on selected agent
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
      if (!lead.createdAt) return;

      const isOrder =
        lead.pipelineStage?.label?.toLowerCase() ===
        "confirmation de réception"; // count only orders
      const isAgentMatch =
        agentFilter === "all" || lead.createdBy?.label === agentFilter;

      if (isOrder && isAgentMatch) {
        const monthIndex = new Date(lead.createdAt).getMonth();
        monthlyOrders[monthIndex] += 1;
      }
    });

    return months.map((month, idx) => ({
      month,
      orders: monthlyOrders[idx],
    }));
  }, [leadsData, agentFilter]);

  // Calculate trend (percentage change from first to last month with data)
  const trend = useMemo(() => {
    const nonZeroOrders = chartData.filter((c) => c.orders > 0);
    if (nonZeroOrders.length < 2) return 0;
    const first = nonZeroOrders[0].orders;
    const last = nonZeroOrders[nonZeroOrders.length - 1].orders;
    return first === 0 ? 0 : ((last - first) / first) * 100;
  }, [chartData]);

  const chartConfig = {
    orders: { label: "Orders", color: "var(--chart-1)" },
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle>Orders Area Chart</CardTitle>
          <CardDescription>Monthly completed orders</CardDescription>
        </div>
        <div className="flex gap-2">
          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="min-w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent} value={agent}>
                  {agent === "all" ? "All Agents" : agent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading && (
          <div className="flex justify-center">
            <LifeLine color="var(--color-primary)" size="medium" text="" />
          </div>
        )}
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
                : `Trending down by ${Math.abs(trend).toFixed(1)}% this month`}{" "}
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
