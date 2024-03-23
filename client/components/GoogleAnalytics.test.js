import { render } from '@testing-library/react';
import GoogleAnalytics from './GoogleAnalytics';

describe('GoogleAnalytics', () => {
  it('renders the Google Analytics scripts', () => {
    render(<GoogleAnalytics />);

    const script1 = document.querySelector(`script[src="https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}"]`);
    expect(script1).not.toBeNull();

    const script2 = document.querySelector('script#google-analytics');
    expect(script2).not.toBeNull();
  });
});