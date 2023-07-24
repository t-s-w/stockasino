import { useContext } from "react";
import AuthContext from "../auth/AuthContext";
import { LoginError } from "../utils/types";
import { useNavigate } from "react-router-dom";
import { Col, Form, NavDropdown, Nav, Alert } from "react-bootstrap";
import { Formik } from "formik";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [buttonText, setButtonText] = useState("Log in");
  const [buttonClass, setButtonClass] = useState("btn-primary");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  return (
    <Nav variant="underline">
      <NavDropdown title="Login" drop="down-centered">
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
                  <Form.Control
                    onChange={handleChange}
                    id="username"
                    className="mb-1"
                    placeholder="Username"
                  />
                  <Form.Control
                    onChange={handleChange}
                    id="password"
                    type="password"
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
      </NavDropdown>
      <Nav.Item>
        <Nav.Link onClick={() => navigate("/signup")}>Sign Up</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
