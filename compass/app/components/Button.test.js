import { render, screen , fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Button from './Button';

describe('Button', () => {
  //tests whether the component renders correctly, with the correct button text, without crashing
  test('renders with the correct text', () => {
    const buttonText = 'Click me!';
    render(<Button type="button" text={buttonText} />);
    const buttonElement = screen.getByText(buttonText);
    expect(buttonElement).toBeInTheDocument();
  });

  //mocks a button click and tests whether the onClick function is called
  // test('calls the onClick function when clicked', () => {
  //   const handleClick = jest.fn();
  //   render(<Button type="button" text="Click me!" onClick={handleClick} />);
  //   const buttonElement = screen.getByText('Click me!');
  //   fireEvent.click(buttonElement);
  //   expect(handleClick).toHaveBeenCalledTimes(1);
  // });
});