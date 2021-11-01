import * as React from "react";

import "../styles/variables.css";
import "../styles/global.css"
import styled from '@emotion/styled'
import { Nav } from "./nav";
export default function Layout({ children }) {
  return (
    <>
      <Nav />
      <ContentWrapper >{children}</ContentWrapper>
      <Footer >Built with the Shared Nav Gatsby Theme</Footer>
    </>
  );
}
const ContentWrapper = styled.main`
margin: 3rem auto;
  max-width: 54ch;
`
const Footer = styled.footer`
 font-size: 0.75rem;
  padding: 1rem 5vw;
  text-align: center;
`