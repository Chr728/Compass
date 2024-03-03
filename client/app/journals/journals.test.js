import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Journals from "../journals/page";
import { useRouter } from "next/router";
import { act } from "react-dom/test-utils";


const mockRouter= jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));
 

  describe("Proper displayment of all journals", () => {
    test("Activity Journals Message displayed", async () => {
      
  
      render(<Journals />);
      const message = screen.getByText(/Activity Journal/i);
      expect(message).toBeInTheDocument();
      const message1 = screen.getByText(/Record what gets you moving./i);
      expect(message1).toBeInTheDocument();
    });
  
    test("Weight Journals Message displayed", async () => {
     
      render(<Journals />);
      const message = screen.getByText(/Weight Journal/i);
      expect(message).toBeInTheDocument();
      const message1 = screen.getByText(/Log your changes in weight./i);
      expect(message1).toBeInTheDocument();
    });


     test("Mood Journals Message displayed", async () => {
     
      render(<Journals />);
      const message = screen.getByText(/Mood Journal/i);
      expect(message).toBeInTheDocument();
      const message1 = screen.getByText(/Document what changes your mood./i);
      expect(message1).toBeInTheDocument();
    });
  
    test("Food Journals Message displayed", async () => {
     
      render(<Journals />);
      const message = screen.getByText(/Food Intake Journal/i);
      expect(message).toBeInTheDocument();
      const message1 = screen.getByText(/Keep track of what you eat./i);
      expect(message1).toBeInTheDocument();
    });

     test("Diabetic Journals Message displayed", async () => {
     
      render(<Journals />);
      const message = screen.getByText(/Diabetic Journal/i);
      expect(message).toBeInTheDocument();
      const message1 = screen.getByText(/Monitor your insulin and glucose./i);
      expect(message1).toBeInTheDocument();
    });

    test("Blood Pressure Journals Message displayed", async () => {
     
      render(<Journals />);
      const message = screen.getByText(/Blood Pressure Journal/i);
      expect(message).toBeInTheDocument();
      const message1 = screen.getByText(/Log your blood pressure./i);
      expect(message1).toBeInTheDocument();
    });

    test("link redirects to weight journals page", async () => {  
      render(<Journals />);
      const linkElement = screen.getAllByRole("link")[2];
      expect(linkElement).toHaveAttribute("href", "/getWeightJournals");
  
  
    });

    test("link redirects to activity journals page", async () => {  
      render(<Journals />);
      const linkElement = screen.getAllByRole("link")[1];
      expect(linkElement).toHaveAttribute("href", "/getActivityJournals");
    });


    test("link redirects to diabetic journals page", async () => {  
      render(<Journals />);
      const linkElement = screen.getAllByRole("link")[0];
      expect(linkElement).toHaveAttribute("href", "/getDiabeticJournals");
    });

     test("link redirects to mood journals page", async () => {  
      render(<Journals />);
      const linkElement = screen.getAllByRole("link")[4];
      expect(linkElement).toHaveAttribute("href", "/moodjournal");
    });


    test("link redirects to food journals page", async () => {  
      render(<Journals />);
      const linkElement = screen.getAllByRole("link")[3];
      expect(linkElement).toHaveAttribute("href", "/getFoodJournals");
    });

    test("link redirects to blood pressure journals page", async () => {  
      render(<Journals />);
      const linkElement = screen.getAllByRole("link")[5];
      expect(linkElement).toHaveAttribute("href", "/getBloodPressureJournals");
    });
  });







