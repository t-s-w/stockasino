import { PropsWithChildren } from "react";
import { Container, Spinner } from "react-bootstrap";

export default function Loading({
  loading,
  children,
}: PropsWithChildren & { loading: boolean }) {
  return loading ? (
    <Container
      className="p-auto d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "50vh" }}
    >
      <Spinner
        animation="grow"
        variant="secondary"
        className="m-auto"
        style={{ width: "6rem", height: "6rem" }}
      />
    </Container>
  ) : (
    <>{children}</>
  );
}
