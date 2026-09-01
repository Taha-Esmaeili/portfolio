import React from 'react';

interface State {
  error: Error | null;
}

// Catches render-time crashes and shows the message instead of a blank page.
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Also log the component stack to the console for debugging.
    console.error('Admin panel crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-surface-50 p-8">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-xl font-bold text-red-700">Something went wrong</h1>
            <pre className="mt-4 text-sm bg-red-50 border border-red-200 rounded-lg p-4 overflow-auto whitespace-pre-wrap text-red-800">
              {this.state.error.message}
              {'\n\n'}
              {this.state.error.stack}
            </pre>
            <button
              type="button"
              onClick={() => { this.setState({ error: null }); window.location.reload(); }}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
