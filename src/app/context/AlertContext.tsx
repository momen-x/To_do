"use client";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import {
  createContext,
  useState,
  useContext,
  useRef,
  ReactNode,
  useCallback,
  useEffect,
} from "react";

type AlertState = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

type AlertContextType = {
  alert: AlertState;
  setAlert: React.Dispatch<React.SetStateAction<AlertState>>;
  showAlert: (message: string, severity?: AlertColor) => void;
};

const AlertShowHideContext = createContext<AlertContextType | undefined>(
  undefined
);

export const AlertShowHideProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    severity: "success",
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize showAlert to prevent useEffect dependencies issues
  const showAlert = useCallback(
    (message: string, severity: AlertColor = "success") => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setAlert({
        open: true,
        message,
        severity,
      });
      timeoutRef.current = setTimeout(() => {
        setAlert((prev) => ({ ...prev, open: false }));
      }, 5000);
    },
    []
  );

  const handleClose = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setAlert((prev) => ({ ...prev, open: false }));
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <AlertShowHideContext.Provider value={{ alert, setAlert, showAlert }}>
      {children}
      <Snackbar
        open={alert.open}
        autoHideDuration={2500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        sx={{
          position: "fixed",
          left: "16px",
          bottom: "16px",
          zIndex: 1400,
        }}
      >
        <Alert
          severity={alert.severity}
          sx={{
            width: "100%",
            maxWidth: "300px",
            boxShadow: "0px 3px 5px rgba(0,0,0,0.2)",
            alignItems: "center",
          }}
          variant="filled"
          onClose={handleClose}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </AlertShowHideContext.Provider>
  );
};

export const useAlertShowHide = (): AlertContextType => {
  const context = useContext(AlertShowHideContext);
  if (context === undefined) {
    throw new Error(
      "useAlertShowHide must be used within a AlertShowHideProvider"
    );
  }
  return context;
};
