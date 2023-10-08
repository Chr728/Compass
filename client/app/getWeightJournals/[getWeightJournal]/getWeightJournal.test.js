import {render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GetWeightJournal from './page';
import {getWeightJournal,getWeightJournals} from '../../http/weightJournalAPI';
import { useRouter } from "next/navigation";
import { useUser } from '../../contexts/UserContext';

const mockRouter = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));
jest.mock('next/navigation', () => ({
    useRouter() {
      return {
        push: () => jest.fn(),
        replace: () => jest.fn(),
      };
    },
    usePathname() {
      return '';
    },
  }));

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
        render(<GetWeightJournal params={{ uid: '1',id:'1' }}/>);
      });
})

test("User data is displayed correctly", async () => {
    await getWeightJournal();
    const date = await screen.findByText("Date:");
    const time  = await screen.findByText("Time:");
    const weight = await screen.findByText("Weight:");
    const height = await screen.findByText("Height:");
    const unit = await  screen.findByText("Unit:");
    const notes  = await screen.findByText("Notes:");

    const dateValue = await screen.findByText("2014-01-01");
    const timeValue = await screen.getByText("08:36 AM");
    const weightValue = await screen.getByText("186");
    const unitValue = await screen.getByText("lb");
    const heightValue = await screen.getByText("174");
    const notesValue = await screen.getByText("notes");

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
    const cancelButton = screen.getAllByRole('button')[1];
    await userEvent.click(cancelButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith('/getWeightJournals')
})

test("Update button functions correctly", async() => {
    const updateButton = screen.getAllByRole('button')[2];
    await userEvent.click(updateButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith('/getWeightJournals/[getWeightJournal]/1')
})