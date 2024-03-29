import PostForm from "@/components/forms/PostForm";
import { useGetPostByID } from "@/lib/react-query/queriesAndMutation";
import Loader from "@/components/shared/Loader";

import { useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  const { data: singlePostData, isLoading } = useGetPostByID(id);
  if (isLoading) {
    return (
      <div className="w-full h-full flex-center">
        <Loader />
      </div>
    );
  }
  return (
    <div className="flex  flex-1 flex-col gap-10 items-center overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
      <div className="w-full  flex-start gap-3  max-w-5xl ">
        {" "}
        <img src="/icons/add-post.svg" width={36} height={36} alt="add" />
        <h2 className="w-full text-left h3-bold md:h2-bold ">Edit Post</h2>
      </div>
      <PostForm action="update" post={singlePostData} />
    </div>
  );
};

export default EditPost;
