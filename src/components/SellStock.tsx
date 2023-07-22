import { useParams } from "react-router-dom";
import { Card, Form, Row, Col, Button } from "react-bootstrap";

export default function SellStock() {
  const { slug } = useParams();
  async function fetchHoldings() {}

  return (
    <Card body>
      <Form
        onSubmit={(evt) => {
          void handleSubmit(evt);
        }}
      >
        <Row className="mb-2">
          <p className="fw-bold">Buy this stock:</p>

          <Form.Range
            style={{ maxWidth: "90%", marginLeft: "1em" }}
            min={1}
            max={maxBuyable}
            id="buyQuantitySlider"
            onChange={handleChange}
            value={qty}
          />
        </Row>
        <Row>
          <Col>
            <p className="mb-0 fw-bold">Quantity:</p>
            <input
              type="number"
              min={1}
              max={maxBuyable}
              id="buyQuantityType"
              onChange={handleChange}
              step={1}
              value={qty}
              className="w-75 p-1"
            />
          </Col>
          <Col>
            <p className="mb-0 fw-bold">Total:</p>
            <p className="text-center">
              {(qty * price).toLocaleString(undefined, {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <Button type="submit" style={{ height: "fit-content" }}>
              Buy
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
