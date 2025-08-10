"use client";
import { createContext, useContext, useState, useCallback } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress, Box } from "@mui/material";
import { EditTaskData } from "@/utils/EditTaskData";
import { useAlertShowHide } from "./AlertContext";

interface TaskData {
  title: string;
  description: string;
}

interface EditTaskDialogContextType {
  open: boolean;
  openDialog: (id: number, taskData: TaskData) => void;
  closeDialog: () => void;
}

// Create and export the context
export const EditTaskDialogContext = createContext<EditTaskDialogContextType>({
  open: false,
  openDialog: () => {},
  closeDialog: () => {},
});

// Custom hook to use the context
export const useEditTaskDialog = () => {
  const context = useContext(EditTaskDialogContext);
  if (!context) {
    throw new Error(
      "useEditTaskDialog must be used within EditTaskDialogProvider"
    );
  }
  return context;
};

export default function EditTaskDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showAlert } = useAlertShowHide();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const [taskData, setTaskData] = useState<TaskData>({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<TaskData>>({});

  // Open dialog with task data
  const openDialog = useCallback((taskId: number, data: TaskData) => {
    setId(taskId);
    setTaskData(data);
    setErrors({});
    setOpen(true);
  }, []);

  // Close dialog and reset state
  const closeDialog = useCallback(() => {
    setOpen(false);
    setTaskData({ title: "", description: "" });
    setErrors({});
    setId(0);
  }, []);

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<TaskData> = {};

    if (!taskData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (taskData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!taskData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (taskData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await EditTaskData(
        taskData.title,
        taskData.description,
        id
      );

      if (result.success) {
        showAlert("Task updated successfully", "success");
        closeDialog();
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update task";
      showAlert(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange =
    (field: keyof TaskData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setTaskData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  const contextValue: EditTaskDialogContextType = {
    open,
    openDialog,
    closeDialog,
  };

  return (
    <React.Fragment>
      <EditTaskDialogContext.Provider value={contextValue}>
        {children}

        <Dialog
          open={open}
          onClose={closeDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Edit Task</DialogTitle>

          <form onSubmit={handleSubmit} id="edit-task-form">
            <DialogContent>
              <DialogContentText sx={{ mb: 3 }}>
                Update your task information below.
              </DialogContentText>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Task Title"
                  variant="outlined"
                  fullWidth
                  required
                  value={taskData.title}
                  onChange={handleInputChange("title")}
                  error={!!errors.title}
                  helperText={errors.title}
                  disabled={isLoading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "primary.main",
                      },
                      "&:hover fieldset": {
                        borderColor: "primary.dark",
                      },
                    },
                  }}
                />

                <TextField
                  label="Task Description"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  required
                  value={taskData.description}
                  onChange={handleInputChange("description")}
                  error={!!errors.description}
                  helperText={errors.description}
                  disabled={isLoading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "primary.main",
                      },
                      "&:hover fieldset": {
                        borderColor: "primary.dark",
                      },
                    },
                  }}
                />
              </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={closeDialog}
                disabled={isLoading}
                color="inherit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="edit-task-form"
                variant="contained"
                disabled={isLoading}
                sx={{ minWidth: 120 }}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </EditTaskDialogContext.Provider>
    </React.Fragment>
  );
}
