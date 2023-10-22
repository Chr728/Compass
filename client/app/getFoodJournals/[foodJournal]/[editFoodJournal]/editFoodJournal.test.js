import {render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EditWeightJournal from './page';
import {getWeightJournal, updateWeightJournal} from '../../../http/weightJournalAPI';

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


jest.mock('../../../http/weightJournalAPI', () => {
    return {
        getWeightJournal: () => {
            return {
                    success: "SUCCESS",
                    data: 
                        {
                            id: '1',
                            date: '2014-01-01',
                            time: '8:36',
                            weight: '186',
                            unit: 'lb',
                            height: '174',
                            notes: 'notes'
                    }
            }
        },
        updateWeightJournal: jest.fn()
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
    const updateWeightJournal = jest.fn();
    render(<EditWeightJournal params={{ weightJournal:'1'}}/>);
    await getWeightJournal();
    const date = screen.getByLabelText("Date");
    const time  = screen.getByLabelText("Time");
    const weight = screen.getByLabelText("Weight");
    const height = screen.getByLabelText("Height (in centimeters)");
    const unit = screen.getByLabelText("Unit");
    const notes  = screen.getByLabelText("Notes");
    const submitButton = screen.getAllByRole('button')[2];

    expect(date).toBeInTheDocument();
    expect(time).toBeInTheDocument();
    expect(weight).toBeInTheDocument();
    expect(height).toBeInTheDocument();
    expect(unit).toBeInTheDocument();
    expect(notes).toBeInTheDocument();

    userEvent.click(submitButton);
    setTimeout(() => {
      expect(updateWeightJournal).toHaveBeenCalledTimes(1);
    }, 1000);})

test("Cancel button works correctly", async () =>{
  render(<EditWeightJournal params={{ weightJournal:'1'}}/>);
    await getWeightJournal();
    const cancelButton = screen.getAllByRole('button')[1];
    await userEvent.click(cancelButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith(`/getWeightJournals/1`);
})