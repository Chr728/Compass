import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { createActivityJournal } from '../http/activityJournalAPI.ts';
import GetActivityJournals from './page.tsx';

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

jest.mock('../http/activityJournalAPI.ts', () => {
  return {
    createActivityJournal: jest.fn(),
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

describe('GetActivityJournals', () => {
  it('returns GetActivityJournals component', () => {
    const { container } = render(<GetActivityJournals />);

    expect(container.textContent).toContain('Activity Journals');
  });
});