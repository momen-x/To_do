"use client";
import { useAlertShowHide } from "@/app/context/AlertContext";
import { addTask } from "@/utils/AddTaskOnServer";
import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";

const InputAddTask = () => {
  const { showAlert } = useAlertShowHide();

  const createTask = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    if (!title || !description || !title.trim() || !description.trim()) {
      //   console.log("required");
      showAlert("All field is required", "error");
      return;
    }
    await addTask({ title, description });
    showAlert("add successfully", "success");
  };
  return (
    <div>
      <Box
        component="form"
        action={createTask}
        className="flex flex-col gap-4"
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Add New Task
        </Typography>

        <TextField
          id="title"
          label="Task Title"
          variant="outlined"
          name="title"
          fullWidth
          required
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
          id="description"
          label="Task Description"
          multiline
          rows={4}
          variant="outlined"
          name="description"
          fullWidth
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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            alignSelf: "flex-end",
            px: 4,
            py: 1.5,
            fontWeight: "bold",
          }}
        >
          Add Task
        </Button>
      </Box>
    </div>
  );
};

export default InputAddTask;
