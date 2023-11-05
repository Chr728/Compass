import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import act from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EditGlucoseJournal from './page';
import {getGlucoseJournal, updateGlucoseJournal} from '../../../http/diabeticJournalAPI';

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
jest.mock("../../../contexts/AuthContext", () => {
  return {
    useAuth: () =>{
      return {
          user: userData
      }
    }
  };
});


jest.mock('../../../http/diabeticJournalAPI', () => {
    return {
        getGlucoseJournal: () => {
            return {
                    success: "SUCCESS",
                    data: 
                        {
                            id: '1',
                            date: 'Jan 1,2014',
                            mealTime: '30min after breakfast',
                            bloodGlucose: '3',
                            unit: 'mmol/L',
                            notes: 'notes'
                    }
            }
        },
        updateGlucoseJournal: jest.fn()
    }
});


jest.mock("../../../contexts/UserContext", () => {
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
    const updateGlucoseJournal = jest.fn();
    render(<EditGlucoseJournal params={{ glucoseJournal:'1'}}/>);
    await getGlucoseJournal();
    const date = screen.getByLabelText("Date");
    const mealTime  = screen.getByLabelText("Meal Time");
    const bloodGlucose = screen.getByLabelText("Blood Glucose");
    const unit = screen.getByLabelText("Unit");
    const notes  = screen.getByLabelText("Notes");
    const submitButton = screen.getAllByRole('button')[2];

    expect(date).toBeInTheDocument();
    expect(mealTime).toBeInTheDocument();
    expect(bloodGlucose).toBeInTheDocument();
    expect(unit).toBeInTheDocument();
    expect(notes).toBeInTheDocument();

    userEvent.click(submitButton);
    setTimeout(() => {
      expect(updateGlucoseJournal).toHaveBeenCalledTimes(1);
    }, 1000);})

test("Cancel button works correctly", async () =>{
  render(<EditGlucoseJournal params={{ glucoseJournal:'1'}}/>);
    await getGlucoseJournal();
    const cancelButton = screen.getAllByRole('button')[1];
    await userEvent.click(cancelButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith(`/getGlucoseJournals/1`);
})

