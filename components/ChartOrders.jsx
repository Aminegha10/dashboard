"use client";

import { useState, useMemo } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetLeadDataQuery } from "@/features/dataApi";
import { ThreeDot } from "react-loading-indicators";
import { Badge } from "./ui/badge";

const chartConfig = {
  leads: {
    label: "Leads",
    color: "var(--chart-1)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
};

export function ChartOrders() {
  const { data: leadsData, isLoading, isError } = useGetLeadDataQuery();
  const [selectedTeam, setSelectedTeam] = useState("All");

  // Process data for the radar chart
  const chartData = useMemo(() => {
    const MONTHS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const defaultData = MONTHS.map((month) => ({ month, leads: 0, orders: 0 }));

    if (!leadsData?.data?.leads) return defaultData;

    const leadsArray = leadsData.data.leads;
    if (!leadsArray?.length) return defaultData;

    // Filter by team OR agent (team.label or createdBy.label)
    const filtered = leadsArray.filter(
      (lead) =>
        lead &&
        (selectedTeam === "All" || lead.createdBy?.label === selectedTeam)
    );

    const currentYear = new Date().getFullYear();
    const monthlyData = defaultData;

    filtered.forEach((lead) => {
      const leadDate = new Date(lead.createdAt);
      const leadYear = leadDate.getFullYear();

      if (leadYear === currentYear) {
        const monthIndex = leadDate.getMonth();
        monthlyData[monthIndex].leads += 1;

        const isOrder =
          lead.pipelineStage?.label?.toLowerCase() ===
          "confirmation de réception";

        monthlyData[monthIndex].orders += isOrder ? 1 : 0; // only filter by label
      }
    });

    return monthlyData;
  }, [leadsData, selectedTeam]);

  // Extract unique teams and agents for dropdown
  const teams = useMemo(() => {
  if (!leadsData?.data?.leads) return ["All"];

  const leadsArray = leadsData.data.leads;

  const list = Array.from(
    new Set(
      leadsArray
        .filter(Boolean)
        .map((l) => l.createdBy?.label)
        .filter(Boolean)
    )
  );

  list.unshift("All"); // add "All" option at the beginning
  return list;
}, [leadsData]);


  return (
    <Card>
      <CardHeader className="items-center pb-4 flex-col md:flex-row md:justify-between">
        <div>
          <CardTitle>Leads & Orders Distribution</CardTitle>
          <CardDescription>Monthly summary of leads and orders</CardDescription>
        </div>
        <div className="flex gap-2">
          <Select onValueChange={setSelectedTeam} defaultValue="All">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Team/Agent" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="pb-0">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <ThreeDot
              variant="pulsate"
              color="var(--color-primary)"
              size="medium"
              text=""
              textColor=""
            />
          </div>
        ) : isError ? (
          <div className="flex justify-center py-6 text-red-500">
            Error loading data
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[350px]"
          >
            <RadarChart
              data={chartData}
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <PolarAngleAxis
                dataKey="month"
                tick={({ x, y, textAnchor, index, ...props }) => {
                  const data = chartData[index];
                  return (
                    <text
                      x={x}
                      y={index === 0 ? y - 10 : y}
                      textAnchor={textAnchor}
                      fontSize={13}
                      fontWeight={500}
                      {...props}
                    >
                      <tspan>{data.leads}</tspan>
                      <tspan className="fill-muted-foreground">/</tspan>
                      <tspan>{data.orders}</tspan>
                      <tspan
                        x={x}
                        dy="1rem"
                        fontSize={12}
                        className="fill-muted-foreground"
                      >
                        {data.month}
                      </tspan>
                    </text>
                  );
                }}
              />
              <PolarGrid />
              <Radar
                name="Leads"
                dataKey="leads"
                stroke="var(--chart-1)"
                fill="var(--chart-1)"
                fillOpacity={0.6}
              />
              <Radar
                name="Orders"
                dataKey="orders"
                stroke="var(--chart-2)"
                fill="var(--chart-2)"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          <Badge variant="secondary">
            {selectedTeam === "All" ? "All Teams/Agents" : selectedTeam} -{" "}
            {new Date().getFullYear()}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
