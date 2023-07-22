import { Accordion, Table, Button } from "react-bootstrap";
import { Game } from "../utils/types";
import { diff } from "../utils/functions";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
          <div className="d-flex justify-content-between">
            <div className="mb-0 w-25 d-flex">
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
            <Button
              className="w-auto"
              onClick={() => navigate(`/viewticker/${ticker}`)}
            >
              View stock info
            </Button>
          </div>
          <h6 className="mt-3">Transaction History</h6>
          <Table>
            <thead>
              <tr>
                <th scope="col">Datetime</th>
                <th scope="col">Transaction type</th>
                <th scope="col">Quantity</th>
                <th scope="col">Unit price</th>
              </tr>
            </thead>
            {stock.transactionHistory.map((x) => (
              <tr key={x.id}>
                <td>
                  {new Date(x.created).toLocaleTimeString("en-sg", {
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  })}
                </td>
                <td className="fw-bold">{x.type}</td>
                <td>{x.quantity}</td>
                <td>{x.unitprice}</td>
              </tr>
            ))}
          </Table>
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
