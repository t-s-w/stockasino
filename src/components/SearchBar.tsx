import React, { useEffect, useState } from "react";
import { APIURL } from "../utils/constants";
import { Link } from "react-router-dom";
import "./SearchBar.css";
import { Quote } from "../utils/types";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [quotes, setQuotes] = useState([] as Quote[]);

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setQuery(evt.target.value);
  }

  const searchIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      className="bi bi-search mx-2"
      viewBox="0 0 16 16"
    >
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
    </svg>
  );

  const crossIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      className="bi bi-x-circle-fill mx-2"
      viewBox="0 0 16 16"
      cursor="pointer"
      onClick={() => setQuery("")}
    >
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
    </svg>
  );

  useEffect(() => {
    if (query) {
      const controller = new AbortController();
      const signal = controller.signal;
      fetch(APIURL + "search?q=" + query, { signal })
        .then((x) => x.json())
        .then((x: Quote[]) => setQuotes(x))
        .catch(() => undefined);

      return () => controller.abort();
    } else {
      setQuotes([]);
    }
  }, [query]);
  return (
    <div id="search">
      <div
        id="searchBar"
        className="p-2 box-shadow rounded d-flex align-items-center focus-ring me-3 bg-dark"
      >
        <input
          type="text"
          id="searchBarInput"
          className="border-0 rounded"
          placeholder="Search for stocks..."
          value={query}
          onChange={handleChange}
          style={{
            outline: "none",
          }}
        />
        {query ? crossIcon : searchIcon}
      </div>
      {quotes && query ? (
        <div style={{ position: "relative" }} className="search-results">
          <div
            style={{ position: "absolute", top: "0", left: "0" }}
            className="bg-dark z-3 border border-2 rounded"
          >
            {quotes.map((quote) => (
              <Link
                key={quote.symbol}
                to={"/viewticker/" + quote.symbol.replace(".", "_")}
                onClick={() => setQuery("")}
                className="search-result d-flex flex-row justify-content-between text-decoration-none p-2"
              >
                <span className="fw-bold me-3">{quote.symbol}</span>
                <span className="ticker-longname text-end">
                  {quote.longname}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
