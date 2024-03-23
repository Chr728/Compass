import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { auth } from '../config/firebase';
import CreateMedVaultPage from './createMedVaultPage';

const fakeUser = {
  uid: '1',
};
jest.mock('../contexts/AuthContext', () => {
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

jest.mock('../contexts/UserContext', () => {
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
    render(<CreateMedVaultPage />);

    // Simulate user input
    const name = screen.getByLabelText("Doctor's Name");
    const spec = screen.getByLabelText("Doctor's Specialization");
    await userEvent.type(name, 'Joe');
    await userEvent.type(spec, 'Dentistry');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Add Folder' });
    await userEvent.click(submitButton);

    // Assertion for IndexedDB operation
    expect(mockIndexedDB.open).toHaveBeenCalledTimes(1);
  });

  it('All fields are displayed to the user', () => {
    render(<CreateMedVaultPage />);
    const name = screen.getByLabelText("Doctor's Name");
    const spec = screen.getByLabelText("Doctor's Specialization");

    expect(name).toBeInTheDocument();
    expect(spec).toBeInTheDocument();
  });

  it('Add folder button redirects to getMedVault page', async () => {
    render(<CreateMedVaultPage />);
    const addFolderButton = screen.getAllByRole('button')[0];
    await userEvent.click(addFolderButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith('/getMedVault');
  });

  it('Error displayed if any of the fields are empty', async () => {
    render(<CreateMedVaultPage />);
    const name = screen.getByLabelText("Doctor's Name");
    fireEvent.blur(name);
    const spec = screen.getByLabelText("Doctor's Specialization");
    fireEvent.blur(spec);
    const submitButton = screen.getByRole('button', { name: 'Add Folder' });
    await userEvent.click(submitButton);
    const errorMessages = await screen.findAllByText('is required', {
      exact: false,
    });
    expect(errorMessages.length).toBe(2);
  });
});
