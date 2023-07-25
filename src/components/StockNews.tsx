import ErrorAlertContext from "../contexts/ErrorAlertContext";
import sendRequest from "../utils/sendRequest";
import { APIError, StockNewsStory } from "../utils/types";
import { useContext, useEffect, useState } from "react";
import { APIURL } from "../utils/constants";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./StockNews.css";

function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export default function StockNews() {
  const [news, setNews] = useState([] as StockNewsStory[]);
  const [loading, setLoading] = useState(true);
  const { errorAlert } = useContext(ErrorAlertContext);
  const { slug } = useParams();
  async function fetchnews() {
    if (!slug) {
      errorAlert("Missing slug");
      return;
    }
    try {
      setLoading(true);
      const response = await sendRequest<StockNewsStory[]>(
        APIURL + "tickers/news/" + slug
      );
      setNews(response);
    } catch (err) {
      if (err instanceof APIError) {
        errorAlert(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => void fetchnews(), [slug]);

  return loading ? (
    <div className="w-100 d-flex justify-content-center">
      <Spinner
        animation="grow"
        variant="secondary"
        className="m-auto"
        style={{ width: "6rem", height: "6rem" }}
      />
    </div>
  ) : news.length > 0 ? (
    <Container className="news">
      {news.map((story) => {
        const thumbnail = story.thumbnail?.resolutions.find(
          (reso) => reso.tag === "140x140"
        );

        return (
          <Row key={story.uuid} className="p-3 news-story" md={2}>
            <Col
              md={3}
              className="d-flex justify-content-center align-items-center"
            >
              <img src={thumbnail ? thumbnail.url : ""} />
            </Col>
            <Col md={9}>
              <p className="fw-semibold">
                <a href={story.link}>{truncate(story.title, 100)}</a>
              </p>
            </Col>
          </Row>
        );
      })}
    </Container>
  ) : null;
}
