import '@testing-library/jest-dom';

if (typeof window !== 'undefined' && !window.Worker) {
  (window as any).Worker = class {
    postMessage = () => {};
    terminate = () => {};
    addEventListener = () => {};
    removeEventListener = () => {};
  };
}
