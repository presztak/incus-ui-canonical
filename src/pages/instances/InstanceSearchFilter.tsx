import { FC, memo, useState } from "react";
import { SearchBox } from "@canonical/react-components";
import { useSearchParams } from "react-router-dom";

interface Props {
  onSearch: (filter: string) => void;
}

const InstanceSearchFilter: FC<Props> = ({ onSearch }) => {
  const [searchParams] = useSearchParams();
  const filterQuery =
    searchParams.get("filter") != null ? searchParams.get("filter") : "";

  const [query, setQuery] = useState<string>(
    decodeURIComponent(filterQuery || ""),
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(query);
    }
  };

  const onInputChange = (input: string) => {
    if (input === "" && query != "") {
      onSearch("");
    }
    setQuery(input);
  };

  return (
    <>
      <h2 className="u-off-screen">Search and filter</h2>
      <SearchBox
        className="search-box margin-right u-no-margin--bottom"
        name="search-instance"
        type="text"
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search"
        value={query}
        aria-label="Search"
      />
    </>
  );
};

export default memo(InstanceSearchFilter);
