const { render, screen, waitFor } = require('@testing-library/react');
require('@testing-library/jest-dom');
const Page = require('./page');
const Onboarding = require('./onboarding');
const NextImage = require('next/image');

describe('Page', () => {
  it('renders the NextImage component', () => {
    render(Page);
    const nextImageElement = screen.getByRole('img');
    expect(nextImageElement).toBeInTheDocument();
    expect(nextImageElement).toBeInstanceOf(NextImage);
  });

  it('renders the Onboarding component', async () => {
    render(Page);
    await waitFor(() => {
      const onboardingElement = screen.getByTestId('onboarding');
      expect(onboardingElement).toBeInTheDocument();
      expect(onboardingElement).toBeInstanceOf(Onboarding);
    }, { timeout: 3000 });
  });
});