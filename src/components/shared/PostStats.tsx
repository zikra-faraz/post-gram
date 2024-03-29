import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLIkePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutation";
import { Models } from "appwrite";

import React, { useEffect, useState } from "react";

type Postpropstype = {
  post: Models.Document;
  userId: string;
};
const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};

//checkisLiked return true or false
// It will simply return true if the userId is found in the likeList array, and false otherwise.

const PostStats = ({ post, userId }: Postpropstype) => {
  // console.log({ post });

  //userId will be id of loggedin user at that browser
  // console.log({ userId });

  // console.log({ ...post });

  const likesList = post.likes.map((user: Models.Document) => user.$id);

  console.log(likesList);

  //likesList is an new array which is created by map
  const [likes, setLikes] = useState<string[]>(likesList);
  // console.log(likes);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLIkePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavePost } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();
  // console.log(currentUser);
  // const data = authService.getCurrentUser();
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

  // const { user } = useAuthContext();
  // console.log(user);

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }
    setLikes(likesArray);
    likePost({ postId: post.$id, likesArray });
  };
  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    // console.log(savedPostRecord);

    if (savedPostRecord) {
      setIsSaved(false);
      return deleteSavePost(savedPostRecord.$id);
    }
    savePost({
      userId: userId,
      postId: post.$id,
    });
    setIsSaved(true);
  };

  return (
    <>
      <div className={`flex justify-between items-center z-20 `}>
        <div className="flex gap-2 mr-5">
          <img
            src={`${
              checkIsLiked(likesList, userId)
                ? "/icons/liked.svg"
                : "/icons/like.svg"
            }`}
            alt="like"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={handleLikePost}
          />
          <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>

        <div className="flex gap-2">
          <img
            src={isSaved ? "/icons/saved.svg" : "/icons/save.svg"}
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={handleSavePost}
          />
        </div>
      </div>
    </>
  );
};

export default PostStats;
