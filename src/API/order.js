import axios from "axios";
import { privateAPi } from "./privateapis";

export const orderListApi = async (payload) => {
  return await privateAPi.post("/cashier/order/list", payload);
};
