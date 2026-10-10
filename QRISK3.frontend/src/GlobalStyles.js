import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body, html {
    min-height: 100vh;
    background-color: #f7f8fa;
    /* Mantiene el espacio del scroll para evitar saltos al cambiar de ruta */
    overflow-y: auto; 
    scrollbar-gutter: stable; 
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
`;