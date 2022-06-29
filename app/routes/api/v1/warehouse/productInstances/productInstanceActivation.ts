import type { ProductInstance } from "@prisma/client";
import type { ActionFunction } from "@remix-run/node";
import { z } from "zod";
import {
  methodNotAllowedResponse,
  notFoundResponse,
} from "~/helpers/response-helpers.server";
import { parseBody } from "~/lib/parse-body.server";
import { productInstanceActivation } from "~/models/productInstance/productInstance.server";

type LoaderData = {
  activatedProduct: ProductInstance;
};

export const action: ActionFunction = async ({
  request,
}): Promise<LoaderData> => {
  if (request.method.toLowerCase() != "post") {
    throw methodNotAllowedResponse();
  }
  const schema = z.object({
    customerId: z.string().cuid(),
    productInstanceId: z.string().cuid(),
  });

  const data = await parseBody(request, schema);
  const productInstanceActivated = await productInstanceActivation(
    data.customerId,
    data.productInstanceId,
  );

  if (productInstanceActivated == null) {
    throw notFoundResponse();
  }

  return { activatedProduct: productInstanceActivated };
};
