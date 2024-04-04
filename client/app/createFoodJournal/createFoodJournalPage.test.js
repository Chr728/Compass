import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import CreateFoodJournal from './page.tsx';

const useSearchParams = jest.fn();

jest.mock('next/navigation', () => ({
  useSearchParams: () =>{
    return {
        get: useSearchParams
    }
  }
}));

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

describe('CreateFoodJournal', () => {
  it('returns CreateFoodJournalPage component', () => {
    const { container } = render(<CreateFoodJournal />);

    expect(container.textContent).toContain('Create Food Journal');
  });
});