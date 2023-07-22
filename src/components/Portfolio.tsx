import { Accordion } from "react-bootstrap";
import { Game, Transaction } from "../utils/types";
import Holdings from "../utils/Holdings";
import { diff } from "../utils/functions";

type Props = {
  gameInfo: Game;
};

function delta(a, b) {
  const diffs = diff(a, b);
  const colour =
    b - a > 0 ? "var(--bs-success)" : b - a < 0 ? "var(--bs-danger)" : "";
  return (
    <span style={{ color: colour }}>{`${diffs.diff} (${diffs.pctDiff})`}</span>
  );
}

export default function Portfolio(props: Props) {
  const { gameInfo } = props;

  const elements = [];

  for (const ticker in gameInfo.portfolio) {
    const stock = gameInfo.portfolio[ticker];
    if (stock.qtyOwned <= 0) continue;
    const holdingsValue = stock.currentPrice * stock.qtyOwned;
    const holdingsCost = stock.totalCost;
    elements.push(
      <Accordion.Item eventKey={ticker} key={ticker}>
        <Accordion.Header>
          <div className="d-flex w-100 flex-row justify-content-between align-items-center me-5">
            <p className="fw-bold h5 mb-0 w-25">{ticker}</p>
            <div className="mb-0 small w-25 d-flex">
              <div className="text-start me-auto">
                Units owned <br /> Invested
              </div>
              <div className="text-end fw-bold">
                {stock.qtyOwned}
                <br />
                {stock.totalCost.toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
            </div>
            <p className="small mb-0 text-end w-25">
              <span className="m-0 fw-bold">
                {holdingsValue.toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                })}{" "}
              </span>
              <br />
              {delta(holdingsCost, holdingsValue)}
            </p>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          {stock.transactionHistory
            .filter((txn) => txn.ticker.toUpperCase() === ticker.toUpperCase())
            .map((x) => x.created)}
        </Accordion.Body>
      </Accordion.Item>
    );
  }

  elements.unshift(
    <Accordion.Item
      key="cashOnHand"
      eventKey="cashOnHand"
      style={{
        padding:
          "var(--bs-accordion-btn-padding-y) var(--bs-accordion-btn-padding-x)",
      }}
    >
      <div className="mb-0 w-100 d-flex flex-row align-items-center pe-3">
        <p className="fw-bold mb-0 h4 w-25">Portfolio Value </p>
        <p className="text-end mb-0 pe-3 w-25">
          <span className="text-end">
            {gameInfo.value?.toLocaleString(undefined, {
              style: "currency",
              currency: "USD",
            })}
          </span>
          <br />
          <span className="text-end">
            {delta(gameInfo.starting, gameInfo.value)}
          </span>
        </p>
        <p className="mb-0 h6 text-end ms-auto">
          Cash:{" "}
          {gameInfo.currentBalance.toLocaleString(undefined, {
            style: "currency",
            currency: "usd",
          })}
        </p>
      </div>
    </Accordion.Item>
  );
  return <Accordion>{elements}</Accordion>;
}
