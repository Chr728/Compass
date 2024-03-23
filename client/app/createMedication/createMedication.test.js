import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { createMedication } from '../http/medicationAPI.ts';
import CreateMedication from './page.tsx';

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

jest.mock('../http/medicationAPI.ts', () => {
  return {
      createMedication: jest.fn(),
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

describe('CreateMedication', () => {
  it('returns CreateMedication component', () => {
    const { container } = render(<CreateMedication />);

    expect(container.textContent).toContain('Add Other Medications');
  });
});