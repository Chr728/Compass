import { render, screen, waitFor } from '@testing-library/react';
import Page from './page';
import Onboarding from '../components/Onboarding';

describe('Page', () => {
  it('renders the NextImage component', () => {
    render(<Page />);
    const nextImageElement = screen.getByRole('img');
    expect(nextImageElement).toBeInTheDocument();
  });

  it('renders the Onboarding component', async () => {
    render(<Page />);
    await waitFor(() => {
      const onboardingElement = screen.getByTestId('onboarding');
      expect(onboardingElement).toBeInTheDocument();
      expect(onboardingElement).toBeInstanceOf(Onboarding);
    }, { timeout: 3000 });
  });
});