import { Client, Databases, ID, Storage, Query, Account } from "appwrite";
import { appwriteConfig } from "./conf";
import { INewPost, IUpdatePost } from "@/types";

export class Service {
  client = new Client();
  databases;
  account;
  storage;

  constructor() {
    this.client
      .setEndpoint(appwriteConfig.url)
      .setProject(appwriteConfig.projectId);
    this.databases = new Databases(this.client);
    this.account = new Account(this.client);
    this.storage = new Storage(this.client);
  }

  async CreatePost(post: INewPost) {
    try {
      // Upload file to appwrite storage
      const uploadedFile = await this.uploadFile(post.file[0]);
      console.log(uploadedFile?.$id);
      if (!uploadedFile) throw Error;

      const fileData = this.storage.getFile(
        appwriteConfig.storageId,
        uploadedFile.$id
      );

      if (fileData) {
        console.log(fileData);
      }

      const fileUrl = await this.getFilePreview(uploadedFile.$id);
      console.log(fileUrl);

      if (!fileUrl) {
        await this.deleteFile(uploadedFile.$id);
        throw Error;
      }

      const tags = post.tags?.replace(/ /g, "").split(",") || [];

      //creating new post in  database

      const newPost = await this.databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        ID.unique(),
        {
          creator: post.userId,
          caption: post.caption,
          imageUrl: fileUrl,
          imageId: uploadedFile.$id,
          location: post.location,
          tags: tags,
        }
      );

      if (!newPost) {
        await this.deleteFile(uploadedFile.$id);
        throw Error;
      }

      return newPost;
    } catch (error) {
      console.log("Error while creating POST", error);
    }
  }

  async uploadFile(file: File) {
    try {
      const uploadedFile = await this.storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
      );

      return uploadedFile;
    } catch (error) {
      console.log("error while uploading file", error);
    }
  }

  // ============================== GET FILE URL
  async getFilePreview(fileId: string) {
    try {
      const fileUrl = this.storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );

      if (!fileUrl) throw Error;

      return fileUrl;
    } catch (error) {
      console.log("error whille gett file previeww", error);
    }
  }

  // ============================== DELETE FILE
  async deleteFile(fileId: string) {
    try {
      await this.storage.deleteFile(appwriteConfig.storageId, fileId);

      return { status: "ok" };
    } catch (error) {
      console.log("Error while deleting File", error);
    }
  }
  async getAccount() {
    try {
      const currentAccount = await this.account.get();
      console.log(currentAccount);

      return currentAccount;
    } catch (error) {
      console.log(error);
    }
  }
  // =========================== getCurrentPost
  async getRecentPost() {
    try {
      const postData = await this.databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc("$createdAt")]
        // [Query.orderDesc("caption")]
      );
      // console.log(postData);

      return postData;
    } catch (error) {
      console.log("Error while fetching post", error);
      throw Error;
    }
  }

  async getPostByID(postId?: string) {
    if (!postId) throw Error;
    try {
      const singlePostData = await this.databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId
      );
      if (!singlePostData) throw Error;
      return singlePostData;
    } catch (error) {
      console.log("error while getting single post data", error);
      throw Error;
    }
  }

  async updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;

    try {
      let image = {
        imageUrl: post.imageUrl,
        imageId: post.imageId,
      };

      if (hasFileToUpdate) {
        // Upload new file to appwrite storage
        const uploadedFile = await this.uploadFile(post.file[0]);
        if (!uploadedFile) throw Error;

        // Get new file url
        const fileUrl = await this.getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
          await this.deleteFile(uploadedFile.$id);
          throw Error;
        }
        image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
      }
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];

      const updatedPost = await this.databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        post.postId,
        {
          caption: post.caption,
          imageUrl: image.imageUrl,
          imageId: image.imageId,
          location: post.location,
          tags: tags,
        }
      );
      // Failed to update
      if (!updatedPost) {
        // Delete new file that has been recently uploaded
        if (hasFileToUpdate) {
          await this.deleteFile(image.imageId);
        }

        // If no new file uploaded, just throw error
        throw Error;
      }
      if (hasFileToUpdate) {
        await this.deleteFile(post.imageId);
      }
      return updatedPost;
    } catch (error) {
      console.log("updating post error", error);
      throw Error;
    }
  }

  async DeletePost(postId?: string, imageId?: string) {
    if (!postId || !imageId) return;
    try {
      const status = await this.databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId
      );
      if (!status) throw Error;
      await this.deleteFile(imageId);
      return { status: "ok deleted" };
    } catch (error) {
      console.log("Deleting post error", error);
      throw Error;
    }
  }

  async getUserPosts(userId?: string) {
    if (!userId) return;

    try {
      const post = await this.databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
      );

      if (!post) throw Error;
      return post;
    } catch (error) {
      console.log("error while getting posts of specific user", error);
    }
  }

  async likePost(postId: string, likesArray: string[]) {
    try {
      const updatedPost = await this.databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId,
        {
          likes: likesArray,
        }
      );

      if (!updatedPost) throw Error;

      return updatedPost;
    } catch (error) {
      console.log(error);
    }
  }

  // ============================== SAVE POST
  async savePost(userId: string, postId: string) {
    try {
      const updatedPost = await this.databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        ID.unique(),
        {
          user: userId,
          post: postId,
        }
      );

      if (!updatedPost) throw Error;

      return updatedPost;
    } catch (error) {
      console.log(error);
    }
  }

  // ============================== DELETE SAVED POST
  async deleteSavedPost(savedRecordId: string) {
    try {
      const statusCode = await this.databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        savedRecordId
      );

      if (!statusCode) throw Error;

      return { status: "Ok" };
    } catch (error) {
      console.log(error);
    }
  }

  async searchPosts(searchTerm: string) {
    try {
      const posts = await this.databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.search("caption", searchTerm)]
      );

      if (!posts) throw Error;

      return posts;
    } catch (error) {
      console.log("error while getting search results", error);
    }
  }
}
const dbService = new Service();
export default dbService;
