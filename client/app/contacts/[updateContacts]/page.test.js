import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import act from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UpdateContactPage from './page';
import {getSpeedDial, updateSpeedDial} from '../../http/speedDialAPI';

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
jest.mock("../../contexts/AuthContext", () => {
  return {
    useAuth: () =>{
      return {
          user: userData
      }
    }
  };
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

  

test("Form submits correctly", async () =>{
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
    }, 1000);})

test("Cancel button works correctly", async () =>{
  render(<UpdateContactPage params={{ updateContacts:'1'}}/>);
    await getSpeedDial();
    const cancelButton = screen.getAllByRole('button')[1];
    await userEvent.click(cancelButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalled();
})

