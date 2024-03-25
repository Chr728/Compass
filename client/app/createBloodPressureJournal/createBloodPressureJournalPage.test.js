import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { createBloodPressureJournal } from '../http/bloodPressureJournalAPI.ts';
import CreateBloodPressureJournalPage from './page.tsx';

jest.mock("../contexts/PropContext", () => ({
  __esModule: true,
  useProp: jest.fn(() => ({
    handlePopUp: jest.fn(),
  })),
}));

const fakeUser = {
  uid: "1"
}

jest.mock('../contexts/AuthContext', () => {
  return {
      useAuth: () => {
          return {
              user : fakeUser
          }
      }
  }
});

jest.mock('../http/bloodPressureJournalAPI.ts', () => {
  return {
    createBloodPressureJournal: jest.fn(),
  }
});

const mockRouter= jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => {
      return {
          push: mockRouter
      }
  }
}));

jest.mock("../contexts/UserContext", () => {
  return {
    useUser: () =>{
      return {
          userInfo: {
              uid: '1',
          }
      }
    }
  };
});

describe('CreateBloodPressureJournal', () => {
  it('returns CreateBloodPressureJournalPage component', () => {
    const { container } = render(<CreateBloodPressureJournalPage />);

    expect(container.textContent).toContain('Add an Entry - Blood Pressure');
  });
});