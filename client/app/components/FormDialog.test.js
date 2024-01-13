import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormDialog from './FormDialog';

describe('FormDialog', () => {
  const mockOnSubmit = jest.fn();
  const props = {
    label: 'Test Label',
    title: 'Test Title',
    description: 'Test Description',
    onSubmit: mockOnSubmit,
  };

  it('renders correctly', () => {
    const { getByText } = render(<FormDialog {...props} />);
    expect(getByText(props.label)).toBeInTheDocument();
  });

  it('opens dialog on button click', () => {
    const { getByText, getByRole } = render(<FormDialog {...props} />);
    fireEvent.click(getByText(props.label));
    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it('closes dialog on close button click', async () => {
    const { getByText, queryByRole } = render(<FormDialog {...props} />);
    fireEvent.click(getByText(props.label)); 
    fireEvent.click(getByText('Cancel')); 
    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('calls onSubmit on submit button click', () => {
    const { getByText } = render(<FormDialog {...props} />);
    fireEvent.click(getByText(props.label)); 
    fireEvent.click(getByText('Subscribe')); 
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});