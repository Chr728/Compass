import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Ensure jest-dom methods are available
import CardFolder from './CardFolder';

describe('CardFolder', () => {
  test('renders with correct props', () => {
    const onDelete = jest.fn();
    const onPush = jest.fn();
    const onView = jest.fn();
    const props = {
      icon: 'Heart',
      name: 'Sample Name',
      text: 'Sample Text',
      onDelete,
      onPush,
      onView,
    };
    render(<CardFolder {...props} />);
    expect(screen.getByText('Sample Name')).toBeInTheDocument();
    expect(screen.getByText('Sample Text')).toBeInTheDocument();
  });

  test('calls onPush function when card is clicked', () => {
    const onPush = jest.fn();
    const props = {
      icon: 'Heart',
      name: 'Sample Name',
      text: 'Sample Text',
      onPush,
    };
    render(<CardFolder {...props} />);
    fireEvent.click(screen.getByRole('heading', { name: 'Sample Name' }));
    expect(onPush).toHaveBeenCalledTimes(1);
  });

  test('calls onView function when card is clicked', () => {
    const onView = jest.fn();
    const props = {
      icon: 'Heart',
      name: 'Sample Name',
      text: 'Sample Text',
      onView,
    };
    render(<CardFolder {...props} />);
    fireEvent.click(screen.getByRole('heading', { name: 'Sample Name' }));
    expect(onView).toHaveBeenCalledTimes(1);
  });

  test('truncates name if it exceeds maximum length', () => {
    const props = {
      icon: 'Heart',
      name: 'Sample Name That Is Too Long',
      text: 'Sample Text',
    };
    render(<CardFolder {...props} />);
    expect(screen.getByText('Sample Name Th...')).toBeInTheDocument();
  });
});
