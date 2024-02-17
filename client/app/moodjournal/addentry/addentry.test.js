import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AddMoodEntry from './page';
import { useAuth } from "../../contexts/AuthContext";
import { createMoodJournal } from "../../http/moodJournalAPI"


const mockRouter= jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

jest.mock('../../contexts/AuthContext', () => {
    return {
        useAuth: jest.fn(),
      }
});

jest.mock("../../http/moodJournalAPI", () => ({
        ...jest.requireActual('../../http/moodJournalAPI'),
        createMoodJournal: jest.fn()
}));


describe("Logged In User", () => {
    beforeEach(() => {
        useAuth.mockImplementation(() => {
          return {
            user: { uid: "AKSODN#KLAD12nkvs" },
          };
        });
      });

      afterEach(() => {
        useAuth.mockImplementation(() => {
            return {
              user: null
            };
          });
      });
  
    test("All form fields are displayed to the user", () => {
        render(<AddMoodEntry/>);
        const heading = screen.getByText("Add an Entry - Mood");
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

    test("All buttons are displayed to the user", () => {
        render(<AddMoodEntry/>);
        const cancelButton = screen.getAllByRole("button")[0];
        const submitButton = screen.getAllByRole("button")[1];
        expect(cancelButton).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    })

    test("Cancel button functions functions correctly", async () => {
        render(<AddMoodEntry/>);
        const cancelButton = screen.getAllByRole("button")[0];
        await userEvent.click(cancelButton);
        expect(mockRouter).toHaveBeenCalledWith('/moodjournal');

    })

    test("Mood icons shown to the user", () => {
        render(<AddMoodEntry/>);
        const text = screen.getByText("How are you?");
        const downArrow = screen.getAllByAltText("Down Arrow icon")[1];
        const awesomeIcon = screen.getByAltText("Wink icon");
        const goodIcon = screen.getByAltText("Smile icon");
        const sadIcon = screen.getByAltText("Sad icon");
        const badIcon = screen.getByAltText("Bad icon");
        const awfulIcon = screen.getByAltText("Awful icon");

        expect(text).toBeInTheDocument();
        expect(downArrow).toBeInTheDocument();
        expect(awesomeIcon).toBeInTheDocument();
        expect(goodIcon).toBeInTheDocument();
        expect(sadIcon).toBeInTheDocument();
        expect(badIcon).toBeInTheDocument();
        expect(awfulIcon).toBeInTheDocument();

    })

    test("Submit button functions functions correctly", async () => {
        const mockData = {
            date: '2023-10-10',
            howAreYou: 'good',
            stressSignals: {},
            notes: ''
        };
     
        render(<AddMoodEntry/>);
        const submitButton = screen.getAllByRole("button")[1];
        const date = document.querySelector('input[name="date"]');
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
        const winkIcon = screen.getByAltText("Wink icon");
        const time = document.querySelector('input[name="time"]');
        
        await userEvent.type(date,"2023-10-10");
        await userEvent.selectOptions(tiredStressSignal, "Rarely");
        await userEvent.selectOptions(sleepStressSignal, "Rarely");
        await userEvent.selectOptions(hungerStressSignal, "Rarely");
        await userEvent.selectOptions(overeatingStressSignal, "Rarely");
        await userEvent.selectOptions(depressedStressSignal, "Rarely");
        await userEvent.selectOptions(pressureStressSignal, "Rarely");
        await userEvent.selectOptions(attentionStressSignal, "Rarely");
        await userEvent.selectOptions(anxietyStressSignal, "Rarely");
        await userEvent.selectOptions(angerStressSignal, "Rarely");
        await userEvent.selectOptions(headacheStressSignal, "Rarely");
        await userEvent.type(notes, "Mood Notes");
        await userEvent.type(time, "10:00")
        await userEvent.click(winkIcon);
        await userEvent.click(submitButton);
        expect(createMoodJournal).toHaveBeenCalledTimes(1);
        expect(mockRouter).toHaveBeenCalledWith('/moodjournal');
    })
});


describe("User not logged in", () => {

    test("User redirected to login page", () =>{
        render(<AddMoodEntry/>);
        expect(mockRouter).toBeCalledWith('/login');
    })

    test("User is shown 403 forbidden error", async () =>{
        render(<AddMoodEntry/>);
        const errorText = await screen.findByText("Error 403 - Access Forbidden");
        const redirectionMessage = await screen.findByText("Redirecting to Login Page...");
        const loginButton = await screen.findByRole("button");

        expect(errorText).toBeInTheDocument();
        expect(redirectionMessage).toBeInTheDocument();
        expect(loginButton).toBeInTheDocument();
    })
})