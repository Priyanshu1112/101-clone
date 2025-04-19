import React, { Dispatch, SetStateAction } from "react";
import Typography from "@/app/(dashboard)/_components/Typography";

const ActionButtons = ({
  onDiscard,
  onSubmit,
  isEdit,
  setIsEdit,
}: {
  onDiscard: () => void;
  onSubmit: () => void;
  isEdit: boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex justify-end space-x-4">
      {/* Discard Button */}
      {isEdit ? (
        <>
          <button
            type="button"
            onClick={onDiscard}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Typography
              text="Discard"
              variant="paragraph2"
              className="text-gray-700 font-medium"
            />
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={onSubmit}
            className="px-6 py-2 bg-[#2D3C2F] text-[#FFF75A] rounded-lg hover:bg-[#1C291E]"
          >
            <Typography
              text="Save"
              variant="paragraph2"
              className="text-[#FFF75A] font-medium"
            />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setIsEdit(true)}
          className="px-6 py-2 bg-[#2D3C2F] text-[#FFF75A] rounded-lg hover:bg-[#1C291E]"
        >
          <Typography
            text="Edit details"
            variant="paragraph2"
            className="text-[#FFF75A] font-medium"
          />
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
