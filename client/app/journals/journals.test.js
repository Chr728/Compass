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
      const message1 = screen.getByText(/Record the activities that get you moving./i);
      expect(message1).toBeInTheDocument();
    });
  
    test("Weight Journals Message displayed", async () => {
     
      render(<Journals />);
      const message = screen.getByText(/Weight Journal/i);
      expect(message).toBeInTheDocument();
      const message1 = screen.getByText(/Log your changes in weight./i);
      expect(message1).toBeInTheDocument();
    });
  
    test("link redirects to weight journals page", async () => {  
      render(<Journals />);
      const linkElement = screen.getAllByRole("link")[1];
      expect(linkElement).toHaveAttribute("href", "/getWeightJournals");
  
  
    });

    test("link redirects to activity journals page", async () => {  
      render(<Journals />);
      const linkElement = screen.getAllByRole("link")[0];
      expect(linkElement).toHaveAttribute("href", "/getActivityJournals");
    });
  });






