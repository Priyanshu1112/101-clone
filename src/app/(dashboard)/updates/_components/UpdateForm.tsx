import { SheetContent, SheetTitle } from "@/components/ui/sheet";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Typography from "../../_components/Typography";
import { ArrowRight } from "lucide-react";
import useUserStore, { CustomUpdateResponse } from "@/store/user";
import { toastFullfilled, toastPending } from "../../_components/Toast";
import {
  toastAdding,
  toastAddingError,
  toastAddingSuccess,
} from "@/utils/constant/toastMessage";
import { get12hr } from "@/utils/helpers/get12hour";

const UpdateForm = ({
  currentUpdateResponse,
  setLeaveSheetOpen,
  leaveSheetOpen,
}: {
  currentUpdateResponse: CustomUpdateResponse;
  leaveSheetOpen: boolean;
  setLeaveSheetOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { addUpdateResponse, user } = useUserStore();
  const [response, setResponse] = useState<string[]>([]);

  useEffect(() => {
    if (leaveSheetOpen)
      setResponse(
        Array.from(
          { length: currentUpdateResponse?.update?.questions?.length || 0 },
          () => ""
        )
      );
    else setResponse([]);
  }, [currentUpdateResponse?.update?.questions?.length, leaveSheetOpen]);

  const onAddUpdate = async () => {
    const toastId = toastPending(toastAdding("Update"));
    const res = await addUpdateResponse(
      user?.id ?? "",
      currentUpdateResponse.id,
      response
    );

    toastFullfilled(
      toastId,
      res,
      toastAddingSuccess("Update"),
      toastAddingError("Update"),
      setLeaveSheetOpen
    );
  };

  const onChange = (e, index) => {
    const { value } = e.target;

    setResponse((prev) => {
      const updatedResponse = [...prev];
      updatedResponse[index] = value;
      return updatedResponse;
    });
  };

  if (!currentUpdateResponse) return;
  return (
    <SheetContent className="p-0 min-w-[475px] flex flex-col">
      <SheetTitle className="py-4 px-6 border-gray-300 border-b">
        <Typography variant="display4" text="Add your updates!" />
      </SheetTitle>
      <div className="pt-5 px-6 flex-1 flex flex-col gap-5">
        <Typography
          variant="label"
          text={`Updates for ${get12hr(
            currentUpdateResponse?.update?.time ?? ""
          )}`}
          className="font-bold text-grey/500"
        />
        {currentUpdateResponse?.update?.questions.map((question, index) => {
          return (
            <div key={index}>
              <Typography
                variant="paragraph3"
                text={question}
                className="font-semibold text-grey/400 mb-1"
              />
              <input
                type="text"
                className="py-2 px-3 rounded-[8px] border w-full border-grey-300"
                style={{
                  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                }}
                onChange={(e) => onChange(e, index)}
                placeholder="Enter your answer"
              />
            </div>
          );
        })}
      </div>
      <div
        id="actions"
        className="w-full flex items-end gap-4 justify-end mt-auto pb-6 pr-6"
      >
        <button
          type="button"
          onClick={() => {
            setLeaveSheetOpen(false);
          }}
          className="px-5 py-3 border border-error-400 rounded-[8px]"
        >
          <Typography
            text="Discard"
            variant="paragraph2"
            className="font-semibold text-error-600"
          />
        </button>
        <button
          type="button"
          onClick={onAddUpdate}
          className="px-5 py-3 border rounded-[8px] bg-secondary-400-main flex items-center gap-[6px] text-secondary-200"
        >
          <Typography
            text="Add Update"
            variant="paragraph2"
            className="font-semibold text-secondary-100"
          />
          <ArrowRight size={20} />
        </button>
      </div>
    </SheetContent>
  );
};

export default UpdateForm;
