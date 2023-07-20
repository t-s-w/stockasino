import React, { useContext, useState } from "react";
import { Form, Card, Row, Col, Button } from "react-bootstrap";
import { APIURL } from "../utils/constants";
import { useParams } from "react-router-dom";
import sendRequest from "../utils/sendRequest";
import AuthContext from "../auth/AuthContext";
import { APIError } from "../utils/types";

type Props = {
  maxBuyable: number;
  price: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function BuyStock(props: Props) {
  const { tokens, refresh } = useContext(AuthContext);
  const { slug } = useParams();
  const [qty, setQty] = useState(1);
  const { maxBuyable, price, setLoading } = props;
  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setQty(parseInt(evt.target.value));
  }
  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    console.log("click");
    setLoading(true);
    try {
      const response = await sendRequest(APIURL + "transactions/", "POST", {
        quantity: qty,
        ticker: slug,
        type: "BUY",
      });
      await refresh(tokens.refresh);
    } catch (err) {
      if (err instanceof APIError) {
        console.log(err.body);
      } else {
        console.log(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

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
