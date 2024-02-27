import { render } from '@testing-library/react';
import LocateClinic from './clinicLocator';

describe('LocateClinic', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it('renders enable location button when no location is stored', () => {
        const { getByText } = render(<LocateClinic />);
        expect(getByText('Enable Location')).toBeInTheDocument();
    });


});
