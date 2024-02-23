import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useAuth } from "../../../contexts/AuthContext";
import { useUser } from "../../../contexts/UserContext";
import {useProp} from "../../../contexts/PropContext";
import Renders from "../Renders";

const mockRouter = jest.fn();
const mockUsePathname = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter,
        };
    },
    usePathname: () => mockUsePathname(),
}));

jest.mock("../../../contexts/AuthContext", () => {
    return {
        useAuth: jest.fn(),
    };
});

jest.mock("../../../contexts/UserContext", () => {
    return {
        useUser: jest.fn(),
    };
});

jest.mock("../../../contexts/PropContext", () => {
    return {
        useProp: jest.fn(),
    };
})

describe("About us page shown only to logged in users", () => {
    it("Error page is shown", async () => {
        useAuth.mockImplementation(() => {
            return {
                user: null,
            };
        });

        useUser.mockImplementation(() => {
            return {
                userInfo: null,
            };
        })

        useProp.mockImplementation(() => {
            return {
                handleLoading: jest.fn(),
                loading: false,
            };
        })

        render(<Renders><div>Some Text</div></Renders>);
        const errorMessage = await screen.findByText(
            "Error 403 - Access Forbidden"
        );
        const childText = screen.queryByText("Some Text");
        expect(errorMessage).toBeInTheDocument();
        expect(childText).not.toBeInTheDocument();

    });

    it("Error page is not shown", async () => {
        useAuth.mockImplementation(() => {
            return {
                user: { uid: "AKSODN#KLAD12nkvs" },
            };
        });

        useUser.mockImplementation(() => {
            return {
                userInfo: { uid: "AKSODN#KLAD12nkvs" },
            };
        });

        render(<Renders><div>Some Text</div></Renders>);
        const errorMessage = screen.queryByText("Error 403 - Access Forbidden");
        const childText = screen.queryByText("Some Text");
        expect(errorMessage).not.toBeInTheDocument();
        expect(childText).toBeInTheDocument();
    });
});
