import React, { useEffect, useState } from "react";
import { Dropdown, NavDropdown } from "react-bootstrap";
import { APIURL } from "../utils/constants";
import { Link } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [quotes, setQuotes] = useState([]);

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setQuery(evt.target.value);
  }
  useEffect(() => {
    if (query) {
      const controller = new AbortController();
      const signal = controller.signal;
      fetch(APIURL + "search?q=" + query, { signal })
        .then((x) => x.json())
        .then((x) => setQuotes(x))
        .catch((err) => {});

      return () => controller.abort();
    } else {
      setQuotes([]);
    }
  }, [query]);
  return (
    <NavDropdown
      id="searchBar"
      title={
        <input
          type="text"
          placeholder="Search for stocks..."
          value={query}
          onChange={handleChange}
        />
      }
    >
      {query
        ? quotes.map((quote) => (
            <Dropdown.Item>
              <Link
                to={"/viewticker/" + quote.symbol.replace(".", "_")}
                className="d-flex flex-row justify-content-between text-decoration-none"
              >
                <span className="fw-bold me-3">{quote.symbol}</span>
                <span className="text-secondary">{quote.longname}</span>
              </Link>
            </Dropdown.Item>
          ))
        : null}
    </NavDropdown>
  );
}
