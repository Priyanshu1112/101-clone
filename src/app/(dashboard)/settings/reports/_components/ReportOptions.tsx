import Typography from "@/app/(dashboard)/_components/Typography";

const ReportOptions = ({
  selectedOption,
  setSelectedOption,
}: {
  selectedOption: string;
  setSelectedOption: (value: string) => void;
}) => {
  const options = [
    {
      id: "summary",
      title: "Summary of leave balances",
      description:
        "Get a summary of your team's leave balances. This report shows leave taken and remaining for each member, aiding resource management.",
    },
    {
      id: "record",
      title: "Record of all leaves",
      description:
        "Download the report to see all leaves taken by your team in the selected leave cycle. This overview helps you manage and plan effectively.",
    },
  ];

  return (
    <div className="space-y-4">
      <Typography
        text="Select the type of report you want to download"
        variant="paragraph3"
        className="font-semibold text-grey/500 mb-2"
      />
      <div className="flex gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            className={`w-full border rounded-lg p-4 text-left hover:shadow-md transition ${
              selectedOption === option.id
                ? "border-black bg-gray-50"
                : "border-gray-300"
            }`}
            onClick={() => setSelectedOption(option.id)}
          >
            <div className="flex justify-between items-center">
              <Typography
                text={option.title}
                variant="paragraph3"
                className="font-semibold text-grey/500"
              />
              <input
                type="radio"
                name="report-type"
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
                className="h-5 w-5 text-green-600"
              />
            </div>
            <Typography
              text={option.description}
              variant="paragraph3"
              className="text-grey/400 mt-2"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReportOptions;
