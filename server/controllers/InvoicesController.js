import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { invoicesService } from "../services/InvoicesService"

export class InvoicesController extends BaseController {
  constructor() {
    super("api/invoices");
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      .get("/:id", this.getInvoiceNumber)

  }
  async getInvoiceNumber(req, res, next) {
    try {
      let data = await invoicesService.getInvoiceNumber(req.params.id);
      res.send(data);
    } catch (error) {
      next(error);
    }
  }

}
