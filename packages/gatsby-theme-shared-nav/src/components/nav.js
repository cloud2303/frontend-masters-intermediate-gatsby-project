import { Link, useStaticQuery, graphql } from "gatsby";
import * as React from "react";
import styled from '@emotion/styled'

export function Nav() {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          navItems {
            label
            path
          }
        }
      }
    }
  `);

  const navItems = data.site.siteMetadata.navItems;
  return (
    <ContainerWrapper >
      <LinkWrapper to="/" >
        {data.site.siteMetadata.title}
      </LinkWrapper>
      <SharedNav >
        {navItems.map((item) => (
          <LinkWrapper key={`nav-${item.path}`} to={item.path} >
            {item.label}
          </LinkWrapper>
        ))}
      </SharedNav>
    </ContainerWrapper>
  );
}
const ContainerWrapper = styled.header`
    background: var(--black);
  color: var(--white);
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 0.5rem 5vw;
`
const SharedNav = styled.nav`
 display: flex;
  justify-content: space-between;
`
const LinkWrapper = styled(Link)`
 color: inherit;
  padding: 0.25rem;
  text-decoration: none;
  &:hover,&:focus{
background: var(--white);
  color: var(--black);
  }
`