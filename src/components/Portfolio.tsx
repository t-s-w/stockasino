import { Accordion, Col } from "react-bootstrap";
import { Transaction } from "../utils/types";
import Holdings from "../utils/Holdings";
import { diff } from "../utils/functions";

type Props = {
  prices: Record<string, number>;
  transactions: Transaction[];
};

export default function Portfolio(props: Props) {
  const { prices, transactions } = props;
  const elements = [];
  const holdings = new Holdings(transactions);
  for (const ticker in holdings.portfolio) {
    const stock = holdings.portfolio[ticker];
    if (stock.qtyOwned <= 0) continue;
    const holdingsValue = prices[ticker.toUpperCase()] * stock.qtyOwned;
    const holdingsCost = stock.totalCost;
    const diffs = diff(holdingsCost, holdingsValue);

    elements.push(
      <Accordion.Item eventKey={ticker}>
        <Accordion.Header>
          <div className="d-flex w-100 flex-row justify-content-between align-items-center me-5">
            <p className="fw-bold h5 mb-0 w-25">{ticker}</p>
            <p className="mb-0 small w-25 d-flex">
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
            </p>
            <p className="small mb-0 text-end w-25">
              <p className="m-0 fw-bold">
                {holdingsValue.toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                })}{" "}
              </p>

              <span
                style={{
                  color:
                    holdingsCost < holdingsValue
                      ? "var(--bs-success)"
                      : holdingsCost > holdingsValue
                      ? "var(--bs-danger)"
                      : "",
                }}
              >
                {`${diffs.diff} (${diffs.pctDiff})`}
              </span>
            </p>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          {transactions
            .filter((txn) => txn.ticker.toUpperCase() === ticker.toUpperCase())
            .map((x) => x.created)}
        </Accordion.Body>
      </Accordion.Item>
    );
  }
  return <Accordion>{elements}</Accordion>;
}
