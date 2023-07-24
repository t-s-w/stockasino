import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import sendRequest from "../utils/sendRequest";
import { APIURL } from "../utils/constants";
import StockInfo from "../components/StockInfo";
import { StockInformation } from "../utils/types";

export default function ViewTickerPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [stockInfo, setStockInfo] = useState(
    undefined as StockInformation | undefined
  );

  async function fetchTicker(slug: string) {
    try {
      const stockinfo = (await sendRequest(
        APIURL + "tickers/" + slug
      )) as StockInformation;
      setStockInfo(stockinfo);
    } catch (err) {
      return;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!slug) return;
    fetchTicker(slug).catch(console.log);
  }, [slug]);

  return (
    <Loading loading={loading}>
      <Container className="p-3">
        {!stockInfo ? (
          <h1>Invalid ticker!</h1>
        ) : (
          <StockInfo stockInfo={stockInfo} setLoading={setLoading} />
        )}
      </Container>
    </Loading>
  );
}
