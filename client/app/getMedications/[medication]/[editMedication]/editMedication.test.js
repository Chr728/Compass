import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EditMedication from './page';
import { updateMedication } from '../../../http/medicationAPI';
import { useAuth } from '../../../contexts/AuthContext';
import { auth } from '../../../config/firebase';

const mockRouter = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));


jest.mock('../../../contexts/AuthContext', () => {
    return {
        useAuth: jest.fn(),
      }
});


describe("Edit medications page", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
        useAuth.mockImplementation(() => {
            return {
              user: { uid: "AKSODN#KLAD12nkvs" },
            };
          });
      });
    
      afterEach(() => {
        jest.resetAllMocks();
        useAuth.mockImplementation(() => {
            return {
              user: null
            };
          });
      });

    test("All fields are displayed to the user", () => {
        render(<EditMedication params = { { medication: "123" } }/>);
        const heading = screen.getByText("Edit Medication");
        const name = screen.getByText("Medication Name");
        const date = screen.getByText("Date Started");
        const time = screen.getByLabelText("Time");
        const dosage = screen.getByLabelText("Dosage");
        const unit = screen.getByLabelText("Unit");
        const frequency = screen.getByLabelText("Frequency");
        const route = screen.getByLabelText("Route");
        const notes = screen.getByLabelText("Notes");

        expect(heading).toBeInTheDocument();
        expect(name).toBeInTheDocument();
        expect(date).toBeInTheDocument();
        expect(time).toBeInTheDocument();
        expect(dosage).toBeInTheDocument();
        expect(unit).toBeInTheDocument();
        expect(frequency).toBeInTheDocument();
        expect(route).toBeInTheDocument();
        expect(notes).toBeInTheDocument();

    })

    test("All buttons are displayed to the user", () => {
        render(<EditMedication params = { { medication: "123" } }/>);
        const cancelButton = screen.getAllByRole("button")[0];
        const submitButton = screen.getAllByRole("button")[1];
        expect(cancelButton).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
     })

    it("Should update a medication entry", async () => {
        const mockUserId = '11';
        const mockMedicationID = '123';
        render(<EditMedication  params = { { medication: "123" } }/>);
        const name = screen.getByRole("textbox", { name: /name/i });
        const date = screen.getByLabelText(/Date Started/i);
        const time = screen.getByLabelText("Time");
        const dosage = screen.getByLabelText("Dosage");
        const unit = screen.getByLabelText("Unit");
        const frequency = screen.getByLabelText("Frequency");
        const route = screen.getByLabelText("Route");
        const notes = screen.getByLabelText("Notes");
        const submitButton = screen.getAllByRole('button')[2];

        await userEvent.type(name, "Zopiclone");
        await userEvent.type(date, "2023-09-09")
        await userEvent.type(dosage, "1");
        await userEvent.selectOptions(frequency, "Twice a day");

        const mockMedicationData = {
            name: name.value,
            date: date.value,
            time: time.value,
            dosage: dosage.value,
            unit: unit.value,
            frequency: frequency.value,
            route: route.value,
            notes: notes.value,
        };

        await userEvent.click(submitButton);

        const mockToken = 'mockToken';
        const mockCurrentUser = {
            uid: mockUserId,
            getIdToken: jest.fn().mockResolvedValue(mockToken),
        };
       
        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue(mockMedicationData),
        };

        const mockFetch = jest.fn().mockResolvedValue(mockResponse);
        global.fetch = mockFetch;

        Object.defineProperty(auth, 'currentUser', {
            get: jest.fn().mockReturnValue(mockCurrentUser),
        });

        const result = await updateMedication(mockUserId, mockMedicationID, mockMedicationData);

        expect(mockFetch).toHaveBeenCalledWith(
            `${process.env.NEXT_PUBLIC_API_URL}/api/medication/${mockUserId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${mockToken}`,
                },
                body: "\"123\"",
            }
        );
        expect(result).toEqual(mockMedicationData);
    })

    it("Cancel button redirects to getMedications page", async () => {
        render(<EditMedication params = { { medication: "123" } }/>);
        const cancelButton = screen.getAllByRole('button')[1];
        await userEvent.click(cancelButton);
        await mockRouter;
        expect(mockRouter).toHaveBeenCalled();
    })
})