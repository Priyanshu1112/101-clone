import { Search } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

const SearchBar = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div>
      <span
        className={`flex items-center gap-2 px-3 py-2 bg-white border border-secondary-200 rounded-[8px] cursor-pointer `}
        style={{ boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)" }}
      >
        <Search size={16} color={"#667085"} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for team or members"
          className="bg-transparent active:border-none focus:outline-none text-[#667085] w-[441px] placeholder:text-[#667085] "
        />{" "}
      </span>
    </div>
  );
};

export default SearchBar;
