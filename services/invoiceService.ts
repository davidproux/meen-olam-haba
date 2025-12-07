import { InvoiceSummary, Unit } from "../types";
import { INVOICE4U_API_BASE, INVOICE4U_API_KEY, LEAD_COST } from "../constants";

export const invoice4uCreateInvoice = async (unit: Unit, invoice: InvoiceSummary): Promise<string> => {
  
  // Simulation of API Payload
  const payload = {
    customer: {
      name: unit.name,
      external_id: unit.id,
    },
    lines: [
      {
        description: `Leads ${invoice.month} (${invoice.leads_count} x ${LEAD_COST}₪)`,
        quantity: invoice.leads_count,
        unit_price: LEAD_COST,
        currency: "ILS",
      },
    ],
    metadata: {
      unit_id: unit.id,
      month: invoice.month,
    },
  };

  console.log('calling Invoice4U API:', `${INVOICE4U_API_BASE}/invoices`, payload);
  console.log('Headers:', { Authorization: `Bearer ${INVOICE4U_API_KEY}` });

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Return a mock public invoice URL
  return `https://invoice4u.example/view/${Date.now()}`;
};
