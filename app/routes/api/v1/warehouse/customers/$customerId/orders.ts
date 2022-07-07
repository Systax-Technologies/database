import type { Order } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import {
  badRequestResponse,
  forbiddenResponse,
  notFoundResponse,
} from "~/helpers/response-helpers.server";
import { verifyRequest } from "~/lib/verify-request.server";
import { findCustomerOrders } from "~/models/order/order.server";

type LoaderData = { orders: Order[] };

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  let jwtContent = verifyRequest<"employee">(request);
  if (jwtContent.role !== "ADMIN") {
    throw forbiddenResponse();
  }

  const customerId = params.customerId;

  if (!customerId) {
    throw badRequestResponse();
  }

  const orders = await findCustomerOrders(customerId);

  if (!orders || !orders.length) {
    throw notFoundResponse();
  }

  return { orders };
};
