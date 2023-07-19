import { Container } from "react-bootstrap";
import { stockInfoParsers } from "../utils/constants";
import { StockInfo } from "../utils/types";

type PropType = {
  stockInfo: StockInfo;
};

export default function StockSummary(props: PropType) {
  const { stockInfo } = props;
  const output: { name: string; value: string }[] = [];
  for (const parser of stockInfoParsers) {
    if (parser.condition(stockInfo)) {
      output.push({ name: parser.name, value: parser.value(stockInfo) });
    }
  }
  return (
    <Container
      className="d-flex flex-column flex-wrap align-items-start align-content-start mt-2"
      style={{ height: "23em" }}
    >
      {output.map((x) => (
        <div
          key={x.name}
          className="p-1 small w-50 border-bottom border-2 d-flex flex-row align-items-center justify-content-between me-2"
          style={{ height: "3.5em" }}
        >
          <p className="mb-0">{x.name}</p>
          <p className="fw-bold mb-0 text-end">{x.value}</p>
        </div>
      ))}
    </Container>
  );
}
