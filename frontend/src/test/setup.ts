import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Scripts available in frontend via `npm run-script`:
//   dev
//     vite
//   build
//     tsc && vite build
//   lint
//     eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0
//   preview
//     vite preview
//   test
//     vitest
//   test:ui
//     vitest --ui
//   test:run
//     vitest run
//   test:coverage
//     vitest run --coverage
//   test:watch
//     vitest --watch