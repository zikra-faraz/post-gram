import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PostValidation } from "@/lib/validation";
import FileUploader from "../shared/FileUploader";
import { Controller } from "react-hook-form";
import { Models } from "appwrite";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutation";
import Loader from "../shared/Loader";

type postFormPropsType = {
  post?: Models.Document;
  action: "create" | "update";
};
const PostForm = ({ post, action }: postFormPropsType) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  // console.log(user);

  //Query
  const { mutateAsync: createPost, isPending: loadCreate } = useCreatePost();

  const { mutateAsync: updatePost, isPending: loadUpdate } = useUpdatePost();

  // console.log({ ...user });

  type postSchema = z.infer<typeof PostValidation>;
  const {
    handleSubmit,
    register,

    control,
    formState: { errors, isSubmitting },
  } = useForm<postSchema>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });
  async function onSubmit(values: postSchema) {
    //updating data

    if (post && action === "update") {
      const updateData = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post.imageId,
        imageUrl: post.imageUrl,
      });

      if (!updateData) {
        toast({
          title: `${action} post failed. Please try again.`,
        });
      }
      return navigate(`/posts/${post.$id}`);
    }

    //creating data
    const newPost = createPost({ ...values, userId: user.id });
    console.log(newPost);

    if (!newPost) {
      toast({
        title: `post failed`,
      });
    }
    navigate("/");
  }
  return (
    <>
      <form
        className="flex gap-9 w-full max-w-5xl flex-col"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="text-white flex flex-col gap-2 ">
          Caption
          <textarea
            maxLength={2200}
            className="shad-textarea custom-scrollbar"
            {...register("caption")}
          />
          {errors.caption && (
            <div className="text-primary-500">{errors.caption.message}</div>
          )}
        </label>

        <label className="text-white flex flex-col gap-2 ">
          Add photos
          <Controller
            control={control}
            name="file"
            render={({ field: { onChange } }) => (
              <>
                <FileUploader
                  fieldChange={onChange}
                  mediaUrl={post?.imageUrl}
                />
              </>
            )}
          />
          {/* Add Photos <FileUploader fieldChange={(files)=>{setValue('file' , files)}} mediaUrl ={post.imageUrl}/> */}
        </label>

        <label className="text-white flex flex-col gap-2 ">
          Add Location{" "}
          <input
            type="text"
            className="shad-input rounded"
            {...register("location")}
          />
          {errors.location && (
            <div className="text-primary-500">{errors.location.message}</div>
          )}
        </label>

        <label className="text-white  flex flex-col gap-2 ">
          Add Tags (separated by comma " , ")
          <input
            type="text"
            className="shad-input rounded"
            {...register("tags")}
            placeholder="   JS , React , NextJS ...."
          />
          {errors.tags && (
            <div className="text-primary-500">{errors.tags.message}</div>
          )}
        </label>

        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4 ">
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
          >
            {loadCreate || (loadUpdate && <Loader />)}
            {action} post
          </Button>
        </div>
      </form>
    </>
  );
};

export default PostForm;
