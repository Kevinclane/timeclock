import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";

class InvoicesService {
  async getInvoiceNumber(userId) {
    let lastInvoice = await dbContext.InvoiceNumber.find({ CreatorId: userId }).sort({ Number: 1 }).limit(1);

    if (lastInvoice.length == 0) {
      lastInvoice = await this.createInvoiceNumber(userId);
      lastInvoice.Number++;
      return lastInvoice;
    } else {
      lastInvoice[0].Number++;
      return lastInvoice[0];
    }
  }

  async createInvoiceNumber(userId) {
    let invoice = await dbContext.InvoiceNumber.create({ CreatorId: userId });
    return invoice;
  }

  async updateInvoiceNumber(invoiceId, number, payPeriodId) {
    let invoice = await dbContext.InvoiceNumber.findByIdAndUpdate(invoiceId, {
      Number: number,
      PayPeriod: payPeriodId
    },
      { new: true });
    return invoice;
  }
}

export const invoicesService = new InvoicesService();