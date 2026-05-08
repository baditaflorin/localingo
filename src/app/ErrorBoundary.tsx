import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logger } from '../lib/logger';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error({ error, info }, 'Unexpected app render failure');
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen bg-slate-50 p-6 text-ink">
          <section className="mx-auto max-w-xl border border-red-200 bg-white p-6 shadow-panel">
            <h1 className="text-2xl font-semibold">Localingo hit a bad state</h1>
            <p className="mt-3 text-slate-700">
              Refresh the page. Your saved progress is kept in this browser.
            </p>
            <button
              className="mt-5 bg-ink px-4 py-2 text-sm font-semibold text-white"
              onClick={() => location.reload()}
            >
              Reload
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
