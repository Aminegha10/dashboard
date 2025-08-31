"use client";

import React, { useMemo, useState } from "react";
import { useGetLeadStatsQuery } from "@/features/dataApi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ThreeDot } from "react-loading-indicators";
import { Badge } from "./ui/badge";

export default function SalesAgentBarChart() {
  const [timeRange, setTimeRange] = useState("last_7");
  const [agentFilter, setAgentFilter] = useState("all");
  const [type, setType] = useState("orders");

  const {
    data: stats,
    isLoading,
    error,
  } = useGetLeadStatsQuery({
    salesAgent: agentFilter !== "all" ? agentFilter : undefined,
    timeRange,
    type,
  });

  // 📊 Chart data
  const chartData = useMemo(() => {
    if (!stats?.agents) return [];
    return stats.agents.map((agent) => ({
      name: agent.name,
      value: agent[type === "orders" ? "totalOrders" : "totalSales"], // ✅ normalize key to `value`
    }));
  }, [stats, type]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center gap-2 flex-wrap">
          <div>
            <CardTitle>
              Agent {type === "orders" ? "Orders" : "Sales"}
            </CardTitle>
            <CardDescription className="text-[#8C8C8C]">
              {type === "orders" ? "Orders" : "Sales"}{" "}
              {timeRange === "last_7"
                ? "Last 7 Days"
                : timeRange === "last_30"
                ? "Last 30 Days"
                : "Year to Date"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="min-w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="min-w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_7">Last 7 Days</SelectItem>
                <SelectItem value="last_30">Last 30 Days</SelectItem>
                <SelectItem value="ytd">Current Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger className="min-w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["all", ...(stats?.allAgents || [])].map((a) => (
                  <SelectItem key={a} value={a}>
                    {a === "all" ? "All Agents" : a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
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
            Error loading data
          </div>
        )}

        {chartData.length > 0 && (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value" // ✅ now consistent
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 text-center font-medium">
              <Badge variant="secondary">
                {type === "orders"
                  ? `Total Orders: ${stats.totalOrders}`
                  : `Total Sales: ${stats.totalSales}`}
              </Badge>
            </div>
          </>
        )}
        {chartData.length === 0 && (
          <div className="flex  justify-center pt-12 text-gray-500">
            {type === "orders"
              ? "No order data available"
              : "No sales data available"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
