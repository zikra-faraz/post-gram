import Grid from "./Grid";
import Loader from "./Loader";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchPosts: any;
};

const SearchResults = ({
  isSearchFetching,
  searchPosts,
}: SearchResultProps) => {
  if (isSearchFetching) {
    return <Loader />;
  }
  return (
    <div>
      <Grid posts={searchPosts?.documents} />
    </div>
  );
};

export default SearchResults;
