import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders landing page as home route', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  // Landing hero headline text
  const headline = screen.getByText(/Movie AI/i);
  expect(headline).toBeInTheDocument();
});
