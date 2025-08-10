"use client";
import { MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import { Status } from "@prisma/client";
import { useAlertShowHide } from "@/app/context/AlertContext";
import { editStatus } from "@/utils/EditStatusOnServer";

interface Iprops {
  id: number;
  initialStatus?: Status;
}

const SelectStatus = ({ id, initialStatus = Status.TODO }: Iprops) => {
  const { showAlert } = useAlertShowHide();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: Status) => {
    if (newStatus === status) {
      showAlert("nothing change", "info");
      return;
    }

    setIsLoading(true);
    try {
      await editStatus(newStatus, id);
      setStatus(newStatus);
      showAlert("Status updated successfully", "success");
    } catch (error) {
      console.error("Failed to update status:", error);
      showAlert("Something went wrong, please try again", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Select
        labelId={`status-select-${id}`}
        id={`status-select-${id}`}
        value={status}
        onChange={(e) => {
          const newStatus = e.target.value as Status;
          handleStatusChange(newStatus);
        }}
        label="Status"
        disabled={isLoading}
        sx={{
          bgcolor:
            status === "TODO"
              ? "#2979ff"
              : status === "IN_PROGRESS"
              ? "#ffc400"
              : "#4caf50",
          color: "white", // Better contrast for colored backgrounds
          "& .MuiSelect-icon": {
            color: "white",
          },
        }}
      >
        <MenuItem value={Status.TODO}>TODO</MenuItem>
        <MenuItem value={Status.IN_PROGRESS}>IN_PROGRESS</MenuItem>
        <MenuItem value={Status.COMPLETED}>COMPLETED</MenuItem>
      </Select>
    </div>
  );
};

export default SelectStatus;
