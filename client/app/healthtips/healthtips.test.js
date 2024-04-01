import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Healthtips from "./page";
import { getHealthTips } from "../http/healthTipsAPI";
import { act } from "react-dom/test-utils";
import { useRouter } from "next/navigation";

//Mock useRouter from next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

//Mock user
jest.mock("../contexts/UserContext", () => {
  return {
    useUser: () => {
      return {
        userInfo: {
          uid: "1",
        },
      };
    },
  };
});

// Mocking useProp hook
jest.mock("../contexts/PropContext", () => ({
  __esModule: true,
  useProp: jest.fn(() => ({
    handlePopUp: jest.fn(),
  })),
}));

// Mocking getHealthTips function
jest.mock("../http/healthTipsAPI", () => {
  return {
    getHealthTips: jest.fn(),
  };
});

// Mock logger
const logger = require("../../logger");
jest.mock("../../logger", () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
}));

// Mock alert
global.alert = jest.fn();

//Mock back from next Router
const mockRouter = jest.fn();

//useRouter mock behaviour before executing tests
beforeAll(() => {
  useRouter.mockReturnValue({
    query: {},
    push: mockRouter,
  });
});

// describe("Healthtips failure", () => {
//   test("displays warning and alert if user information not found", async () => {
//     render(<Healthtips />);
//     expect(logger.warn).toHaveBeenCalledWith("User not found.");
//     expect(global.alert).toHaveBeenCalledWith("User not found.");
//   });
// });

describe("Healthtips success", () => {
  test("renders content properly", async () => {
    const fakeData = {
      data: {
        angertips:
          '{"tip1":"Take some timeout during the day","tip2":"Take your time"}',
        anxietytips:
          '{"tip1":"Take deep breaths","tip2":"Practice mindfulness"}',
        attentiontips:
          '{"tip1":"Break tasks into smaller steps","tip2":"Use timers"}',
        depressiontips:
          '{"tip1":"Stay connected with loved ones","tip2":"Engage in activities you enjoy"}',
        overwhelmedtips:
          '{"tip1":"Prioritize tasks","tip2":"Delegate when possible"}',
        sleeptips:
          '{"tip1":"Establish a bedtime routine","tip2":"Limit caffeine intake"}',
        tiredtips: '{"tip1":"Take short breaks","tip2":"Stay hydrated"}',
      },
    };

    getHealthTips.mockResolvedValue(fakeData);

    render(<Healthtips />);
    const title = screen.getByTestId("health-tips-title");
    const bodyText = screen.getByTestId("health-tips-body");

    expect(title).toBeInTheDocument();
    expect(bodyText).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(getHealthTips).toHaveBeenCalled();
    });

    const subtitleText = screen.getByTestId("health-tips-subtitle");
    const rectangleImage = screen.getByAltText("Rectangle");
    const humanImage = screen.getByAltText("Human pointing upward");
    expect(rectangleImage).toBeInTheDocument();
    expect(humanImage).toBeInTheDocument();
    expect(subtitleText).toBeInTheDocument();

    await waitFor(() => {
      // Check if tips are rendered properly
      const possibleTips = [
        "Take some timeout during the day",
        "Take your time",
        "Take deep breaths",
        "Practice mindfulness",
        "Break tasks into smaller steps",
        "Use timers",
        "Stay connected with loved ones",
        "Engage in activities you enjoy",
        "Prioritize tasks",
        "Delegate when possible",
        "Establish a bedtime routine",
        "Limit caffeine intake",
        "Take short breaks",
        "Stay hydrated",
      ];

      const tips = screen.getAllByText((content, element) => {
        // Check if the tip matches any of the possible tips
        return possibleTips.some((possibleTip) =>
          content.includes(possibleTip)
        );
      });

      expect(tips.length).toBeGreaterThan(0); // Ensure at least one tip is found
    });
  });

  test("Routes to health page on button click", () => {
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));

    render(<Healthtips />);
    const backButton = screen.getByText("Health Tips");

    fireEvent.click(backButton);
    expect(mockPush).toHaveBeenCalledWith("/health");
  });
});
