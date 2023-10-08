import {render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GetWeightJournal from './page';
import {getWeightJournal} from '../../http/weightJournalAPI';
import { useRouter } from "next/navigation";
import { useUser } from '../../contexts/UserContext';

const mockRouter = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    },
    usePathname: jest.fn()
}));
    
    //     return {
    //         split: jest.fn()

    //     }
    // }



jest.mock('../../http/weightJournalAPI', () => {
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
        }
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

beforeEach(async () => {
    await act(async () => {
        render(<GetWeightJournal params={{ getWeightJournal: '1' }}/>);
      });
})

test("User data is displayed correctly", async () => {
    await getWeightJournal();
    const date = screen.getByLabelText("Date");
    const time  = screen.getByLabelText("Time");
    const weight = screen.getByLabelText("Weight");
    const height = screen.getByLabelText("Height");
    const unit = screen.getByLabelText("Unit");
    const notes  = screen.getByLabelText("Notes");

    const dateValue = await screen.findByText("Jan 1, 2014");
    const timeValue = await screen.findByText("8h36");
    const weightValue = await screen.findByText("186");
    const unitValue = await screen.findByText("lb");
    const heightValue = await screen.findByText("174");
    const notesValue = await screen.findByText("notes");

    expect(date).toBeInTheDocument();
    expect(time).toBeInTheDocument();
    expect(weight).toBeInTheDocument();
    expect(height).toBeInTheDocument();
    expect(unit).toBeInTheDocument();
    expect(notes).toBeInTheDocument();

    expect(dateValue).toBeInTheDocument();
    expect(timeValue).toBeInTheDocument();
    expect(weightValue).toBeInTheDocument();
    expect(unitValue).toBeInTheDocument();
    expect(heightValue).toBeInTheDocument();
    expect(notesValue).toBeInTheDocument();
})

test("Cancel button functions correctly", async() => {
    const cancelButton = screen.getAllByRole('button')[0];
    await userEvent.click(cancelButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith('/getWeightJournals')
})

test("Update button functions correctly", async() => {
    const updateButton = screen.getAllByRole('button')[1];
    await userEvent.click(updateButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith('/getWeightJournal/1')
})