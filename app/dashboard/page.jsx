import { AppSidebar } from "@/components/app-sidebar";
import SalesAgentBarChart from "@/components/chart-area-interactive.jsx";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChartAreaDefault } from "@/components/ChartAreaDefault.jsx";
import { ChartOrders } from "@/components/ChartOrders.jsx";
import { ChartOrdersCount } from "@/components/ChartOrdersCount.jsx";
import { AgentPerformanceTable } from "@/components/AgentPerformanceTable.jsx";

export default function Page() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 md:px-6">
              <SectionCards />
              <div className="grid grid-cols-2 gap-4">
                {/* First component spans all 3 columns */}
                <SalesAgentBarChart className="col-span-2" />
                <ChartOrders className="col-span-1" />

                {/* The next two components each take 1 column */}
              </div>

              <div className="grid grid-cols-2 gap-8">
                <ChartOrdersCount />
                <ChartAreaDefault />
              </div>

              <AgentPerformanceTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
