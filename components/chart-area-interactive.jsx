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
import { Input } from "@/components/ui/input";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function SalesTeamBarChart() {
  const { data: leads, isLoading, error } = useGetLeadDataQuery();

  const [metric, setMetric] = useState("sales");
  const [timeRange, setTimeRange] = useState("last_30");
  const [teamFilter, setTeamFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  // 2️⃣ Filter by team (dropdown filter)
  const filteredByTeam = useMemo(() => {
    if (teamFilter === "all") return filteredByTime;
    return filteredByTime.filter((lead) => lead.team?.label === teamFilter);
  }, [filteredByTime, teamFilter]);

  // 3️⃣ Filter by search (team name search)
  const filteredLeads = useMemo(() => {
    if (!searchQuery) return filteredByTeam;
    return filteredByTeam.filter((lead) =>
      lead.team?.label?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredByTeam, searchQuery]);

  // 4️⃣ Aggregate per TEAM
  const chartData = useMemo(() => {
    const map = {};

    filteredLeads.forEach((lead) => {
      const team = lead.team?.label || "Unknown Team";
      const sales = Number(lead.prixttc) || 0;
      const isOrder =
        lead.pipeline?.label?.toLowerCase() === "commande" && sales > 0;

      if (!map[team]) map[team] = { name: team, leads: 0, orders: 0, sales: 0 };

      // ✅ Every lead is counted
      map[team].leads += 1;

      if (isOrder) {
        map[team].orders += 1;
        map[team].sales += sales;
      }
    });

    return Object.values(map).map((t) => ({
      ...t,
      conversion: t.leads > 0 ? (t.orders / t.leads) * 100 : 0,
      aov: t.orders ? t.sales / t.orders : 0,
    }));
  }, [filteredLeads]);

  // 5️⃣ Totals (all teams combined)
  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, t) => {
        acc.orders += t.orders;
        acc.leads += t.leads;
        return acc;
      },
      { orders: 0, leads: 0 }
    );
  }, [chartData]);

  // 6️⃣ Get all unique team names
  const teams = useMemo(() => {
    if (!leads?.data?.leads) return ["all"];
    const setTeams = new Set(
      leads.data.leads.map((l) => l.team?.label).filter(Boolean)
    );
    return ["all", ...Array.from(setTeams)];
  }, [leads]);

  return (
    <Card>
      <CardHeader className="">
        <div>
          {" "}
          <CardTitle className="">Team Performance</CardTitle>
          <CardDescription className="">
            Agent Performance Overview
          </CardDescription>
        </div>
        <div className="pt-5 flex justify-center gap-2 flex-wrap">
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

          <Select value={teamFilter} onValueChange={setTeamFilter}>
            <SelectTrigger className="min-w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {teams.map((t) => (
                <SelectItem key={t} value={t}>
                  {t === "all" ? "All Teams" : t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* <Input
            placeholder="Search team"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-w-[200px]"
          /> */}

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
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-500">Error: {error.message}</div>}
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
            {/* 🔥 Totals displayed below chart */}
            <div className="mt-4 text-center font-medium">
              Total Orders: {totals.orders} | Total Leads: {totals.leads}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
