import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  
  html {
    /*網頁版版 1rem 基準*/
      font-size: 16px;
      @media (max-width: 768px) {
    /*行動版 1rem 基準*/
      font-size: 14px;
    }
  };

  body {
    width:100%;
    height:100%;
    margin: 0;
    overflow:hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  };

  #root {
    width: 100vw;
    height: 100vh;
  }
`

ReactDOM.render(
    <>
    <GlobalStyle whiteColor/>
    <App />
    </>
    ,
  document.getElementById('root')
);


