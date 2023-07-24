import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import sendRequest from "../utils/sendRequest";
import { APIURL } from "../utils/constants";
import { PriceHistoryFetchResult, StockPriceDataPoint } from "../utils/types";
import { APIError } from "../utils/types";
import {
  LineChart,
  Line,
  XAxis,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import ErrorAlertContext from "../contexts/ErrorAlertContext";

type Props = {
  period: string;
};

export default function PriceHistoryGraph(props: Props) {
  const { period } = props;
  const { slug } = useParams();
  const { errorAlert } = useContext(ErrorAlertContext);
  const [priceData, setPriceData] = useState([] as StockPriceDataPoint[]);

  async function fetchPriceData() {
    if (!slug) return;
    try {
      const data = (await sendRequest(
        APIURL + `tickers/pricehistory/?period=${period}&ticker=${slug}`
      )) as PriceHistoryFetchResult;
      data.data.forEach((x) => {
        x.Datetime = new Date(x.Datetime);
      });
      setPriceData(data.data);
    } catch (err) {
      if (err instanceof APIError) {
        errorAlert(err.message);
      }
    }
  }

  useEffect(() => {
    fetchPriceData().catch(console.log);
  }, [slug, period]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={600} height={400} data={priceData}>
        <CartesianGrid />
        <Line
          type="monotone"
          dataKey="Close"
          dot={false}
          stroke="#6c757d"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="High"
          dot={false}
          stroke="#198754"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="Low"
          dot={false}
          stroke="#dc3545"
          strokeWidth={2}
        />
        <XAxis
          allowDuplicatedCategory={false}
          minTickGap={50}
          angle={0}
          dataKey="Datetime"
          tickFormatter={(x: Date) =>
            x.toLocaleDateString(undefined, {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
            })
          }
        />
        <YAxis type="number" domain={["auto", "auto"]} />
        <Tooltip
          isAnimationActive={false}
          labelFormatter={(date: Date) =>
            date.toLocaleTimeString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          }
          formatter={(price) =>
            price.toLocaleString(undefined, {
              style: "currency",
              currency: "usd",
            })
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
