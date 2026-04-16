import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Attempt to log out to dev server by doing a fetch to a dummy endpoint
    fetch('http://localhost:5173/__error_log_dummy/' + encodeURIComponent(error.message));
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '20px', background: 'white', position: 'fixed', inset: 0, zIndex: 99999 }}>
          <h2>React Error Boundary Caught an Error!</h2>
          <p>{this.state.error && this.state.error.toString()}</p>
          <pre style={{ overflow: 'auto', maxHeight: '500px' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
