"use server";

import { prisma } from "@/app/lib/prisma";
import { Status } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const editStatus = async (value: Status, id: number) => {
  try {
    const task = await prisma.task.findUnique({ where: { id } });
    
    if (!task) {
      throw new Error("Task does not exist");
    }

    await prisma.task.update({
      where: { id },
      data: {
        status: value,
      },
    });

    revalidatePath("/");
    revalidatePath(`/task/details/${id}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating task status:", error);
    throw new Error("Failed to update task status");
  }
};