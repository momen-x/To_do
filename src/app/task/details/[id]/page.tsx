import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { Status } from "@prisma/client";
import {
  Box,
  Container,
  Chip,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Stack,
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  AccessTime,
  Update,
  CheckCircle,
  RadioButtonUnchecked,
  Schedule,
} from "@mui/icons-material";
import EditDeleteButton from "@/app/components/editAndDeleteButton/editDeleteButton";
import SelectStatus from "@/app/components/Select/SelectStatus";
import Link from "next/link";

interface ITaskInfo {
  description: string;
  status: Status;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
  id: number;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const statusConfig = {
  [Status.TODO]: {
    color: "#ff9800" as const,
    backgroundColor: "#fff3e0",
    icon: <RadioButtonUnchecked />,
    label: "To Do",
  },
  [Status.IN_PROGRESS]: {
    color: "#2196f3" as const,
    backgroundColor: "#e3f2fd",
    icon: <Schedule />,
    label: "In Progress",
  },
  [Status.COMPLETED]: {
    color: "#4caf50" as const,
    backgroundColor: "#e8f5e8",
    icon: <CheckCircle />,
    label: "Completed",
  },
} as const;

const DetailsPage = async ({ params }: PageProps) => {
  let task: ITaskInfo | null = null;
  let id = 0;

  try {
    const resolvedParams = await params;
    id = Number(resolvedParams.id);
    if (isNaN(id)) return notFound();

    task = await prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!task) return notFound();
  } catch (error) {
    return notFound();
  }

  const statusInfo = statusConfig[task.status];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with Back Button */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Tooltip title="Go back">
          <IconButton
            component={Link}
            href="/"
            sx={{
              backgroundColor: "background.paper",
              boxShadow: 1,
              "&:hover": { boxShadow: 2 },
            }}
          >
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Typography variant="h5" color="white">
          Task Details
        </Typography>
      </Box>

      {/* Main Content */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${statusInfo.color}15 0%, ${statusInfo.color}05 100%)`,
            borderBottom: "1px solid",
            borderColor: "divider",
            p: 4,
          }}
        >
          <Stack spacing={3}>
            {/* Title and Status */}
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.2,
                    mb: 2,
                    color: "text.primary",
                  }}
                >
                  {task.title}
                </Typography>
                <Chip
                  icon={statusInfo.icon}
                  label={statusInfo.label}
                  sx={{
                    backgroundColor: statusInfo.backgroundColor,
                    color: statusInfo.color,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    "& .MuiChip-icon": {
                      color: statusInfo.color,
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <SelectStatus id={id} initialStatus={task.status} />
              <EditDeleteButton task={task} />
            </Box>
          </Stack>
        </Box>

        {/* Content Section */}
        <Box sx={{ p: 4 }}>
          <Stack spacing={4}>
            {/* Description */}
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}
                >
                  Description
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.7,
                    color: "text.secondary",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {task.description || "No description provided."}
                </Typography>
              </CardContent>
            </Card>

            {/* Metadata */}
            {(task.createdAt || task.updatedAt) && (
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ mb: 3, color: "text.primary", fontWeight: 600 }}
                  >
                    Timeline
                  </Typography>
                  <Stack spacing={3}>
                    {task.createdAt && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: "primary.main",
                            color: "primary.contrastText",
                          }}
                        >
                          <AccessTime fontSize="small" />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Created
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {new Date(task.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {task.updatedAt && task.createdAt !== task.updatedAt && (
                      <>
                        <Divider />
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 1,
                              backgroundColor: "secondary.main",
                              color: "secondary.contrastText",
                            }}
                          >
                            <Update fontSize="small" />
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Last Updated
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {new Date(task.updatedAt).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default DetailsPage;
