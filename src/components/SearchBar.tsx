import React, { useEffect, useState } from "react";
import { NavDropdown } from "react-bootstrap";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [quotes, setQuotes] = useState([]);

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setQuery(evt.target.value);
  }
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetch("https://query2.finance.yahoo.com/v1/finance/search?q=" + query)
      .then((x) => x.json())
      .then((x) => x.quotes.filter(quote.quoteType === "EQUITY"))
      .then((x) => setQuotes(x), { signal })
      .catch((err) => console.log(err.message));

    return () => controller.abort();
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
      {}
    </NavDropdown>
  );
}
