import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("❌ Error Boundary Caught an Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong! Please refresh the page.</h2>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
