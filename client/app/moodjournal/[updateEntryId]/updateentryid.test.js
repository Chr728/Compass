import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';



const mockRouter = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => {
      return {
          push: mockRouter
      }
  }
}));
 
describe("Update entry page", () => {
  let UpdateMoodEntry;
  let user = {
    uid: "AFADF123svdfg#fdsf"
  }
  let updateMoodJournal = jest.fn((updateEntryId, data) => {
    return {   

    };
  })
  
  beforeEach(() => {
    jest.mock("../../contexts/AuthContext", () => {
      return {
        useAuth: () => {
          return {
            user: user
          }
         
        }
      };
    });

  jest.mock("../../http/moodJournalAPI", () => {
    return {
        getMoodJournal : jest.fn((updateEntryId) => {
            return {
                status: "success",
                data: 
                {
                    id: updateEntryId,
                    howAreYou: 'good', 
                    stressSignals: JSON.stringify({ tired: "rarely", sleep: "rarely", hunger: "rarely",  overeating: "rarely",  depressed: "rarely", pressure: "rarely", anxiety: "rarely", attention: "rarely", anger: "always", headache: "always"}),
                    date: "2023-10-10",
                    notes: "Test note",
                }
            };
        }),
  
      updateMoodJournal: updateMoodJournal
  
    };

  });
    UpdateMoodEntry = require('./page').default; 
  })
  
  afterEach(() => {
    jest.clearAllMocks();
  })
  
 it("All form fields are displayed to the user", async () => {
  render( <UpdateMoodEntry params = { { updateEntryId: "10" } } /> );
   await waitFor(() => {
     const heading = screen.getByText("Edit an Entry - Mood");
     const text = screen.getByText("Choose atleast one way to describe your mood.");
     const howAreYou = screen.getByText("How are you?");
     const tiredStressSignal = screen.getByLabelText("I feel tired.");
     const sleepStressSignal = screen.getByLabelText("I'm not sleeping well.");
     const hungerStressSignal = screen.getByLabelText("I'm not hungry.");
     const overeatingStressSignal = screen.getByLabelText("I ate too much.");
     const depressedStressSignal = screen.getByLabelText("I feel sad or depressed.");
     const pressureStressSignal = screen.getByLabelText("I feel like things are just too much.");
     const attentionStressSignal = screen.getByLabelText("I have trouble paying attention.");
     const anxietyStressSignal = screen.getByLabelText("I feel nervous or anxious.");
     const angerStressSignal = screen.getByLabelText("I feel angry or irritated.");
     const headacheStressSignal = screen.getByLabelText("I get headaches and/or colds.");
     const notes = screen.getByLabelText("Notes");

     expect(heading).toBeInTheDocument();
     expect(text).toBeInTheDocument();
     expect(howAreYou).toBeInTheDocument();
     expect(tiredStressSignal).toBeInTheDocument();
     expect(sleepStressSignal).toBeInTheDocument();
     expect(hungerStressSignal).toBeInTheDocument();
     expect(overeatingStressSignal).toBeInTheDocument();
     expect(depressedStressSignal).toBeInTheDocument();
     expect(pressureStressSignal).toBeInTheDocument();
     expect(attentionStressSignal).toBeInTheDocument();
     expect(anxietyStressSignal).toBeInTheDocument();
     expect(angerStressSignal).toBeInTheDocument();
     expect(headacheStressSignal).toBeInTheDocument();
     expect(notes).toBeInTheDocument();
   })

})

it("All buttons are displayed to the user", async() => {
  render( <UpdateMoodEntry params = { { updateEntryId: "10" } } /> );
  await waitFor(() => {
    const cancelButton = screen.getAllByRole("button")[0];
    const submitButton = screen.getAllByRole("button")[1];
    expect(cancelButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  })
})

  it("Cancel button functions functions correctly", async () => {
    render( <UpdateMoodEntry params = { { updateEntryId: "10" } } /> );
    await waitFor(async () => {
      const cancelButton = screen.getAllByRole("button")[0];
      await userEvent.click(cancelButton);
      expect(mockRouter).toHaveBeenCalledWith('/moodjournal');
    })

})


  it("Fields are retrieved and prefilled correctly", async () => {
      render( <UpdateMoodEntry params = { { updateEntryId: "10" } } /> );
      await waitFor(() => {
      const date = document.querySelector('input[name="date"]');
      const smileIcon = screen.getByAltText("smile icon");
      const tiredStressSignal = screen.getByLabelText("I feel tired."); 
      const sleepStressSignal = screen.getByLabelText("I'm not sleeping well.");
      const hungerStressSignal = screen.getByLabelText("I'm not hungry.");
      const overeatingStressSignal = screen.getByLabelText("I ate too much.");
      const depressedStressSignal = screen.getByLabelText("I feel sad or depressed.");
      const pressureStressSignal = screen.getByLabelText("I feel like things are just too much.");
      const attentionStressSignal = screen.getByLabelText("I have trouble paying attention.");
      const anxietyStressSignal = screen.getByLabelText("I feel nervous or anxious.");
      const angerStressSignal = screen.getByLabelText("I feel angry or irritated.");
      const headacheStressSignal = screen.getByLabelText("I get headaches and/or colds.");
      const notes = screen.getByLabelText("Notes");
      

      expect(date).toHaveValue("2023-10-10");
      expect(smileIcon).toBeInTheDocument();
      expect(tiredStressSignal).toHaveValue("rarely");
      expect(sleepStressSignal).toHaveValue("rarely");
      expect(hungerStressSignal).toHaveValue("rarely");
      expect(overeatingStressSignal).toHaveValue("rarely");
      expect(depressedStressSignal).toHaveValue("rarely");
      expect(pressureStressSignal).toHaveValue("rarely");
      expect(attentionStressSignal).toHaveValue("rarely");
      expect(anxietyStressSignal).toHaveValue("rarely");
      expect(angerStressSignal).toHaveValue("always");
      expect(headacheStressSignal).toHaveValue("always");
      expect(notes).toHaveValue("Test note");
      })
    });
 

  it("Fields are updated correctly", async () => {
    render( <UpdateMoodEntry params = { { updateEntryId: "10" } } /> );
    await waitFor(async () => {
    const submitButton = screen.getAllByRole("button")[1];
    const tiredStressSignal = screen.getByLabelText("I feel tired.");
    const notes = screen.getByLabelText("Notes");

    await userEvent.selectOptions(tiredStressSignal, "Always");
    await userEvent.clear(notes);
    await userEvent.type(notes, "Note 1");
    console.log("notes values:", notes.value);
    await userEvent.click(submitButton);
    expect(updateMoodJournal).toBeDefined();

    expect(updateMoodJournal).toHaveBeenCalledWith("10", {
      howAreYou: 'good',
      stressSignals:{
        tired: "always",
        sleep: "rarely",
        hunger: "rarely",
        overeating: "rarely",
        depressed: "rarely",
        pressure: "rarely",
        anxiety: "rarely",
        attention: "rarely",
        anger: "always",
        headache: "always"
      },
      date: "2023-10-10",
      notes: "Note 1"
        })
      
    })
  })

  it("Error page shown", async () => {
    user = null;
    render( <UpdateMoodEntry params = { { updateEntryId: "10" } } /> );
    const text = await screen.findByText("Error 403 - Access Forbidden"); 
    expect(text).toBeInTheDocument();
      
       })
  })
  


