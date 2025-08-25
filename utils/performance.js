// utils/performance.js

/**
 * Calculate agent performance totals from leads array
 * @param {Array} leads - Array of lead objects from API
 * @param {Object} options - Optional settings
 * @param {boolean} options.currentYearOnly - If true, only include leads from current year
 * @returns {Array} Array of agent performance objects { agent, leads, orders, sales, conversion }
 */
export function calculateAgentPerformance(
  leads,
  options = { currentYearOnly: false }
) {
  if (!Array.isArray(leads)) return [];

  const currentYear = new Date().getFullYear();

  const agentPerformance = leads.reduce((acc, lead) => {
    if (!lead) return acc;

    // Filter by current year if required
    const leadYear = new Date(lead.createdAt).getFullYear();
    if (options.currentYearOnly && leadYear !== currentYear) return acc;

    const agent = lead.teamMember?.label || "Unknown";
    if (!acc[agent]) acc[agent] = { leads: 0, orders: 0, sales: 0 };

    acc[agent].leads += 1;

    const isOrder = lead.pipeline?.label?.toLowerCase() === "commande";
    const hasPrice = Number(lead.prixttc) > 0;
    if (isOrder && hasPrice) acc[agent].orders += 1;

    acc[agent].sales += Number(lead.prixttc) || 0;

    return acc;
  }, {});

  return Object.entries(agentPerformance).map(([agent, stats]) => ({
    agent,
    leads: stats.leads,
    orders: stats.orders,
    sales: stats.sales,
    conversion:
      stats.leads > 0
        ? ((stats.orders / stats.leads) * 100).toFixed(2) + "%"
        : "0%",
  }));
}

/**
 * Calculate totals across all agents
 * @param {Array} performanceData - Output of calculateAgentPerformance
 * @returns {Object} { totalLeads, totalOrders, totalSales }
 */
export function calculateTotals(performanceData) {
  return {
    totalLeads: performanceData.reduce((sum, row) => sum + row.leads, 0),
    totalOrders: performanceData.reduce((sum, row) => sum + row.orders, 0),
    totalSales: performanceData.reduce((sum, row) => sum + row.sales, 0),
  };
}
