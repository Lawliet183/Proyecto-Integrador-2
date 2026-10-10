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
    
  @media print {
    /* 1. El margen se declara aquí para que el navegador lo aplique a TODAS las hojas */
    @page {
      size: A4;
      margin: 1.5cm; /* Margen real para la página 1, 2, 3... */
    }

    /* 2. Reseteamos el padding del contenedor principal */
    html, body, #root {
      background-color: #ffffff !important;
      margin: 0 !important;
      padding: 0 !important; /* Ya no usamos padding aquí */
      width: 100% !important;
      height: auto !important;
      min-height: 0 !important; 
    }

    /* 3. Expedientes largos (EvaluacionDetalle) */
    #root > div {
      background-color: #ffffff !important;
      margin: 0 !important;
      padding: 0 !important; /* Eliminamos el padding forzado */
      width: 100% !important;
      height: auto !important;
      min-height: 0 !important; 
      display: block !important; 
      box-sizing: border-box !important;
    }

    /* 4. Tarjeta rápida centrada (DiagnosticResult) */
    #root > div.print-single-card {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important; 
      justify-content: flex-start !important;
      overflow: visible !important;
    }

    .no-print, button {
      display: none !important;
      height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      box-shadow: none !important;
    }
    
    svg { 
      overflow: visible !important; 
    }
  }
`;