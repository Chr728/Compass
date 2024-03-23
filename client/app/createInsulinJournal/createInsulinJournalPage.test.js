import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { createInsulinJournal } from '../http/diabeticJournalAPI.ts';
import CreateInsulinJournal from './page.tsx';

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

jest.mock('../http/diabeticJournalAPI', () => {
  return {
      createInsulinJournal: jest.fn(),
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

describe('CreateInsulinJournal', () => {
  it('returns CreateInsulinJournal component', () => {
    const { container } = render(<CreateInsulinJournal />);

    expect(container.textContent).toContain('Create Insulin Dosage');
  });
});