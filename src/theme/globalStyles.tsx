import { Global } from "@emotion/react";

const GlobalStyles = () => (
  <Global
    styles={{
      "*": {
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      },
      "html, body": {
        height: "100%",
        width: "100%",
        fontFamily: "'Inter', sans-serif",
        color: "#333333",
        lineHeight: 1.5,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
      "#root": {
        minHeight: "100vh",
        isolation: "isolate",
      },
    }}
  />
);

export default GlobalStyles;
