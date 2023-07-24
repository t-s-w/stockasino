import { PropsWithChildren, createContext, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ErrorAlertContext = createContext({} as ContextType);
export default ErrorAlertContext;

interface ContextType {
  errorAlert: (message: string) => void;
}

export function ErrorAlertProvider({ children }: PropsWithChildren) {
  const [error, setError] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const contextData = { errorAlert };

  function errorAlert(message: string) {
    setError(message);
    setShowErrorAlert(true);
  }

  return (
    <ErrorAlertContext.Provider value={contextData}>
      {children}
      <ToastContainer position="bottom-end" className="p-3 z-1">
        <Toast
          onClose={() => setShowErrorAlert(false)}
          show={showErrorAlert}
          delay={3000}
          autohide
        >
          <Toast.Header>Error</Toast.Header>
          <Toast.Body>{error}</Toast.Body>
        </Toast>
      </ToastContainer>
    </ErrorAlertContext.Provider>
  );
}
