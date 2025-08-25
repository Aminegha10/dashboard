"use client";

import React, { useMemo, useState } from "react";
import { useGetLeadDataQuery } from "@/features/dataApi";
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
  const { data: leads, isLoading, error } = useGetLeadDataQuery();

  const [metric, setMetric] = useState("sales");
  const [timeRange, setTimeRange] = useState("last_30");
  const [agentFilter, setAgentFilter] = useState("all");

  // 1️⃣ Filter leads by time
  const filteredByTime = useMemo(() => {
    if (!leads?.data?.leads) return [];
    const leadsArray = leads.data.leads;

    const now = new Date();
    return leadsArray.filter((lead) => {
      if (!lead.createdAt) return true;
      const created = new Date(lead.createdAt);

      if (timeRange === "last_7")
        return (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24) <= 7;
      if (timeRange === "last_30")
        return (
          (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24) <= 30
        );
      if (timeRange === "ytd")
        return created.getFullYear() === now.getFullYear();

      return true;
    });
  }, [leads, timeRange]);

  // 2️⃣ Filter by sales agent
  const filteredByAgent = useMemo(() => {
    if (agentFilter === "all") return filteredByTime;
    return filteredByTime.filter(
      (lead) => lead.createdBy?.label === agentFilter
    );
  }, [filteredByTime, agentFilter]);

  // 3️⃣ Aggregate per SALES AGENT
  const chartData = useMemo(() => {
    const map = {};

    filteredByAgent.forEach((lead) => {
      const agent = lead.createdBy?.label || "Unknown Agent";
      const sales = Number(lead.prixttc) || 0;

      // ✅ Orders detected by pipelineStage "Préparation de la commande"
      const isOrder =
        lead.pipelineStage?.label?.toLowerCase() ===
        "confirmation de réception";

      if (!map[agent]) {
        map[agent] = { name: agent, leads: 0, orders: 0, sales: 0 };
      }

      map[agent].leads += 1;

      if (isOrder) {
        map[agent].orders += 1;
        map[agent].sales += sales;
      }
    });

    return Object.values(map).map((a) => ({
      ...a,
      conversion: a.leads > 0 ? (a.orders / a.leads) * 100 : 0,
      aov: a.orders ? a.sales / a.orders : 0,
    }));
  }, [filteredByAgent]);

  // 4️⃣ Totals (all agents combined)
  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, a) => {
        acc.orders += a.orders;
        acc.leads += a.leads;
        return acc;
      },
      { orders: 0, leads: 0 }
    );
  }, [chartData]);

  // 5️⃣ Get all unique agents
  const agents = useMemo(() => {
    if (!leads?.data?.leads) return ["all"];
    const setAgents = new Set(
      leads.data.leads.map((l) => l.createdBy?.label).filter(Boolean)
    );
    return ["all", ...Array.from(setAgents)];
  }, [leads]);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Agent Performance</CardTitle>
          <CardDescription>Sales by agent (Leads vs Orders)</CardDescription>
        </div>

        <div className="pt-5 flex justify-center gap-2 flex-wrap">
          {/* Time range filter */}
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

          {/* Agent filter */}
          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="min-w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {agents.map((a) => (
                <SelectItem key={a} value={a}>
                  {a === "all" ? "All Agents" : a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Metric filter */}
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="min-w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Total Sales</SelectItem>
              <SelectItem value="conversion">Conversion %</SelectItem>
              <SelectItem value="aov">Average Order Value</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading && (
          <div className="flex justify-center py-6">
            <ThreeDot
              variant="pulsate"
              color="var(--color-primary)"
              size="medium"
              text=""
              textColor=""
            />
          </div>
        )}

        {error && (
          <div className="flex justify-center py-6 text-red-500">
            Error loading data
          </div>
        )}

        {leads?.data?.leads && chartData.length > 0 && (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    metric === "conversion"
                      ? `${value.toFixed(1)}%`
                      : `$${value.toFixed(2)}`
                  }
                />
                <Bar
                  dataKey={metric}
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            {/* Totals below chart */}
            <div className="mt-4 text-center font-medium">
              <Badge variant="secondary">Total Orders: {totals.orders}</Badge> |{" "}
              <Badge variant="secondary">Total Leads: {totals.leads}</Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
