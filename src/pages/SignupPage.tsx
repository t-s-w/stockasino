import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function SignupPage() {
  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={Yup.object({
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
            return !value || this.parent.password === value;
          }
        ),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting, isValid }) => (
        <Form>
          <fieldset disabled={isSubmitting}>
            <label htmlFor="username">Username</label>
            <Field name="username" type="text" />
            <ErrorMessage name="username" />
            <label htmlFor="email">Email</label>
            <Field name="email" type="email" />
            <ErrorMessage name="email" />
            <label htmlFor="password">Password</label>
            <Field name="password" type="password" />
            <ErrorMessage name="password" />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Field name="confirmPassword" type="password" />
            <ErrorMessage name="confirmPassword" />

            <button type="submit" disabled={isSubmitting || !isValid}>
              Submit
            </button>
          </fieldset>
        </Form>
      )}
    </Formik>
  );
}
