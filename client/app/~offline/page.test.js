import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import  Offline from './page'

it("Page is displayed correctly to the user", () => {
    render(<Offline/>);
    const offlineText = screen.getByText("You are currently offline or the page is down....");
    const checkConnectionTest = screen.getByText("double check your connection!");

    expect(offlineText).toBeInTheDocument();
    expect(checkConnectionTest).toBeInTheDocument();
})