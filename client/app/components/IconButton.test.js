import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IconButton from './IconButton';

describe('IconButton', () => {
  // Test rendering of the button with text and icon
  test('renders with the correct text and icon', () => {
    const buttonText = 'Click me!';
    const iconSrc = '/path/to/icon.png';
    render(<IconButton type="button" text={buttonText} icon={iconSrc} />);
    const buttonElement = screen.getByText(buttonText);
    const iconElement = screen.getByAltText('Icon');
    expect(buttonElement).toBeInTheDocument();
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveAttribute('src', iconSrc);
  });

  // Test rendering of the button without an icon
  test('renders with text only if no icon is provided', () => {
    const buttonText = 'Click me!';
    render(<IconButton type="button" text={buttonText} />);
    const buttonElement = screen.getByText(buttonText);
    const iconElement = screen.queryByAltText('Icon'); // Should not find an icon
    expect(buttonElement).toBeInTheDocument();
    expect(iconElement).not.toBeInTheDocument();
  });

  test('calls the onClick function when clicked', () => {
    const handleClick = jest.fn();
    render(<IconButton type="submit" text="Click me!" onClick={handleClick} />);
    const buttonElement = screen.getByText('Click me!');
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders with disabled style when disabled is true', () => {
    const buttonText = 'Click me!';
    render(<IconButton type="button" text={buttonText} disabled={true} />);
    const buttonElement = screen.getByText(buttonText);
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveStyle('cursor: not-allowed');
  });

  test('renders with outlined style when outlined is true', () => {
    const buttonText = 'Click me!';
    render(<IconButton type="button" text={buttonText} outlined={true} />);
    const buttonElement = screen.getByText(buttonText);
    expect(buttonElement).toHaveClass('border border-blue text-blue');
    expect(buttonElement).toHaveStyle('backgroundColor: transparent');
  });

  test('renders with submitting text and icon when isSubmitting is true', () => {
    const buttonText = 'Click me!';
    const iconSrc = '/icons/blueProgress.svg';
    render(
      <IconButton
        type="button"
        text={buttonText}
        icon={iconSrc}
        isSubmitting={true}
      />
    );
    const buttonElement = screen.getByText('Submitting');
    const iconElement = screen.getByAltText('Progress Indicator');
    expect(buttonElement).toBeInTheDocument();
    expect(iconElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('Submitting');
    expect(iconElement).toHaveAttribute('src', iconSrc);
  });
});
