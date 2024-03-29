import PostForm from "@/components/forms/PostForm";

const CreatePost = () => {
  return (
    <div className="flex  flex-1 flex-col gap-10 items-center overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
      <div className="w-full  flex-start gap-3  max-w-5xl ">
        {" "}
        <img src="/icons/add-post.svg" width={36} height={36} alt="add" />
        <h2 className="w-full text-left h3-bold md:h2-bold ">Create Post</h2>
      </div>
      <PostForm action="create" />
    </div>
  );
};

export default CreatePost;

// import PostForm from "@/components/forms/PostForm";

// const CreatePost = () => {
//   return (
//     <div className="flex flex-1">
//       <div className="common-container">
//         <div className="max-w-5xl flex-start gap-3 justify-start w-full">
//           <img src="/icons/add-post.svg" width={36} height={36} alt="add" />
//           <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
//         </div>

//         <PostForm />
//       </div>
//     </div>
//   );
// };

// export default CreatePost;
// flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar
