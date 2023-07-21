import { useState } from "react";
import Loading from "../components/Loading";

export default function ViewGamePage() {
  const [loading, setLoading] = useState(true);
  return <Loading loading={loading}></Loading>;
}
