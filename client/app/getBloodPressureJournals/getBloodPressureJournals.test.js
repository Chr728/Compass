import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { createBloodPressureJournal } from '../http/bloodPressureJournalAPI.ts';
import GetBloodPressureJournals from './page.tsx';

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

describe('GetBloodPressureJournals', () => {
  it('returns GetBloodPressureJournalsPage component', () => {
    const { container } = render(<GetBloodPressureJournals />);

    expect(container.textContent).toContain('Blood Pressure Journal');
  });
});