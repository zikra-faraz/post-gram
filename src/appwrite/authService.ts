import { Client, Account, ID, Avatars, Databases, Query } from "appwrite";
import { appwriteConfig } from "./conf";
import { INewUser } from "@/types";

export class AuthService {
  client = new Client();
  avatars;
  databases;

  account: any;
  constructor() {
    this.client
      .setEndpoint(appwriteConfig.url)
      .setProject(appwriteConfig.projectId);
    this.account = new Account(this.client);
    this.avatars = new Avatars(this.client);
    this.databases = new Databases(this.client);
  }

  async createUserAccount(user: INewUser) {
    try {
      const newAccount = await this.account.create(
        ID.unique(),
        user.email,
        user.password,
        user.name
      );
      if (!newAccount) throw Error;
      const avatarUrl = this.avatars.getInitials(user.name);
      const newUser = await this.saveUserToDB({
        accountId: newAccount.$id,
        email: newAccount.email,
        name: newAccount.name,
        username: user.username,
        imageUrl: avatarUrl,
      });
      return newUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
  }) {
    try {
      const newUser = await this.databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        user
      );
      return newUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async signInAccount(user: { email: string; password: string }) {
    try {
      const session = await this.account.createEmailSession(
        user.email,
        user.password
      );
      console.log(session);
      return session;
    } catch (error) {
      console.log("sessionn while  login is not created", error);
    }
  }

  async getAccount() {
    try {
      const currentAccount = await this.account.get();
      // console.log(currentAccount);

      return currentAccount;
    } catch (error) {
      console.log(error);
    }
  }

  async getCurrentUser() {
    try {
      const currentAccount = await this.getAccount();
      if (!currentAccount) throw Error;
      const currentUser = await this.databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );

      if (!currentAccount) throw Error;
      // console.log(currentUser);

      return currentUser.documents[0];
    } catch (error) {
      console.log("Appwrite service :: getCurrentAccount :: error", error);
      return null;
    }
  }

  // ============================== SIGN OUT
  async signOutAccount() {
    try {
      const session = await this.account.deleteSession("current");

      return session;
    } catch (error) {
      console.log(error);
    }
  }
}

const authService = new AuthService();
export default authService;
