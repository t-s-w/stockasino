import { diff } from "../utils/functions";
import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";
import StockSummary from "./StockSummary";
import { StockInfo as StockInformation } from "../utils/types";

type Props = {
  stockInfo: StockInformation;
};

export default function StockInfo(props: Props) {
  const { stockInfo } = props;
  const fontColour =
    stockInfo.currentPrice > stockInfo.previousClose
      ? "text-success"
      : stockInfo.currentPrice < stockInfo.previousClose
      ? "text-danger"
      : "";

  const diffs = diff(stockInfo.previousClose, stockInfo.currentPrice);

  return (
    <>
      <h3>
        <span className="fw-bold">{stockInfo.symbol}</span>:{" "}
        {stockInfo.longName}
      </h3>
      <Container className="mt-3">
        <Row>
          <Col md={2}>
            <span className="fw-bold fs-1">{stockInfo.currentPrice}</span>
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
      <Tabs defaultActiveKey="summary" id="stockInfo">
        <Tab eventKey="summary" title="Summary">
          <StockSummary stockInfo={stockInfo} />
        </Tab>
        <Tab eventKey="graph" title="Graph">
          test2
        </Tab>
      </Tabs>
    </>
  );
}
