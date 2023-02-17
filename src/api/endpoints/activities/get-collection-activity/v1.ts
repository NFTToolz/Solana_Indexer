/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from "lodash";
import { Request, RouteOptions } from "@hapi/hapi";

export const getCollectionActivityV1Options: RouteOptions = {
  description: "Collection activity",
  notes: "This API can be used to build a feed for a collection",
  tags: ["api", "x-deprecated"],
  plugins: {
    "hapi-swagger": {
      order: 1,
    },
  },
  handler: async (request: Request) => {
      return { activities: [] };
  },
};
