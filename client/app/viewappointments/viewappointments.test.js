import {render, screen, act} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ViewAppointmentsPage from './viewAppointmentsPage';
import { deleteAppointment } from '../http/appointmentAPI';

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

jest.mock('../http/appointmentAPI', () => {
    return {
        getAppointments: () => {
            return {
                
                    success: "SUCCESS",
                    data: [
                        {
                            id: '1',
                            date: '2014-01-01',
                            time: '8:36',
                            appointmentWith: 'Dr. John',
                            reason: 'reason',
                            notes:'notes'
                    }
                ]
            }
        },

        deleteAppointment: async (appointmentId) => {
            return {
                status: "SUCCESS",
                data: `Successfully deleted appointment.`,
            };
        },
    }
});

describe ("Logged in user", () => {
    jest.mock("../contexts/AuthContext", () => {
        return {
          useAuth: () =>{
            return {
                user: userData
            }
          }
        };
      });
      
    beforeEach(async () => {
        await act(async () => {
            render(<ViewAppointmentsPage />);
          });
    })

        it("Appointment list is displayed correctly", async () => {
            const date = await screen.findByText('Jan 1, 2014,');
            const time = await screen.findByText('8h36');
            const doctor = await screen.findByText('Dr. John');
            expect(date).toBeInTheDocument();
            expect(time).toBeInTheDocument();
            expect(doctor).toBeInTheDocument();
        })
    
        it("Clicking on the trash icon calls the delete function", async () => {
            const trashIcon = screen.getByAltText('Trash icon');
            const appointmentId = '1';
            await userEvent.click(trashIcon);
            const result = await deleteAppointment(appointmentId);
            expect(result.status).toEqual('SUCCESS');
            expect(result.data).toEqual('Successfully deleted appointment.');
        })

        it ("Click on the filters", async () => {
            const orderDate = screen.getByLabelText("orderDate")
            await userEvent.click(orderDate)
            await userEvent.click(orderDate)
            const orderName = screen.getByLabelText("orderName")
            await userEvent.click(orderName)
            await userEvent.click(orderName)
        })
    
})


describe("User not logged in", () => {
    beforeEach( () => {
        jest.mock("../contexts/AuthContext", () => {
            return {
              useAuth: () =>{
                return {
                    user: null
                }
              }
            };
          });

    })

    it("Router push method redirects to login page", () => {
        render(<ViewAppointmentsPage />);
        expect(mockRouter).toBeCalledWith('/login');
    })


})



