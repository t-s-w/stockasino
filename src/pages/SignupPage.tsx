import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthContext from "../auth/AuthContext";
import { useContext, useState } from "react";
import { ModelError } from "../utils/types";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);
  const [successMsg, setSuccessMsg] = useState(null as null | string);

  const signupSchema = Yup.object({
    username: Yup.string()
      .required("Required")
      .max(20, "Username must be between 4 and 20 characters long")
      .min(4, "Username must be between 4 and 20 characters long")
      .matches(
        /\w+/g,
        "Username must contain only alphanumerics or underscores."
      )
      .trim(),
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Required"),
    password: Yup.string()
      .min(8, "Password must be between 8 and 24 characters long.")
      .max(24, "Password must be between 8 and 24 characters long."),
    confirmPassword: Yup.string().test(
      "passwords-match",
      "Passwords must match",
      function (value) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return !value || this.parent.password === value;
      }
    ),
  });

  return (
    <div className="w-50 mx-auto">
      <h1 className="my-5">Sign up</h1>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={signupSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            await signup({
              username: values.username,
              password: values.password,
              email: values.email,
            });
            setSuccessMsg(
              "Signed up successfully! Returning you to the home page soon..."
            );
            setTimeout(() => navigate("/"), 2000);
          } catch (err) {
            if (err instanceof ModelError) {
              setErrors(err.body);
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          touched,
          handleSubmit,
          handleChange,
          handleBlur,
          isSubmitting,
          isValid,
        }) => (
          <Form noValidate onSubmit={handleSubmit} className="mx-auto ">
            <fieldset disabled={isSubmitting}>
              <div className="row g-2 input-group has-validation">
                <div className="col-md">
                  <FloatingLabel controlId="username" label="Username">
                    <Form.Control
                      placeholder="Username"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.username
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      type="text"
                    />
                  </FloatingLabel>
                </div>
                <div className="col-md ml-3 my-auto invalid-feedback d-block">
                  <ErrorMessage name="username" />
                </div>
              </div>

              <div className="row g-2 input-group has-validation">
                <div className="col-md">
                  <FloatingLabel controlId="email" label="Email address">
                    <Form.Control
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Email"
                      className={
                        errors.email
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      type="email"
                    />
                  </FloatingLabel>
                </div>
                <div className="col-md ml-3 my-auto invalid-feedback d-block">
                  <ErrorMessage name="email" />
                </div>
              </div>

              <div className="row g-2 input-group has-validation">
                <div className="col-md">
                  <FloatingLabel controlId="password" label="Password">
                    <Form.Control
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder=""
                      className={
                        errors.password
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      type="password"
                    />
                  </FloatingLabel>
                </div>
                <div className="col-md ml-3 my-auto invalid-feedback d-block">
                  <ErrorMessage name="password" />
                </div>
              </div>

              <div className="row g-2 input-group has-validation">
                <div className="col-md">
                  <FloatingLabel
                    controlId="confirmPassword"
                    label="Confirm Password"
                  >
                    <Form.Control
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder=""
                      className={
                        errors.confirmPassword
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      type="password"
                    />
                  </FloatingLabel>
                </div>
                <div className="col-md ml-3 my-auto invalid-feedback d-block">
                  <ErrorMessage name="confirmPassword" />
                </div>
              </div>

              <button
                type="submit"
                className="mt-3 btn btn-primary"
                disabled={isSubmitting || !isValid}
              >
                Submit
              </button>
            </fieldset>
          </Form>
        )}
      </Formik>
      <p style={{ color: "var(--bs-success)" }}>{successMsg}</p>
    </div>
  );
}
