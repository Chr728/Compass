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

jest.mock('../../../http/weightJournalAPI', () => {
    return {
        getAppointment: () => {
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

beforeEach(async () => {
    await act(async () => {
        render(<EditWeightJournal params={{ weightJournalId: '1' }}/>);
      });
})

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
    await getWeightJournal();
        const date = screen.getByLabelText("Date");
        const time  = screen.getByLabelText("Time");
        const weight = screen.getByLabelText("Weight");
        const height = screen.getByLabelText("Height (in meters)");
        const unit = screen.getByLabelText("Unit");
        const notes  = screen.getByLabelText("Notes");

        expect(date).toBeInTheDocument();
        expect(time).toBeInTheDocument();
        expect(weight).toBeInTheDocument();
        expect(height).toBeInTheDocument();
        expect(unit).toBeInTheDocument();
        expect(notes).toBeInTheDocument();

    await userEvent.click(submitButton);
    await updateWeightJournal;
    expect(updateWeightJournal).toHaveBeenCalledTimes(1);
})

test("Cancel button works correctly", async () =>{
    await getWeightJournal();
    const date = screen.getByLabelText("Date");
    const time  = screen.getByLabelText("Time");
    const weight = screen.getByLabelText("Weight");
    const height = screen.getByLabelText("Height (in meters)");
    const unit = screen.getByLabelText("Unit");
    const notes  = screen.getByLabelText("Notes");
    const cancelButton = screen.getAllByRole('button')[0];
    await userEvent.click(cancelButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith(`/getWeightJournals/${weight.id}`);
})