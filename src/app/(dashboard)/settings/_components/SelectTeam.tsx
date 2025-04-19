import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import React, { Dispatch, SetStateAction, useRef } from "react";
import Typography from "../../_components/Typography";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import useTeamStore from "@/store/team";

export const addTeamName = (name: string, add: string) => {
  return name != "" ? name + ", " + add : add;
};

export const removeTeamName = (name: string, remove: string) => {
  return name
    .split(", ")
    .filter((name) => name != remove)
    .join(", ");
};

const SelectTeam = ({
  team: selectedTeam,
  setTeam,
}: {
  team: string;
  setTeam: Dispatch<SetStateAction<string | null>>;
}) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const { teams } = useTeamStore();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const body = selectedTeam ? JSON.parse(selectedTeam) : { text: "", id: [] };

    const targetValue = (e.target as HTMLElement).getAttribute("data-value");

    if (!targetValue) return;

    if (targetValue == "all") return setTeam(null);

    const team = teams?.find((team) => team.id === targetValue);

    if (!team) return;

    let update;
    if (body.id.includes(team.id)) {
      // Remove the team from the selection
      update = JSON.stringify({
        text: removeTeamName(body.text, team.name),
        id: body.id.filter((id: string) => id !== team.id),
      });
    } else {
      // Add the team to the selection
      update = JSON.stringify({
        text: addTeamName(body.text, team.name),
        id: [...body.id, team.id],
      });
    }

    setTeam(update); // Update the state with the new value
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        ref={triggerRef}
        className={cn(
          "py-[10px] px-[14px] rounded-[8px] border border-grey-300 flex justify-between w-full focus:outline-none",
          selectedTeam ? "text-grey/500" : "text-grey/400"
        )}
      >
        <Typography
          text={
            !selectedTeam
              ? "All team"
              : JSON.parse(selectedTeam).text || "All team"
          }
          variant="paragraph2"
        />{" "}
        <ChevronDown color="#667085" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={handleClick}
        className="w-full min-w-full max-h-[30vh] overflow-y-auto no-scrollbar"
        style={{
          width: `${triggerRef.current?.offsetWidth}px`,
        }}
      >
        <CustomItem
          text="Everyone at zazzy"
          value="all"
          key={"all"}
          seletedTeam={selectedTeam}
          border={true}
        />
        {teams
          ?.sort((a, b) => a.name.localeCompare(b.name))
          .map((team) => {
            return (
              <CustomItem
                key={team.id}
                text={team.name}
                seletedTeam={selectedTeam}
                value={team.id}
              />
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const CustomItem = ({
  seletedTeam,
  value,
  text,
  border,
}: {
  seletedTeam: string;
  value: string;
  text: string;
  border?: boolean;
}) => {
  return (
    <DropdownMenuItem
      data-value={value}
      key={value}
      className="flex items-center w-full px-2 relative"
    >
      <Checkbox
        checked={
          seletedTeam
            ? JSON.parse(seletedTeam)?.text
              ? JSON.parse(seletedTeam).id.includes(value)
                ? true
                : false
              : true
            : true
        }
        className="pointer-events-none"
      />
      <Typography
        text={text}
        variant="paragraph2"
        className="text-grey/500 pointer-events-none"
      />
      {border && <hr className="absolute w-screen bottom-0 -left-2" />}
    </DropdownMenuItem>
  );
};

export default SelectTeam;
