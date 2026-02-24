import { render, screen } from '@testing-library/react';

describe('Sample Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });

  it('should render a simple message', () => {
    render(<div>Hello Jest</div>);
    expect(screen.getByText('Hello Jest')).toBeInTheDocument();
  });
});
