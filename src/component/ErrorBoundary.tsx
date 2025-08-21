import React from 'react'

type Props = { children: React.ReactNode }

type State = { hasError: boolean; error?: unknown }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error }
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // here you could log to Sentry
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16 }}>
          <h2>Something went wrong.</h2>
          <p>Try refreshing the page.</p>
        </div>
      )
    }
    return this.props.children
  }
}