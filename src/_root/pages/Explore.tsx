import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import { useSearchPost } from "@/lib/react-query/queriesAndMutation";
import React, { useState } from "react";

const Explore = () => {
  const [searchValue, setSearchValue] = useState("");

  const { data: searchPosts, isFetching: isSearchFetching } =
    useSearchPost(searchValue);

  console.log(searchPosts);

  return (
    <div className="flex flex-col flex-1 items-center overflow-scroll py-10 px-5 md:p-14 custom-scrollbar">
      <div className="max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9">
        {" "}
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img src="/icons/search.svg" width={24} height={24} alt="search" />
          <Input
            type="text"
            placeholder="Search"
            className="h-12 bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-0 focus-visible:ring-offset-0 ring-offset-0"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div>
          {searchPosts ? (
            <SearchResults
              isSearchFetching={isSearchFetching}
              searchPosts={searchPosts}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
