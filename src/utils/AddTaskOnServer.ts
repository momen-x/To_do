"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface IParam {
  title: string;
  description: string;
}
export async function addTask({ title, description }: IParam) {
  if (!title || !description||!title.trim()||!description.trim()) {
    return;
  }
  await prisma.task.create({
    data: {
      title: title,
      description: description,
    },
  });
      revalidatePath("/");

}
