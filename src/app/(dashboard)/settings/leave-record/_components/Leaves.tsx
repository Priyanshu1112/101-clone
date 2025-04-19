import LeaveRecordField from "./LeaveRecordField";
import Typography from "@/app/(dashboard)/_components/Typography";
import { CustomLeaveRecord } from "./LeaveRecordsList";

const Leaves = ({
  title,
  leaveRecords,
}: {
  title: string;
  leaveRecords: CustomLeaveRecord[];
}) => {
  return (
    <div className="space-y-4">
      <Typography
        text={title}
        variant="paragraph1"
        className="font-bold text-[#344054] mt-4 mx-6"
      />
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mx-6">
        {leaveRecords.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {leaveRecords.map((leave) => (
              <LeaveRecordField
                key={leave.id}
                date={leave.date}
                type={leave.type}
                approver={leave.approver}
                deducted={leave.deducted}
                status={leave.status}
                message={
                  title == "Past"
                    ? "day leave deducted"
                    : "day leave will be deducted"
                }
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-md p-4 border border-gray-200 text-center">
            <Typography
              text={title == "Past" ? "No past leaves." : "No upcoming leaves"}
              variant="paragraph2"
              className="text-gray-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaves;
