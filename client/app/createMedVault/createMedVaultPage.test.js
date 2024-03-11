import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateMedVaultPage from './CreateMedVaultPage';
import { openDB } from 'idb';

const mockRouter = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouter,
  }),
}));

jest.mock('idb', () => ({
  openDB: jest.fn().mockResolvedValue({
    transaction: jest.fn().mockReturnValue({
      objectStore: jest.fn().mockReturnValue({
        add: jest.fn(),
      }),
    }),
    close: jest.fn(),
  }),
}));

describe('CreateMedVaultPage tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render all form fields', () => {
    render(<CreateMedVaultPage />);
    const folderNameInput = screen.getByLabelText("Doctor's Name");
    const specializationInput = screen.getByLabelText(
      "Doctor's Specialization"
    );
    expect(folderNameInput).toBeInTheDocument();
    expect(specializationInput).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    render(<CreateMedVaultPage />);
    const folderNameInput = screen.getByLabelText("Doctor's Name");
    const specializationInput = screen.getByLabelText(
      "Doctor's Specialization"
    );
    const submitButton = screen.getByRole('button', { name: 'Add Folder' });

    await userEvent.type(folderNameInput, 'John Doe');
    await userEvent.type(specializationInput, 'Cardiologist');
    await userEvent.click(submitButton);

    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith('/getMedVault');
  });

  it('should save data to IndexedDB when form is submitted with valid data', async () => {
    render(<CreateMedVaultPage />);
    const folderNameInput = screen.getByLabelText("Doctor's Name");
    const specializationInput = screen.getByLabelText(
      "Doctor's Specialization"
    );
    const submitButton = screen.getByRole('button', { name: 'Add Folder' });

    // Fill out form
    await userEvent.type(folderNameInput, 'John Doe');
    await userEvent.type(specializationInput, 'Cardiologist');
    await userEvent.click(submitButton);

    // Wait for IndexedDB operation to complete
    await waitFor(() => {
      expect(openDB).toHaveBeenCalledWith(
        'medVault',
        expect.any(Number),
        expect.objectContaining({
          upgrade: expect.any(Function),
        })
      ); // Ensure openDB is called with correct parameters
      expect(openDB).toHaveBeenCalledTimes(1); // Ensure openDB is called exactly once
    });
  });
});
