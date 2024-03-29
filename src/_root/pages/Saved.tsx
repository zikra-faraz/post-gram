import Grid from "@/components/shared/Grid";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutation";
import { Models } from "appwrite";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();

  // if i check inn posts the save array has user property and its details
  // if i check in user data the save array has posts and its details
  //   const { data: posts } = useGetRecentPost();
  //   console.log(currentUser);
  //   console.log(posts);

  //   const saveUserPosts = posts?.save.map((s)=>
  //   console.log(s)
  //   )
  //   console.log(data);

  const savePosts = currentUser?.save
    .map((savePost: Models.Document) => ({
      ...savePost.post,

      creator: {
        imageUrl: currentUser.imageUrl,
      },
      // console.log(savePost);
    }))
    .reverse();
  //   const savePostsUsers = currentUser?.save.map((savePost: Models.Document) =>
  //     console.log(savePost)
  //   );
  //   console.log(savePostsUsers);

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!currentUser ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <Grid posts={savePosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
