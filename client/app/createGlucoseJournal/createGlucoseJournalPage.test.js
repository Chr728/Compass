import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { createGlucoseJournal } from '../http/diabeticJournalAPI';
import CreateGlucoseJournal from './page.tsx';

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
      createGlucoseJournal: jest.fn(),
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

describe('CreateGlucoseJournal', () => {
  it('returns CreateGlucoseJournalPage component', () => {
    const { container } = render(<CreateGlucoseJournal />);

    expect(container.textContent).toContain('Create Glucose Measurement');
  });
});