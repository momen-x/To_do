"use client";
import { useAlertShowHide } from "@/app/context/AlertContext";
import { useEditTaskDialog } from "@/app/context/OpenEditTaskDialog";
import { deleteTask } from "@/utils/DeleteTaskOnServer";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Status } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface ITaskInfo {
  description: string;
  status: Status;
  title: string;
  id: number;
}

interface EditDeleteButtonProps {
  task: ITaskInfo;
}

const EditDeleteButton = ({ task }: EditDeleteButtonProps) => {
  const { openDialog } = useEditTaskDialog();
  const router = useRouter();
  const { showAlert } = useAlertShowHide();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTask = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task? This action cannot be undone."
    );
    
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteTask(task.id); // Added await
      showAlert("Task deleted successfully", "success");
      router.replace("/");
    } catch (error) {
      console.error("Delete error:", error);
      showAlert("Something went wrong, please try again later", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditTask = () => {
    // Fixed syntax: pass object with title and description properties
    openDialog(task.id, { 
      title: task.title, 
      description: task.description 
    });
  };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Tooltip title="Edit task">
        <Button
          variant="contained"
          color="primary"
          startIcon={<Edit />}
          onClick={handleEditTask}
          size="medium"
        >
          Edit
        </Button>
      </Tooltip>
      
      <Tooltip title="Delete task">
        <Button
          variant="contained"
          color="error"
          startIcon={<Delete />}
          onClick={handleDeleteTask}
          disabled={isDeleting}
          size="medium"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </Tooltip>
    </Box>
  );
};

export default EditDeleteButton;