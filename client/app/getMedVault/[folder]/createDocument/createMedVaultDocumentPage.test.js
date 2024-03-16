import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateDocumentPage from './CreateMedVaultDocumentPage';

const fakeUser = {
  uid: '1',
};
jest.mock('../../../contexts/AuthContext', () => {
  return {
    useAuth: () => {
      return {
        user: fakeUser,
      };
    },
  };
});

const mockRouter = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => {
    return {
      push: mockRouter,
    };
  },
}));

jest.mock('.../../../contexts/AuthContext', () => {
  return {
    useUser: () => {
      return {
        userInfo: {
          uid: '1',
        },
      };
    },
  };
});

const mockIndexedDB = {
  open: jest.fn(),
};

window.indexedDB = {
  ...mockIndexedDB,
};

describe('med vault tests', () => {
  beforeEach(() => {
    // Clear any existing mocks and reset their state
    jest.clearAllMocks();
    // Reset any IndexedDB mock implementation details
    mockIndexedDB.open.mockReset();
  });

  it('med vault page is created', async () => {
    render(<CreateDocumentPage />);

    // Simulate user input
    const documentName = screen.getByLabelText('Document Name');
    const doa = screen.getByLabelText('Date of Analysis');
    await userEvent.type(documentName, 'MRI Results');
    await userEvent.type(doa, '2021-10-10');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Save' });
    await userEvent.click(submitButton);

    // Assertion for IndexedDB operation
    expect(mockIndexedDB.open).toHaveBeenCalledTimes(1);
  });

  it('All fields are displayed to the user', () => {
    render(<CreateDocumentPage />);
    const documentName = screen.getByLabelText('Document Name');
    const doa = screen.getByLabelText('Date of Analysis');

    expect(documentName).toBeInTheDocument();
    expect(doa).toBeInTheDocument();
  });

  it('Add folder button redirects to getMedVault page', async () => {
    render(<CreateDocumentPage />);
    const addFolderButton = screen.getAllByRole('button')[0];
    await userEvent.click(addFolderButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith('/getMedVault');
  });

  it('Error displayed if any of the fields are empty', async () => {
    render(<CreateDocumentPage />);
    const documentName = screen.getByLabelText('Document Name');
    fireEvent.blur(documentName);
    const doa = screen.getByLabelText('Date of Analysis');
    fireEvent.blur(doa);
    const submitButton = screen.getByRole('button', { name: 'Save' });
    await userEvent.click(submitButton);
    const errorMessages = await screen.findAllByText('is required', {
      exact: false,
    });
    expect(errorMessages.length).toBe(2);
  });
});
