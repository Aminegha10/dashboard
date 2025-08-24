"use client";
import React from "react";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
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
import { useGetLeadDataQuery } from "@/features/dataApi";

export function ChartAreaDefault() {
  const { data: leadsData, isLoading, error } = useGetLeadDataQuery();

  // Aggregate total sales per month
  const chartData = React.useMemo(() => {
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

    const monthlySales = Array(12).fill(0);

    leadsData.data.leads.forEach((lead) => {
      if (
        lead.createdAt &&
        lead.pipeline?.label?.toLowerCase() === "commande"
      ) {
        const date = new Date(lead.createdAt);
        const sales = Number(lead.prixttc ?? 0);
        monthlySales[date.getMonth()] += sales;
      }
    });

    return months.map((month, idx) => ({
      month,
      sales: monthlySales[idx],
    }));
  }, [leadsData]);

  // Calculate overall trend (simple percentage change)
  const trend = React.useMemo(() => {
    if (chartData.length < 2) return 0;
    const first = chartData[0].sales;
    const last = chartData[chartData.length - 1].sales;
    return first === 0 ? 0 : ((last - first) / first) * 100;
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Sales</CardTitle>
        <CardDescription>Last 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="text-center py-20">Loading chart...</div>}
        {error && <div className="text-red-500">Error: {error.message}</div>}
        {!isLoading && chartData.length > 0 && (
          <LineChart
            width={600}
            height={300}
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="var(--chart-3)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {trend >= 0
            ? `Trending up by ${trend.toFixed(1)}%`
            : `Trending down by ${Math.abs(trend).toFixed(1)}%`}{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total sales per month
        </div>
      </CardFooter>
    </Card>
  );
}
