import { render, screen, fireEvent } from '@testing-library/react';
import FileDetailsModal from './FileDetailsModal';

describe('FileDetailsModal', () => {
  const documentMock = {
    documentName: 'Test Document',
    dateOfAnalysis: '2024-03-06',
    files: [{ type: 'image/png', name: 'test.png' }],
  };

  // Mocking createObjectURL
  global.URL.createObjectURL = jest.fn(() => 'mocked-url');

  test('renders document details correctly', () => {
    render(<FileDetailsModal document={documentMock} onClose={() => {}} />);

    const documentNameElement = screen.queryByText(documentMock.documentName);
    const dateElement = screen.queryByText(documentMock.dateOfAnalysis);
    const fileElement = screen.queryByAltText('Preview');

    expect(documentNameElement).toBeTruthy();
    expect(dateElement).toBeTruthy();
    expect(fileElement).toBeTruthy();
  });

  test('opens file on click', () => {
    const openMock = jest.fn();
    window.open = openMock;

    render(<FileDetailsModal document={documentMock} onClose={() => {}} />);

    const fileElement = screen.getByAltText('Preview');
    fireEvent.click(fileElement);

    expect(openMock).toHaveBeenCalledWith('mocked-url', '_blank');
  });

  test('closes modal on close button click', () => {
    const onCloseMock = jest.fn();
    render(<FileDetailsModal document={documentMock} onClose={onCloseMock} />);

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
