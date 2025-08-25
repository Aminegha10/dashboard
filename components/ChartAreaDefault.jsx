"use client";

import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useGetLeadDataQuery } from "@/features/dataApi";
import { LifeLine } from "react-loading-indicators";
import { TrendingUp } from "lucide-react";

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
      if (lead?.createdAt && lead?.prixttc) {
        const monthIndex = new Date(lead.createdAt).getMonth();
        monthlySales[monthIndex] += Number(lead.prixttc) || 0;
      }
    });

    return months.map((month, idx) => ({
      month,
      sales: monthlySales[idx],
    }));
  }, [leadsData]);

  // Calculate total sales
  const totalSales = React.useMemo(() => {
    return chartData.reduce((sum, month) => sum + month.sales, 0);
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Sales</CardTitle>
        <CardDescription>Last 12 months</CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading && (
          <div className="flex justify-center py-10">
            <LifeLine color="var(--color-primary)" size="medium" />
          </div>
        )}

        {error && (
          <div className="text-red-500">
            Error: {error?.message || "Something went wrong"}
          </div>
        )}

        {!isLoading && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
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
              <YAxis
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                formatter={(value) => `$${Number(value).toLocaleString()}`}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="var(--chart-3)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          <TrendingUp className="h-4 w-4" />
          Total Sales
        </div>
        <div className="text-muted-foreground leading-none">
          ${totalSales.toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  );
}
