import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import sendRequest from "../utils/sendRequest";
import { APIURL } from "../utils/constants";

export default function ViewTickerPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [stockInfo, setStockInfo] = useState(null);

  async function fetchTicker(slug: string) {
    try {
      const stockinfo = await sendRequest(APIURL + "tickers/" + slug);
      setStockInfo(stockinfo);
    } catch (err) {
      return;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTicker(slug);
  }, [slug]);

  return (
    <Loading loading={loading}>
      <Container className="p-3">
        {!stockInfo ? <h1>Invalid ticker!</h1> : <h1>{stockInfo.symbol}</h1>}
      </Container>
    </Loading>
  );
}
