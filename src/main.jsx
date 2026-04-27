import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  componentDidCatch(error) {
    this.setState({ error: error.message });
  }
  render() {
    if (this.state.error) {
      return React.createElement("div", {
        style: { padding: 40, color: "red", fontFamily: "monospace", fontSize: 14 }
      }, "Error: " + this.state.error);
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(ErrorBoundary, null,
    React.createElement(App, null)
  )
);
