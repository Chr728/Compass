import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UpdateContactPage from './page';
import { getSpeedDial, updateSpeedDial } from '../../http/speedDialAPI';
import { useAuth } from '../../contexts/AuthContext';


const mockRouter = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

const userData = {
  uid: '1',
} 

jest.mock('../../http/speedDialAPI.ts', () => {
  return {
      getSpeedDial: jest.fn(),
      updateSpeedDial: jest.fn()
  }
});

jest.mock('../../http/speedDialAPI.ts', () => {
    return {
        getSpeedDial: () => {
            return {
                    success: "SUCCESS",
                    data: 
                        {
                          contactName: 'John Doe',
                          contactNumber: '1234567890'
                    }
            }
        },
        updateSpeedDial: jest.fn()
    }
});


jest.mock("../../contexts/UserContext", () => {
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

  jest.mock("../../contexts/AuthContext", () =>{
    return {
        useAuth: jest.fn(),
    }
})  

test("Form submits correctly", async () => {
    useAuth.mockImplementation(() => {
      return {
        user: userData,
      };
    });
    const updateSpeedDial = jest.fn();
    render(<UpdateContactPage params={{ updateContacts:'1'}}/>);
    await getSpeedDial();
    const contactName = screen.getByLabelText("Contact Name");
    const phone  = screen.getByLabelText("Phone Number");
    const submitButton = screen.getAllByRole('button')[2];

    expect(contactName).toBeInTheDocument();
    expect(phone).toBeInTheDocument();

    userEvent.click(submitButton);
    setTimeout(() => {
      expect(updateSpeedDial).toHaveBeenCalledTimes(1);
    }, 1000);
})

test("Cancel button works correctly", async () => {
  useAuth.mockImplementation(() => {
    return {
    user: userData,
    };
  });
  render(<UpdateContactPage params={{ updateContacts:'1'}}/>);
    await getSpeedDial();
    const cancelButton = screen.getAllByRole('button')[1];
    await userEvent.click(cancelButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalled();
})

test("Error page is shown when the user is not logged in", async () => {
  useAuth.mockImplementation(() => {
      return {
      user: null,
      };
  });

  render(<UpdateContactPage params={{ updateContacts:'1'}} />);
  const errorMessage = await screen.findByText("Error 403 - Access Forbidden");
  expect(errorMessage).toBeInTheDocument();
})
