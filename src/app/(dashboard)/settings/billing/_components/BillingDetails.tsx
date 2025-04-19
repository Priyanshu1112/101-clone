import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";

// Dummy data for billing details
const billingDetails = {
  email: "jay@zazzy.studio",
  creditCard: "XXXX XXXX XXXX 5004",
  validTill: "03/29",
  taxID: "27AABCY2468G1Z5",
};

const BillingDetails = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header Section */}
      <div className="p-6 bg-[#F9FAFB] rounded-t-lg border-b border-gray-200 flex justify-between items-center">
        <div>
          <Typography
            text="Billing details"
            variant="heading1"
            className="text-gray-800"
          />
          <a href="#" className="underline">
            <Typography
              text="Lorem ipsum dolor sit amet consectetur"
              variant="paragraph3"
              className="text-gray-500 underline"
            />
          </a>
        </div>
        {/* Edit Details Button */}
        <button className="hover:underline">
          <Typography
            text="Edit Details"
            variant="paragraph3"
            className="text-gray-800 font-medium"
          />
        </button>
      </div>

      {/* Billing Information */}
      <div className="p-6 space-y-5">
        {/* Email */}
        <div>
          <Typography
            text="Email"
            variant="paragraph3"
            className="text-gray-500"
          />
          <Typography
            text={billingDetails.email}
            variant="paragraph3"
            className="text-gray-800 font-medium"
          />
        </div>

        {/* Credit Card */}
        <div>
          <Typography
            text="Credit card"
            variant="paragraph3"
            className="text-gray-500"
          />
          <Typography
            text={`${billingDetails.creditCard} • Valid till: ${billingDetails.validTill}`}
            variant="paragraph3"
            className="text-gray-800 font-medium"
          />
        </div>

        {/* Tax ID */}
        <div>
          <Typography
            text="Tax ID • How to manage?"
            variant="paragraph3"
            className="text-gray-500"
          />
          <Typography
            text={billingDetails.taxID}
            variant="paragraph3"
            className="text-gray-800 font-medium"
          />
        </div>
      </div>
    </div>
  );
};

export default BillingDetails;