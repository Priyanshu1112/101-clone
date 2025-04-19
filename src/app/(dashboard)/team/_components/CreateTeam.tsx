"use client";

import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import Button from "../../_components/Button";
import Typography from "../../_components/Typography";
import { ArrowRight, ImagePlus } from "lucide-react";
import useTeamStore from "@/store/team";
import { toast } from "sonner";
import TeamLogo from "./TeamLogo";

const CreateTeam = ({
  setCreateTeam,
}: {
  setCreateTeam: Dispatch<SetStateAction<boolean>>;
}) => {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const {
    resetStatus,
    createTeam,
    creatingTeam,
    errorCreatingTeam,
    createdTeam,
  } = useTeamStore();

  useEffect(() => {
    let toastId: string | number = "";

    if (creatingTeam) {
      toastId = toast("Creating team...", { duration: Infinity });
    } else if (errorCreatingTeam) {
      toast.error(
        <div>
          <strong>{errorCreatingTeam}</strong>
        </div>
      );
    } else if (createdTeam) {
      toast.success(
        <div>
          <strong>Team created successfully!</strong>
        </div>
      );

      setCreateTeam(false);
      resetStatus();
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId); // Cleanup on unmount
      }
    };
  }, [creatingTeam, errorCreatingTeam, createdTeam, setCreateTeam, resetStatus]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files?.[0];
    if (file && file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => {
        const logoString = reader.result as string; // Base64 representation
        if (logoString) {
          setLogo(logoString);
        }
      };
      reader.readAsDataURL(file); // Start reading the file
    } else {
      toast.error("Please upload a valid SVG file.");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <span className="flex gap-3 items-center">
        {" "}
        <Typography
          variant="paragraph1"
          text="#"
          className="font-bold text-grey/400"
        />
        <Typography
          variant="paragraph1"
          text="Create new team"
          className="font-bold text-grey/400"
        />{" "}
      </span>

      <div className="rounded-[9px] border border-grey-300 p-5 flex justify-between">
        <span className="flex gap-4">
          <span
            onClick={() => {
              inputRef.current?.click();
            }}
            className="inline-block cursor-pointer p-[10px] rounded-[7px] border border-dashed border-grey/350 text-grey/350"
          >
            {logo ? <TeamLogo src={logo} /> : <ImagePlus size={20} />}

            <input
              ref={inputRef}
              type="file"
              accept=".svg"
              onChange={handleFileUpload}
              className="hidden"
            />
          </span>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Enter team name"
            className="focus:border focus:outline-none py-2 px-3 rounded-[8px] border border-grey-300 shadow-xs w-[359px]"
          />
        </span>

        <span className="flex gap-7 items-center">
          <Button
            text={"Cancel"}
            className="border-none shadow-none px-0"
            onClick={() => {
              setCreateTeam(false);
            }}
          />
          <Button
            onClick={() => {
              if (logo && name) createTeam({ name, logo });
              else toast.error("Empty logo or team name!");
            }}
            text={"Create"}
            className="border-secondary-400-main text-gray-700"
            icon={ArrowRight}
          />
        </span>
      </div>
    </div>
  );
};

export default CreateTeam;
