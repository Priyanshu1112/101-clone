import React from "react";
import BillingDetails from "./_components/BillingDetails";
import InvoiceTable from "./_components/InvoiceTable";

const BillingPage = () => {
  return (
    <div className="p-8 space-y-6 border bg-white rounded-lg min-h-screen">
      <BillingDetails />
      <InvoiceTable />
    </div>
  );
};

export default BillingPage;