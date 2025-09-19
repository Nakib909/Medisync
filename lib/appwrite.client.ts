import { Client, Account, Databases, Users } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const users = new Users(client);