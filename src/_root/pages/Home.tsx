import dbService from "@/appwrite/dbService";
import { Models } from "appwrite";
import Loader from "@/components/shared/Loader";
import { useEffect, useState } from "react";
import PostCard from "@/components/shared/PostCard";
import { useGetRecentPost } from "@/lib/react-query/queriesAndMutation";
type PostType = {
  documents: Models.Document[];
};
// documents: Models.Document[]: Inside PostType, we have a property called documents. This property is expected to hold an array of objects of type Models.Document.
const Home = () => {
  const { data: posts, isLoading: loading } = useGetRecentPost();
  // const [loading, setLoading] = useState(false);
  // const [posts, setPosts] = useState<PostType>({ documents: [] });
  // const data = dbService.getRecentPost();
  // useEffect(() => {
  //   setLoading(true);
  //   dbService
  //     .getRecentPost()
  //     .then((post) => {
  //       if (post) {
  //         // console.log(post);
  //         const data = post.documents;
  //         // console.log(data);
  //         //now posts is an object with documents as a key and data as a value
  //         setPosts({ documents: data });
  //         setLoading(false);
  //         // console.log(posts);
  //       }
  //     })
  //     .catch((err) => console.log("error while get all posts", err))
  //     .finally(() => setLoading(false));
  // }, []);
  return (
    <>
      <div className="flex flex-1">
        <div className="home-container">
          <div className="home-posts">
            <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
            {loading && !posts ? (
              <Loader />
            ) : (
              <>
                <ul className="flex flex-col flex-1 gap-9 w-full">
                  {posts?.documents.map((post: Models.Document) => (
                    <li key={post.$id} className="flex justify-center w-full">
                      <PostCard post={post} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
