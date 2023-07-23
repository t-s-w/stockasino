import { useParams } from "react-router-dom";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import sendRequest from "../utils/sendRequest";
import React, { useEffect, useState } from "react";
import StockHoldings from "../utils/Holdings";
import { APIError } from "../utils/types";
import { APIURL } from "../utils/constants";

type Props = {
  price: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SellStock(props: Props) {
  const { slug } = useParams();
  const { price, setLoading } = props;
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);

  const [holdings, setHoldings] = useState({} as StockHoldings);
  async function fetchHoldings() {
    try {
      const data = (await sendRequest(
        APIURL + "myholdings?ticker=" + slug
      )) as StockHoldings;
      setHoldings(data);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.body.detail);
      }
    }
  }

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setLoading(true);
    try {
      const response = await sendRequest(APIURL + "transactions/", "POST", {
        quantity: qty,
        ticker: slug,
        type: "SELL",
      });
      updateGame();
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        console.log(err);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setQty(parseInt(evt.target.value));
  }

  useEffect(() => {
    void fetchHoldings();
  }, [slug]);

  return holdings.qtyOwned > 0 ? (
    <Card body className="mb-2">
      <span className="fw-bold">Units owned: </span>
      <span>{holdings.qtyOwned}</span>
      <Form
        onSubmit={(evt) => {
          void handleSubmit(evt);
        }}
      >
        <Row className="mb-2">
          <p className="fw-bold">Sell your owned stock:</p>

          <Form.Range
            style={{ maxWidth: "90%", marginLeft: "1em" }}
            min={1}
            max={holdings.qtyOwned}
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
              max={holdings.qtyOwned}
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
              Sell
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  ) : null;
}
