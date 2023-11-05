import {render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EditInsulinJournal from './page';
import {getInsulinJournal, updateInsulinJournal} from '../../../http/diabeticJournalAPI';

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
        getInsulinJournal: () => {
            return {
                    success: "SUCCESS",
                    data: 
                        {
                            id: '1',
                            date: '2014-01-01',
                            time: '08:36',
                            typeOfInsulin: 'Humalog (Insulin lispro)',
                            unit: 60,
                            bodySite: 'Lower Back (left)',
                            Notes : 'I am feeling good today'
                    }
            }
        },
        updateInsulinJournal: jest.fn()
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
    const updateInsulinJournal = jest.fn();
    render(<EditInsulinJournal params={{ insulinJournal:'1'}}/>);
    await getInsulinJournal();
    const date = screen.getByLabelText("Date");
    const time  = screen.getByLabelText("Time");
    const typeOfInsulin = screen.getByLabelText("Type of Insulin");
    const unit = screen.getByLabelText("Units Given");
    const bodySite = screen.getByLabelText("Body Site");
    const notes  = screen.getByLabelText("Notes");
    const submitButton = screen.getAllByRole('button')[2];

    expect(date).toBeInTheDocument();
    expect(time).toBeInTheDocument();
    expect(typeOfInsulin).toBeInTheDocument();
    expect(unit).toBeInTheDocument();
    expect(bodySite).toBeInTheDocument();
    expect(notes).toBeInTheDocument();

    await userEvent.click(submitButton);
    setTimeout(() => {
      expect(updateInsulinJournal).toHaveBeenCalledTimes(1);
    }, 1000);
})

test("Cancel button works correctly", async () =>{
    render(<EditInsulinJournal params={{ insulinJournal:'1'}}/>);
    await getInsulinJournal();
    const cancelButton = screen.getAllByRole('button')[1];
    await userEvent.click(cancelButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith(`getDiabeticJournals/getInsulinJournals/1`);
})