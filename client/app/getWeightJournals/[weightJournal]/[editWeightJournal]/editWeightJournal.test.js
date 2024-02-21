import '@testing-library/jest-dom';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getWeightJournal, updateWeightJournal } from '../../../http/weightJournalAPI';
import EditWeightJournal from './page';
import { useAuth } from '../../../contexts/AuthContext';

const mockRouter = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));


jest.mock('../../../http/weightJournalAPI', () => {
  return {
      getWeightJournal: jest.fn().mockResolvedValue(
          {
              success: "SUCCESS",
              data: 
              {
                  id: '1',
                  date: 'Jan 1,2014',
                  time: '08:36',
                  weight: '186',
                  unit: 'lb',
                  height: '174',
                  notes: 'notes'
              }
          }
    ),
    updateWeightJournal: jest.fn(),
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
  
jest.mock('../../../contexts/AuthContext', () => {
  return {
      useAuth: jest.fn(),
  }
});

  
describe("User is logged in", () => {
  
  beforeEach(async() => {
    useAuth.mockImplementation(() => {
        return {
            user: {
                uid: '1'
            }
        }
    })
  })

  test("Form submits correctly", async () =>{
      // const updateWeightJournal = jest.fn();
      render(<EditWeightJournal params={{ weightJournal: '1' }} />);
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
     
      await waitFor(() => {
        expect(updateWeightJournal).toHaveBeenCalled();
        expect(mockRouter).toHaveBeenCalledWith('/getWeightJournals/1');
      });
  })

  test("Cancel button works correctly", async () =>{
    render(<EditWeightJournal params={{ weightJournal:'1'}}/>);
    await getWeightJournal();
    const cancelButton = screen.getAllByRole('button')[1];
    await userEvent.click(cancelButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith(`/getWeightJournals/1`);
  })

  test("getWeightJournal function is called correctly", async () => {
    render(<EditWeightJournal params={{ weightJournal:'1'}}/>);
    await act(async () => {
        jest.advanceTimersByTime(2000);
    });
   
    await waitFor(() => {
        expect(getWeightJournal).toHaveBeenCalled();
    }); 
  })

})


