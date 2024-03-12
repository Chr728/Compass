import "@testing-library/jest-dom";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecordAudioPage from "./recordAudioPage";
import { getAudioEntries, deleteAudioEntry } from "../http/snoreAPI";


const mockRouter = jest.fn();
jest.mock("next/navigation", () => ({
	useRouter: () => {
		return {
			push: mockRouter,
		};
	},
}));

const userData = {
    uid: '1',
}


jest.mock("../http/snoreAPI", () => {
  return {
    getAudioEntries: jest.fn(), // Mocked function
    deleteAudioEntry: jest.fn(), // Mocked function
    // getAudioEntries: () => {
    //   return {
    //     success: "SUCCESS",
    //     data: [
    //       {
    //         uid: 1,
    //         date: "2024-01-01T00:00:00.000Z",
    //         filename: "Dummy file name",
    //         results: "Snoring Detected",
    //       }
    //     ]
    //   }
    // },

    // deleteAudioEntry: async(audioEntryID) => {
    //   return {
		// 		status: "SUCCESS",
		// 		data: `Successfully deleted audio entry.`,
		// 	};
    // }
  }
})

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
            render(<RecordAudioPage />);
          });

          navigator.mediaDevices = {
            getUserMedia: jest.fn(() =>
              Promise.resolve({
                getTracks: () => [{ stop: jest.fn() }], 
            ),
          };
        
          global.MediaRecorder = jest.fn(function () {
            this.ondataavailable = null;
            this.start = jest.fn();
          });
    })

    it("Table is displayed correctly", () => {
        const dateHeader = screen.getByText("Date");
        const resultHeader = screen.getByText("Result");
        expect(dateHeader).toBeInTheDocument();
        expect(resultHeader).toBeInTheDocument();
    });

    it('renders RecordAudioPage component', () => {
      const recordIcon = screen.getByAltText('Record Audio Icon');
      expect(recordIcon).toBeInTheDocument();
    });

    it("Fetches audio entries correctly", async () => {
      getAudioEntries.mockResolvedValue({
        success: "SUCCESS",
        data: [
          {
            uid: 1,
            date: "2024-01-01T00:00:00.000Z",
            filename: "Dummy file name",
            result: "Snoring Detected",
          }
        ]
      });
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      await waitFor(() => {
        expect(getAudioEntries).toHaveBeenCalled();
      });
    });

    it("Audio entries list is displayed correctly", async () => {
      getAudioEntries.mockResolvedValue({
        success: "SUCCESS",
        data: [
          {
            uid: 1,
            date: "2024-01-01T00:00:00.000Z",
            filename: "Dummy file name",
            result: "Snoring Detected",
          }
        ]
      });
        const date = await screen.findByText("Jan 1, 2024");
        const result = await screen.findByText("Snoring Detected");
  
        await waitFor(async () => {
          expect(date).toBeInTheDocument();
          expect(result).toBeInTheDocument();
        })
       
    });

    it("Deletes audio entry", async() => {

      deleteAudioEntry.mockResolvedValue({
        result: { message: 'Audio entry deleted successfully' }
      });

      const audioID = '1';

      const trashIcon = screen.getByAltText('Trash icon');
      await userEvent.click(trashIcon);
      const result = await deleteAudioEntry(audioID);
      expect(result.result.message).toEqual('Audio entry deleted successfully');

    })

    xit("should handle recording start", () =>{
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
      expect(global.MediaRecorder).toHaveBeenCalled();
    })

    xit('should handle stop click', async() => {

      const recordIcon = screen.getByTestId('record-container');
      await userEvent.click(recordIcon);
      
      const originalMediaRecorderRef = global.MediaRecorder;
      global.MediaRecorder = {
        onstop: jest.fn(),
        stop: jest.fn(),
      };
  
      const originalSetInterval = global.setInterval;
      global.setInterval = jest.fn(() => 123); 
  
      // Trigger the button click
      const stopButton = await screen.findByText(/Stop/i);
      await userEvent.click(stopButton);
  
    
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
      expect(global.MediaRecorder).toHaveBeenCalled();
    });
   
}); 


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
    });

    it("Router push method redirects to login page", () => {
        render(<RecordAudioPage />);
        expect(mockRouter).toBeCalledWith('/login');
    });
});