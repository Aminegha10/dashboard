import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const DataApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/", // 👈 using your backend API now
  }),
  endpoints: (builder) => ({
    // ✅ Stats endpoint (salesAgent optional)
    getLeadStats: builder.query({
      query: (params) => ({
        url: "LeadStats",
        params, // RTK Query will handle encoding automatically
      }),
    }),
    // ✅ Orders/Leads radar chart endpoint
    getRadarStats: builder.query({
      query: (params) => ({
        url: "RadarStats",
        params,
      }),
    }),
  }),
});

export const { useGetLeadStatsQuery, useGetRadarStatsQuery } = DataApi;
