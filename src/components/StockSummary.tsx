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
    <Container className="d-flex flex-column flex-wrap align-items-start mt-2">
      {output.map((x) => (
        <div
          key={x.name}
          className="w-25 border-bottom border-2 d-flex flex-row justify-content-between p-1"
        >
          <p className="mb-0">{x.name}</p>
          <p className="fw-bold mb-0">{x.value}</p>
        </div>
      ))}
    </Container>
  );
}
