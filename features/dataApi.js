import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const DataApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://smabapi.qalqul.io/api/",
    prepareHeaders: (headers) => {
      headers.set(
        "Authorization",
        "@pe4^C%^8!p&I8QmV%39ckN%2&DrutipMi6F7pG1sVcQcM9@1u3#b7!d9@2k"
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getLeadData: builder.query({
      query: () => `qalqul-leads/leads?top=589&skip=0`,
    }),
  }),
});

export const { useGetLeadDataQuery } = DataApi;
