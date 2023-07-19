import { diff } from "../utils/functions";
import { Container, Row, Col } from "react-bootstrap";

export default function stockInfo({ stockInfo }) {
  const fontColour =
    stockInfo.ask > stockInfo.previousClose
      ? "text-success"
      : stockInfo.ask < stockInfo.previousClose
      ? "text-danger"
      : "";

  const diffs = diff(stockInfo.previousClose, stockInfo.ask);

  return (
    <>
      <h3>
        <span className="fw-bold">{stockInfo.symbol}</span>:{" "}
        {stockInfo.longName}
      </h3>
      <Container className="mt-3">
        <Row>
          <Col md={2}>
            <span className="fw-bold fs-1">{stockInfo.ask}</span>
          </Col>
          <Col md={1} className="pt-2 flex flex-row align-items-center">
            <span className={"text-end fw-semibold " + fontColour}>
              <span>{diffs.diff}</span>
              <br />
              <span>({diffs.pctDiff})</span>
            </span>
          </Col>
        </Row>
        <Row sm="auto">
          <p className="text-secondary fs-6">
            From previous close:{" "}
            <span className="fw-semibold">{stockInfo.previousClose}</span>
          </p>
        </Row>
      </Container>
    </>
  );
}
