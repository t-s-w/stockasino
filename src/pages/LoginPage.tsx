import Login from "../components/Login";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../auth/AuthContext";
import { LoginError } from "../utils/types";
import { Form, Col, Alert } from "react-bootstrap";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [buttonText, setButtonText] = useState("Log in");
  const [buttonClass, setButtonClass] = useState("btn-primary");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  return (
    <>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await login(values);
            setButtonClass("btn-success");
            setButtonText("Success!");
            setSuccess(true);
          } catch (err) {
            if (err instanceof LoginError) {
              setErrorMsg(err.message);
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleSubmit, isSubmitting, handleChange }) => (
          <Form onSubmit={handleSubmit}>
            <fieldset disabled={isSubmitting || success}>
              <Col className="d-flex flex-column align-items-center p-2">
                <h1>Not logged in!</h1>
                <p>Log in now to see numbers go up.</p>
                <Form.Control
                  onChange={handleChange}
                  id="username"
                  className="mb-1 w-25"
                  placeholder="Username"
                />
                <Form.Control
                  onChange={handleChange}
                  id="password"
                  type="password"
                  className="w-25"
                  placeholder="Password"
                />
                <button className={"mt-4 btn " + buttonClass} type="submit">
                  {buttonText}
                </button>
                {errorMsg && (
                  <Alert variant="danger" className="mt-2">
                    {errorMsg}
                  </Alert>
                )}
              </Col>
            </fieldset>
          </Form>
        )}
      </Formik>
    </>
  );
}
