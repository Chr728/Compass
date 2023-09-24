const { render, screen } = require('@testing-library/react');
require('@testing-library/jest-dom');
const Onboarding = require('./onboarding');
const NextImage = require('next/image');
const Button = require('../components/Button');
const Link = require('next/link');

describe('Onboarding', () => {
  it('renders the component', () => {
    render(Onboarding);
    const onboardingElement = screen.getByTestId('onboarding');
    expect(onboardingElement).toBeInTheDocument();
  });

  it('renders one of the NextImage components', () => {
    render(Onboarding);
    const nextImageElement = screen.getByRole('img');
    expect(nextImageElement).toBeInTheDocument();
    expect(nextImageElement).toBeInstanceOf(NextImage);
  });

  it('renders the Button component', () => {
    render(Onboarding);
    const buttonElement = screen.getByRole('button', { name: /Get Started/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeInstanceOf(Button);
  });

  it('links to the Login page', () => {
    render(Onboarding);
    const linkElement = screen.getByRole('link', { name: /Get Started/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/login');
    expect(linkElement).toContainElement(screen.getByRole('button', { name: /Get Started/i }));
  });
});