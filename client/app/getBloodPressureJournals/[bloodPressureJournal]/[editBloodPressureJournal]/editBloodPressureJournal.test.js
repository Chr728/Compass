import '@testing-library/jest-dom';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditBloodPressureJournal from './page';
import { useAuth } from '../../../contexts/AuthContext';
import { getBloodPressureJournal, updateBloodPressureJournal } from '../../../http/bloodPressureJournalAPI';

const mockRouter = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

jest.mock("../../../contexts/AuthContext", () => {
  return {
    useAuth: jest.fn(),
  };
});

jest.mock('../../../http/bloodPressureJournalAPI', () => {
    return {
        getBloodPressureJournal: jest.fn().mockResolvedValue(
          {
              success: "SUCCESS",
              data: 
                  {
                    id: "1",
                    date: "Jan 1,2014",
                    time: "8:36",
                    systolic: 120,
                    diastolic: 80,
                    pulse: "30",
                    notes: "this is a note",
                  }
          }
        ),
        updateBloodPressureJournal: jest.fn()
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
  });

  it("Form submits correctly", async() => {
        const updateBloodPressureJournal = jest.fn();
		render(<EditBloodPressureJournal params={{ bloodPressureJournal: "1" }} />);
		await getBloodPressureJournal();
		const date = screen.getByLabelText("Date");
		const time = screen.getByLabelText("Time");
		const bloodPressure = screen.getByLabelText(/Blood Pressure/i);
		const pulse = screen.getByLabelText(/Pulse Rate/i);
		const notes = screen.getByLabelText("Notes");
		const submitButton = screen.getAllByRole("button")[2];

		expect(date).toBeInTheDocument();
		expect(time).toBeInTheDocument();
		expect(bloodPressure).toBeInTheDocument();
		expect(pulse).toBeInTheDocument();
		expect(notes).toBeInTheDocument();

		userEvent.click(submitButton);
		setTimeout(() => {
			expect(updateBloodPressureJournal).toHaveBeenCalledTimes(1);
		}, 1000);
  });

    it("Cancel button works correctly", async () => {
        render(<EditBloodPressureJournal params={{ bloodPressureJournal: "1" }} />);
        await getBloodPressureJournal();
        const cancelButton = screen.getAllByRole("button")[1];
        await userEvent.click(cancelButton);
        await mockRouter;
        expect(mockRouter).toHaveBeenCalledWith(`/getBloodPressureJournals/1`);
    });

    it("Back button works correctly", async () => {
        render(<EditBloodPressureJournal params={{ bloodPressureJournal: "1" }} />);
        await getBloodPressureJournal();
        const backButton = screen.getAllByRole("button")[0];
        await userEvent.click(backButton);
        await mockRouter;
        expect(mockRouter).toHaveBeenCalledWith(`/getBloodPressureJournals/1`);
    });

    it("Submit button works correctly", async () => {
        render(<EditBloodPressureJournal params={{ bloodPressureJournal: "1" }} />);
        await getBloodPressureJournal();
		const submitButton = screen.getAllByRole("button")[2];
		await userEvent.click(submitButton);
		await mockRouter;
		expect(mockRouter).toHaveBeenCalledWith(`/getBloodPressureJournals/1`);
	});

})