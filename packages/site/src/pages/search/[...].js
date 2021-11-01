import * as React from "react";
import { navigate } from "gatsby";
import styled from '@Emotion/styled'



export default function BookClientOnly({ params }) {
  const query = decodeURIComponent(params["*"]);
  const [currentQuery, setCurrentQuery] = React.useState(query);
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState("IDLE");

  function handleSearch(event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const query = form.get("search");

    setCurrentQuery(query);
    navigate(`/search/${encodeURIComponent(query)}`);
  }

  function handleSearchReset(event) {
    setCurrentQuery("");
    navigate("/search/");
  }

  async function bookSearch(query) {
    setStatus("LOADING");
    const res = await fetch(`https://openlibrary.org/search.json?q=${query}`);

    if (!res.ok) {
      throw new Error(`Search failed: ${res.status}`);
    }

    const result = await res.json();

    setResult(result);
    setStatus("IDLE");
  }

  React.useEffect(() => {
    if (currentQuery === "") {
      setResult(null);
      return;
    }

    bookSearch(currentQuery);
  }, [currentQuery]);

  return (
    <>
      <h1>Search for a Book</h1>
      <FormWrapper onSubmit={handleSearch}>
        <Input type="search" name="search" />
        <Button >search</Button>
        <Button type="reset" onClick={handleSearchReset}>
          reset
        </Button>
      </FormWrapper>

      {status === "LOADING" && <p>Loading results...</p>}

      {status === "IDLE" && currentQuery !== "" ? (
        <>
          <h2>Search results for "{currentQuery}":</h2>
          <ul>
            {result &&
              result.docs.map((doc) => (
                <li key={doc.key}>
                  <strong>{doc.title}</strong>{" "}
                  {doc.author_name && `by ${doc.author_name?.[0]}`}
                </li>
              ))}
          </ul>
        </>
      ) : null}
    </>
  );
}
const FormWrapper = styled.form`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`
const Input = styled.input`
font-size: 1rem;
  padding: 0.25rem 1rem;
  width: 100%;
`
const Button = styled.button`
 font-size: 1rem;
  padding: 0.25rem 1rem;
`