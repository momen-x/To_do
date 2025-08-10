"use server";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteTask = async (id: number) => {
  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new Error("This task is not Exist");
    }
    await prisma.task.delete({ where: { id} });
        revalidatePath("/");
        revalidatePath(`/task/details/${id}`);
  } catch (error) {
    return notFound();
  }
};
