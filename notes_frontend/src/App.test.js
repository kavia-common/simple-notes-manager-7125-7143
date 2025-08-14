import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Notes title in sidebar', async () => {
  render(<App />);
  const title = await screen.findByText(/Notes/i);
  expect(title).toBeInTheDocument();
});

test('renders New Note button', async () => {
  render(<App />);
  const button = await screen.findByRole('button', { name: /New Note/i });
  expect(button).toBeInTheDocument();
});
