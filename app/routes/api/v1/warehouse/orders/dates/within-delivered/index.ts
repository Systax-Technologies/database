import type { ActionFunction } from "@remix-run/node";
import { z } from "zod";
import {
  methodNotAllowedResponse,
  notFoundResponse,
} from "~/helpers/response-helpers.server";
import { parseBody } from "~/lib/parse-body.server";
import { findOrdersWithinDeliveredDates } from "~/models/order/order.server";

export const action: ActionFunction = async ({ request }) => {
  if (request.method.toLowerCase() != "post") {
    throw methodNotAllowedResponse();
  }

  const schema = z.object({
    startDate: z.preprocess((arg) => {
      if (typeof arg === "string") {
        return new Date(arg);
      }
    }, z.date()),
    endDate: z.preprocess((arg) => {
      if (typeof arg === "string") {
        return new Date(arg);
      }
    }, z.date()),
  });

  const parsedData = await parseBody(request, schema);

  const ordersWithinDates = await findOrdersWithinDeliveredDates(
    parsedData.startDate,
    parsedData.endDate
  );

  if (!ordersWithinDates || !ordersWithinDates.length) {
    throw notFoundResponse();
  }

  return new Response(JSON.stringify({ ordersWithinDates }), {
    status: 200,
    statusText: "OK",
  });
};
