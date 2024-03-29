import { useLIkePost, useSavePost } from "@/lib/react-query/queriesAndMutation";
import { Models } from "appwrite";
import React, { useState } from "react";

type propsType = {
  post: Models.Document;
  userId: string;
};

const Postlikeandsave = ({ post, userId }: propsType) => {
  const likesList = post.likes.map((user: Models.Document) => user.$id);
  const [likes, setLikes] = useState<string[]>(likesList);
  // const [saved, setSaved] = useState(false);

  const { mutate: likePost, isPending } = useLIkePost();

  const handleLike = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();

    //  const likeArray = [...likes]
    let likeArray = [...likes];
    setLikes(likeArray);
    likePost({ postId: post.$id, likesArray: likeArray });
  };
  // const {} = useSavePost()
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <img src="/icons/like.svg" onClick={handleLike} alt="" />
        <p>{likes.length}</p>
      </div>
      <img src="/icons/save.svg" alt="save" />
    </div>
  );
};

export default Postlikeandsave;
