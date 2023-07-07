import { prisma } from "./prisma";
import { User } from "@prisma/client";

export async function getUsers(): Promise<User[]> {
  const users = await prisma.user.findMany({ where: { role: "User" } });
  return users;
}

export async function getUser(stuffId: string): Promise<User> {
  const user = await prisma.user.findFirst({ where: { stuffId } });
  return user;
}
