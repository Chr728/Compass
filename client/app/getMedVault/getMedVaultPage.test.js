import '@testing-library/jest-dom';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getO2SaturationJournals } from '../http/oxygenJournalAPI';
import GetMedVaultPage from './getMedVaultPage';

beforeEach(async () => {
  await act(async () => {
    render(<GetMedVaultPage />);
  });
});

afterEach(() => {
  cleanup();
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

test('Add an entry button  functions correctly', async () => {
  setTimeout(() => {
    const addButton = screen.getAllByRole('button')[1];
    userEvent.click(addButton);
    mockRouter;
    expect(mockRouter).toHaveBeenCalledWith('/createMedVault');
  }, 1000);
});

test('GetMedVaultPage renders correctly', async () => {
  await waitFor(() => {
    expect(screen.getByText('MedVault')).toBeInTheDocument();
  });
});
