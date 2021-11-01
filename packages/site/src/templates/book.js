import * as React from "react";
import { graphql, Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import styled from '@emotion/styled'


export const query = graphql`
  query($id: String!) {
    book(id: { eq: $id }) {
      isbn
      name
      author {
        slug
        name
      }
      series
      seriesOrder
      cover {
        childImageSharp {
          gatsbyImageData(width: 150)
        }
      }
    }
  }
`;

export default function Book({ data }) {
  const book = data.book;

  return (
    <>
      <LinkWrapper>
        <GatsbyImage image={getImage(book.cover)} alt={book.name} />
        <div>
          <Heading >{book.name}</Heading>
          <p>
            Author: <Link to={`/${book.author.slug}`}>{book.author.name}</Link>
          </p>
          {book.series && (
            <p>
              This is book {book.seriesOrder} of the {book.series}.
            </p>
          )}
        </div>
      </LinkWrapper>
      <Link to="/books">&larr; back to all books</Link>
    </>
  );
}
const LinkWrapper = styled.div`
 display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`
const Heading = styled.h1`
margin: 0;
`