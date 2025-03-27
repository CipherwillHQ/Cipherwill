import capitalizeFirstLetter from "@/common/string/capitalizeFirstLetter";
import GET_INVOICE_PDF from "@/graphql/ops/app/billing/queries/GET_INVOICE_PDF";
import GET_MY_INVOICES from "@/graphql/ops/app/billing/queries/GET_MY_INVOICES";
import { useLazyQuery, useQuery } from "@apollo/client";
import { DateTime } from "luxon";
import toast from "react-hot-toast";

export default function Invoices() {
  const { data, loading, error } = useQuery(GET_MY_INVOICES);
  const [fetchInvoicePDF] = useLazyQuery(GET_INVOICE_PDF);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const invoices = data?.getMyInvoices || [];

  return (
    <div>
      <h2 className="text-xl font-semibold my-2">Past Invoices</h2>
      {invoices.length === 0 && <div>You have no past invoices.</div>}

      <div>
        {invoices.map((invoice) => {
          return (
            <div
              key={invoice.id}
              className="border border-default bg-secondary rounded-sm my-2 p-2"
            >
              <div className="flex gap-2 items-center justify-between mb-2">
                <div>
                  Payment made for {capitalizeFirstLetter(invoice.plan_name)}{" "}
                  Plan
                </div>
                <div className="text-xl font-semibold">
                  {invoice.currency === "USD" ? "$" : invoice.currency}
                  {parseInt(invoice.amount) / 100}
                </div>
              </div>
              <div className="flex gap-2 items-center justify-between">
                <div className="">
                  <span className="mr-1">Paid on</span>
                  {DateTime.fromMillis(
                    parseInt(invoice.created_at)
                  ).toLocaleString(DateTime.DATETIME_MED)}
                </div>
                <button
                  className="border px-4 py-1 rounded-full text-xs"
                  onClick={async () => {
                    const pdf = await fetchInvoicePDF({
                      variables: {
                        invoiceId: invoice.id,
                      },
                    });
                    if (pdf && pdf?.data?.getInvoicePdf) {
                      window.open(pdf?.data?.getInvoicePdf, "_blank");
                    } else {
                      toast.error("Failed to fetch PDF");
                    }
                  }}
                >
                  View Invoice PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
