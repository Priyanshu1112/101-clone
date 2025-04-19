import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";
import InvoiceRow from "./InvoiceRow";

const InvoiceTable = () => {
  const invoices = [
    {
      period: "30 Nov - 30 Dec 2024",
      users: 12,
      total: "₹941.79",
      status: "Pending",
      action: "Pay Invoice",
    },
    {
      period: "30 Oct - 30 Nov 2024",
      users: 12,
      total: "₹941.79",
      status: "Failed",
      action: "Download Invoice",
    },
    {
      period: "30 Sep - 30 Oct 2024",
      users: 12,
      total: "₹941.79",
      status: "Paid",
      action: "Download Invoice",
    },
    {
      period: "30 Aug - 30 Sep 2024",
      users: 12,
      total: "₹941.79",
      status: "Paid",
      action: "Download Invoice",
    },
    {
      period: "30 Jul - 30 Aug 2024",
      users: 13,
      total: "₹941.79",
      status: "Paid",
      action: "Download Invoice",
    },
    {
      period: "30 Jun - 30 Jul 2024",
      users: 10,
      total: "₹941.79",
      status: "Paid",
      action: "Download Invoice",
    },
  ];

  return (
    <div className="bg-white rounded-t-lg shadow-sm border mt-6">
      {/* Header Section */}
      <div className="px-6 pt-4 rounded-t-lg pb-4 bg-[#F9FAFB]">
        <Typography
          text="Invoices"
          variant="heading1"
          className="text-gray-800 font-semibold "
        />
        <a href="#">
          <Typography
            text="Lorem ipsum dolor sit  amet consectetur"
            variant="paragraph3"
            className="text-gray-500 underline"
          />
        </a>
      </div>

      {/* Table */}
      <table className="w-full text-left border-collapse overflow-hidden rounded-b-lg">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="py-3 px-6">
              <Typography
                text="Invoice Period"
                variant="paragraph3"
                className="text-gray-600 font-medium"
              />
            </th>
            <th className="py-3 px-6">
              <Typography
                text="No. of Users"
                variant="paragraph3"
                className="text-gray-600 font-medium"
              />
            </th>
            <th className="py-3 px-6">
              <Typography
                text="Invoice Total"
                variant="paragraph3"
                className="text-gray-600 font-medium"
              />
            </th>
            <th className="py-3 px-6">
              <Typography
                text="Action"
                variant="paragraph3"
                className="text-gray-600 font-medium"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <InvoiceRow
              key={index}
              period={invoice.period}
              users={invoice.users}
              total={invoice.total}
              status={invoice.status as "Pending" | "Paid" | "Failed"}
              actionLabel={invoice.action}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;