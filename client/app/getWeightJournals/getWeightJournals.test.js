import '@testing-library/jest-dom';
import {render, screen, act, cleanup} from '@testing-library/react';
import GetWeightJournalsPage from './getWeightJournalsPage';
import userEvent from '@testing-library/user-event';


beforeEach(async () => {
    await act(async () => {
        render(<GetWeightJournalsPage/>);
      });
})

afterEach(() => {
  cleanup();
});

const mockRouter= jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
})
);

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
  }
);


jest.mock('../http/weightJournalAPI', () => {
    return {
        getWeightJournals: () => {
            return {
                
                    success: "SUCCESS",
                    data: [
                        {
                            uid: '1',
                            date: '2014-01-01',
                            time: '8:36',
                            weight: '75.5',
                            height: 1.65,
                            unit:'kg',
                            Notes : 'I am feeling good today'
                    }
                ]
            }
        },

        deleteWeightJournal: async (weightJournalId) => {
            return {
                status: "SUCCESS",
                data: `Successfully deleted weight Journal.`,
            };
        },
    }
});
   



test("Add an entry button  functions correctly", async() => {
    setTimeout(() => {
        const addButton = screen.getAllByRole('button')[1];
        userEvent.click(addButton);
        mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/createWeightJournal')
    },1000);    
})



    test("Get Weight Journals list is displayed correctly", async () => {
        setTimeout(() => {
            const date = screen.findByText('Jan 1, 2014 8h36');
            const weight = screen.findByText('75.5');
            const height =  screen.findByText('1.65cm');


            expect(date).toBeInTheDocument();
            expect(weight).toBeInTheDocument();
            expect(height).toBeInTheDocument();
        },1000);    
    })

   

    
     // checks the texts
     test("Message displayed", async () => {
        const message = screen.getByText(/Managing your weight helps you stay healthy./i);
        expect(message).toBeInTheDocument();
    })


     test("Message displayed", async () => {
        const message = screen.getByText(/our BMI can tell you if you’re at risk for certain health conditions like heart disease./i);
        expect(message).toBeInTheDocument();
    })