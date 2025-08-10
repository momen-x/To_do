"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function EditTaskData(
  title: string,
  description: string,
  id: number
) {
  try {
    // Validate inputs
    if (!title?.trim()) {
      throw new Error("Title is required");
    }
    if (!description?.trim()) {
      throw new Error("Description is required");
    }
    if (!id || id <= 0) {
      throw new Error("Valid task ID is required");
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({ 
      where: { id },
      select: { id: true } // Only select id for existence check
    });
    
    if (!existingTask) {
      throw new Error("Task not found");
    }

    // Update the task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description.trim(),
        updatedAt: new Date(), // Explicitly set updated timestamp
      },
    });

    // Revalidate relevant pages
    revalidatePath("/");
    revalidatePath(`/task/details/${id}`);

    return {
      success: true,
      task: updatedTask,
    };
  } catch (error) {
    console.error("EditTaskData error:", error);
    
    // Re-throw with more specific error message
    if (error instanceof Error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }
    throw new Error("Failed to update task: Unknown error occurred");
  }
}