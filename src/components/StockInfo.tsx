import { diff } from "../utils/functions";
import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";
import StockSummary from "./StockSummary";
import { StockInfo as StockInformation } from "../utils/types";
import AuthContext from "../auth/AuthContext";
import React, { useContext } from "react";
import BuyStock from "./BuyStock";

type Props = {
  stockInfo: StockInformation;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function StockInfo(props: Props) {
  const { activeGame } = useContext(AuthContext);

  const { stockInfo, setLoading } = props;
  const fontColour =
    stockInfo.currentPrice > stockInfo.previousClose
      ? "text-success"
      : stockInfo.currentPrice < stockInfo.previousClose
      ? "text-danger"
      : "";

  const diffs = diff(stockInfo.previousClose, stockInfo.currentPrice);
  const maxBuyable =
    activeGame?.currentBalance &&
    activeGame.currentBalance > stockInfo.currentPrice
      ? Math.floor(activeGame.currentBalance / stockInfo.currentPrice)
      : 0;

  return (
    <>
      <h3>
        <span className="fw-bold">{stockInfo.symbol}</span>:{" "}
        {stockInfo.longName}
      </h3>
      <Container className="d-flex flex-row">
        <Container className="mt-3 me-auto">
          <Row>
            <Col md="auto">
              <span className="fw-bold fs-1">{stockInfo.currentPrice}</span>
            </Col>
            <Col className="pt-2 flex flex-row align-items-center me-auto">
              <span className={" fw-semibold " + fontColour}>
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
        <Container>
          {maxBuyable > 0 && (
            <BuyStock
              setLoading={setLoading}
              maxBuyable={maxBuyable}
              price={stockInfo.currentPrice}
            />
          )}
        </Container>
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
