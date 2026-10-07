import { Component, type ReactNode } from 'react'

export class ErrorBoundary extends Component<{ children: ReactNode; label: string }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) {
      return (
        <div className="err" role="alert">
          {this.props.label} failed to load. Reload the page, or open the{' '}
          <a href="https://github.com/SumanJha-tech/weatherretail-intelligence">live apps on GitHub</a> instead.
        </div>
      )
    }
    return this.props.children
  }
}
