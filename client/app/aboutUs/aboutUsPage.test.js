import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

test("data is displayed correctly", async () => {
    render(<aboutUsPage/>);
    setTimeout(() => {
        expect(screen.getByText("Compass is a medical wellness app that targets specifically people above 40 years old who might be interested in having some type of assistance to keep their healthy habits and lifestyles. Compass offers features of managing medical reminders, booking appointments,tracking user’s medications and treatments all in one consolidated application. In addition, having features of medical journals such as diabetic journals allows some patients to easily note their daily doses and treatment details making them able to follow the history of their treatments and use it as a reference for themselves or to show to their medical professional. Additionally,with the speed dial fast option to contact relatives during some emergency situations patients would be able to contact their relatives in a faster and easier way. With many features compass aims for users to be healthier and function hassle free.")).toBeInTheDocument();
    }, 1000);
})

test("data is displayed correctly", async () => {
    render(<aboutUsPage/>);
    setTimeout(() => {
    expect(screen.getByText("About Compass")).toBeInTheDocument();

    }, 1000);
})
