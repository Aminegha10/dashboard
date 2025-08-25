"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useGetLeadDataQuery } from "../features/dataApi";

export function AgentPerformanceTable() {
  const { data: leadsData, isLoading, isError } = useGetLeadDataQuery();

  // Transform API data for table
  const tableData = React.useMemo(() => {
    if (!leadsData?.data?.leads) return [];

    const agentPerformance = leadsData.data.leads.reduce((acc, lead) => {
      if (!lead) return acc;

      const agent = lead.createdBy?.label || "Unknown";
      if (!acc[agent]) acc[agent] = { orders: 0, leads: 0, sales: 0 };

      acc[agent].leads += 1;

      const isOrder =
        lead.pipelineStage?.label?.toLowerCase() ===
        "confirmation de réception"; // filter by label
      if (isOrder) acc[agent].orders += 1;

      acc[agent].sales += Number(lead.prixttc) || 0;

      return acc;
    }, {});

    return Object.entries(agentPerformance).map(([agent, stats]) => ({
      agent,
      orders: stats.orders,
      leads: stats.leads,
      conversion:
        stats.leads > 0
          ? ((stats.orders / stats.leads) * 100).toFixed(2) + "%"
          : "0%",
      sales: stats.sales,
    }));
  }, [leadsData]);

  // Calculate totals
  const totals = React.useMemo(() => {
    const totalLeads = tableData.reduce((sum, row) => sum + row.leads, 0);
    const totalOrders = tableData.reduce((sum, row) => sum + row.orders, 0);
    const totalSales = tableData.reduce((sum, row) => sum + row.sales, 0);
    return { totalLeads, totalOrders, totalSales };
  }, [tableData]);

  const columns = React.useMemo(
    () => [
      { accessorKey: "agent", header: "Agent" },
      { accessorKey: "orders", header: "Orders" },
      { accessorKey: "leads", header: "Leads" },
      { accessorKey: "conversion", header: "Conversion %" },
      {
        accessorKey: "sales",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting()} // fixed sorting toggle
          >
            Sales <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(row.getValue("sales")),
      },
    ],
    []
  );

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching leads</div>;

  return (
    <div className="w-full">
      {/* Totals */}
      <div className="mb-4 flex space-x-6 text-sm font-medium">
        <div>Total Leads: {totals.totalLeads}</div>
        <div>Total Orders: {totals.totalOrders}</div>
        <div>
          Total Sales:{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(totals.totalSales)}
        </div>
      </div>

      {/* Filters & Column Visibility */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter agents..."
          value={table.getColumn("agent")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("agent")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
