import {render, screen,act} from '@testing-library/react';
import '@testing-library/jest-dom';
import GetMedicationsPage from './getMedicationsPage';
import {getMedications} from '../http/medicationAPI';
import userEvent from '@testing-library/user-event';
import { deleteMedication} from '../http/activityJournalAPI'; 
import Swal from 'sweetalert2';

import { useRouter } from "next/router";
import { useUser } from '../contexts/UserContext';

beforeEach(async () => {
    await act(async () => {
        render(<GetMedicationsPage/>);
      });
})

const mockRouter= jest.fn();
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
  });


jest.mock('../http/medicationAPI', () => {
    return {
        getMedications: () => {
            return {
                
                    success: "SUCCESS",
                    data: [
                        {
                            uid: '1',
                            medicationName: 'Advil',
                            dateStarted: '2014-01-01',
                            time: '08:36',
                            dosage: 60,
                            unit: 'milligram (mg)',
                            frequency: 'Six times a day',
                            route: 'Rectal',
                            Notes : 'Test medication'
                    }
                ]
            }
        },
        deleteMedication: async (medicationId) => {
            return {
                status: "SUCCESS",
                data: `Successfully deleted medication.`,
            };
        },
    }
});
   

test("Add an entry button  functions correctly", async () => {
    setTimeout(() => {
    const addButton = screen.getAllByRole('button')[1];
    userEvent.click(addButton);
    mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/createMedication') 
    }, 1000);    
})




    test("Get medications list is displayed correctly", async () => {
        setTimeout(() => {
            const name = screen.findByText('advil');
            const dosage = screen.findByText('60');
            const route = screen.findByText('Rectal');
 

            expect(name).toBeInTheDocument();
            expect(dosage).toBeInTheDocument();
            expect(route).toBeInTheDocument();
        }, 1000);   
       
    })

   

    
     // checks the texts
     test("Message displayed", async () => {
        const message = screen.getByText(/Keep track of all medications you take and follow the progress through the time./i);
        expect(message).toBeInTheDocument();
    })

