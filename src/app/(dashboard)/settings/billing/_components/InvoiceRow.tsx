import React from "react";
import Typography from "@/app/(dashboard)/_components/Typography";

interface InvoiceRowProps {
  period: string;
  users: number;
  total: string;
  status: "Pending" | "Paid" | "Failed";
  actionLabel: string;
}

const InvoiceRow: React.FC<InvoiceRowProps> = ({
  period,
  users,
  total,
  status,
  actionLabel,
}) => {
  return (
    <tr className="border-b  border-gray-200 hover:bg-gray-50">
      {/* Invoice Period */}
      <td className="py-4 px-6">
        <Typography
          text={period}
          variant="paragraph2"
          className="text-gray-600"
        />
      </td>

      {/* No. of Users */}
      <td className="py-4 px-6">
        <Typography
          text={String(users)}
          variant="paragraph2"
          className="text-gray-600"
        />
      </td>

      {/* Invoice Total + Status */}
      <td className="py-4 px-6 flex items-center space-x-2">
        <Typography
          text={total}
          variant="paragraph2"
          className="text-gray-600"
        />
        {status && (
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : status === "Failed"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            <Typography text={status} variant="label" />
          </span>
        )}
      </td>

      {/* Action */}
      <td className="py-4 px-6">
        <Typography
          text={actionLabel}
          variant="paragraph2"
          className="text-gray-500 font-medium hover:underline cursor-pointer"
        />
      </td>
    </tr>
  );
};

export default InvoiceRow;