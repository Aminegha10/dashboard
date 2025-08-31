"use client";

import { useMemo } from "react";
import { Wallet, Globe, FileText, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetLeadStatsQuery } from "@/features/dataApi";
import { Grid2x2Plus } from "lucide-react";

import { Riple } from "react-loading-indicators";

function MetricCard({ title, value, change, isPositive, icon, isLoading }) {
  return (
    <Card
      className="bg-white border-0"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
      }}
    >
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center">
            <Riple
              color="var(--color-primary)"
              size="medium"
              text=""
              textColor=""
            />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#8C8C8C]">{title}</p>
              <div>
                <span className="text-2xl font-bold text-gray-900 mr-1">
                  {value}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {change}
                </span>
              </div>
            </div>
            <div className="p-3 bg-teal-100 rounded-lg">
              <div className="text-teal-600">{icon}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SectionCards({ salesAgent }) {
  // Call the API with optional salesAgent filter
  const { data: stats, isLoading } = useGetLeadStatsQuery({ salesAgent });

  const metrics = [
    {
      title: "Total Orders",
      value: stats?.totalOrders?.toLocaleString() ?? "0",
      change: "+8%",
      isPositive: true,
      icon: <ShoppingCart className="w-6 h-6" />,
    },
    {
      title: "Orders Today",
      value: stats?.todayOrders?.toLocaleString() ?? "0",
      change: "+5%",
      isPositive: true,
      icon: <Grid2x2Plus className="w-6 h-6" />,
    },
    {
      title: "Sales",
      value: stats?.totalSales + " DH",
      change: "+5%",
      isPositive: true,
      icon: <Wallet className="w-6 h-6" />,
    },
    {
      title: "Conversion %",
      value: 0,
      change: "+2%",
      isPositive: true,
      icon: <FileText className="w-6 h-6" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard
          isLoading={isLoading}
          key={index}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          isPositive={metric.isPositive}
          icon={metric.icon}
        />
      ))}
    </div>
  );
}
