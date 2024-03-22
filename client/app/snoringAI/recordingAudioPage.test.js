import "@testing-library/jest-dom";
import { act, render, screen, waitFor, fireEvent } from "@testing-library/react";
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
    getAudioEntries: jest.fn(), 
    deleteAudioEntry: jest.fn(), 
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
            result: "[0,1]",
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
            result: "[1]",
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
      setTimeout(async() => {
        deleteAudioEntry.mockResolvedValue({
          result: { message: 'Audio entry deleted successfully' }
        });

        const audioID = '1';

        const trashIcon = screen.getByAltText('Trash icon');
        await userEvent.click(trashIcon);
        const result = await deleteAudioEntry(audioID);
        expect(result.result.message).toEqual('Audio entry deleted successfully');
        expect(mockRouter).toHaveBeenCalledWith("/snoringAI");
      }, 1000);
    })

    it("should handle recording click", async() => {
      setTimeout(async() => {
        const dummyData = new Uint8Array([
          0x52, 0x49, 0x46, 0x46, 
          0x24, 0x08, 0x00, 0x00, 
          0x57, 0x41, 0x56, 0x45,
          0x66, 0x6D, 0x74, 0x20, 
          0x10, 0x00, 0x00, 0x00, 
          0x01, 0x00,             
          0x01, 0x00,            
          0x80, 0xBB, 0x00, 0x00, 
          0x00, 0x77, 0x01, 0x00, 
          0x02, 0x00,             
          0x10, 0x00,             
          0x64, 0x61, 0x74, 0x61, 
          0x00, 0x08, 0x00, 0x00, 
        ]);
        const mockMediaDevices = {
          getUserMedia: jest.fn(() => Promise.resolve({})),
        };
        global.navigator.mediaDevices = mockMediaDevices;
        await act(async () => {
          await userEvent.click(screen.getByText('Record'));
        });
        expect(mockMediaDevices.getUserMedia).toHaveBeenCalled();
        await act(async () => {
          fireEvent(mockMediaDevices.mediaRecorderRef.current, {
            type: 'dataavailable',
            data: new Blob([dummyData], { type: 'audio/wav' }),
          });
        });
        userEvent.click(screen.getByText('Record'));  
        const recordingDateElement = await screen.findByText(/Recording Date/i);
        expect(recordingDateElement).toBeInTheDocument();
      }, 1000); 
    })

    it('should handle stop click', async() => {
      setTimeout(async() => {
       
      const recordIcon = screen.getByTestId('record-container');
      await userEvent.click(recordIcon);
      
      const originalMediaRecorderRef = global.MediaRecorder;
      global.MediaRecorder = {
        onstop: jest.fn(),
        stop: jest.fn(),
      };
  
      const originalSetInterval = global.setInterval;
      global.setInterval = jest.fn(() => 123); 

      const stopButton = await screen.findByText(/Stop/i);
      await userEvent.click(stopButton);
  
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
      expect(global.MediaRecorder).toHaveBeenCalled();
      }, 1000);

    });


  it("Back button redirects to health page", async () => {
    setTimeout(async() => {
      const backButton = screen.getAllByRole("button")[0];
      userEvent.click(backButton);
      expect(mockRouter).toHaveBeenCalledWith("/health");
    }, 1000);
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