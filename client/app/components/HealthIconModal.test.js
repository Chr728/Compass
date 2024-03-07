import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import HealthIconModal from './HealthIconModal';

jest.mock('healthicons-react/dist/filled', () => ({
  Heart: () => <svg data-testid="icon-Heart" />,
  Tb: () => <svg data-testid="icon-Tb" />,
  Tooth: () => <svg data-testid="icon-Tooth" />,
  Nose: () => <svg data-testid="icon-Nose" />,
  Ear: () => <svg data-testid="icon-Ear" />,
  Eye: () => <svg data-testid="icon-Eye" />,
  Kidneys: () => <svg data-testid="icon-Kidneys" />,
  FemaleReproductiveSystem: () => (
    <svg data-testid="icon-FemaleReproductiveSystem" />
  ),
  Gallbladder: () => <svg data-testid="icon-Gallbladder" />,
  Wheelchair: () => <svg data-testid="icon-Wheelchair" />,
  Dna: () => <svg data-testid="icon-Dna" />,
  ICertificatePaper: () => <svg data-testid="icon-ICertificatePaper" />,
  IntestinalPain: () => <svg data-testid="icon-IntestinalPain" />,
  Body: () => <svg data-testid="icon-Body" />,
  ChildCognition: () => <svg data-testid="icon-ChildCognition" />,
  Joints: () => <svg data-testid="icon-Joints" />,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('HealthIconModal', () => {
  test('renders correctly', () => {
    render(
      <HealthIconModal isOpen={true} onClose={() => {}} onSelect={() => {}} />
    );
    const modalElement = screen.getByText('Folder Icon');
    expect(modalElement).toBeInTheDocument();
  });

  test('calls the onSelect function when an icon is clicked', () => {
    const handleSelect = jest.fn();
    render(
      <HealthIconModal
        isOpen={true}
        onClose={() => {}}
        onSelect={handleSelect}
      />
    );
    const iconElement = screen.getByTestId('icon-Heart');
    fireEvent.click(iconElement);
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  test('calls the onClose function when clicking outside the modal', () => {
    const handleClose = jest.fn();
    render(
      <div data-testid="modal-overlay" onClick={handleClose}>
        <HealthIconModal
          isOpen={true}
          onClose={handleClose}
          onSelect={() => {}}
        />
      </div>
    );

    const overlayElement = screen.getByTestId('modal-overlay');
    fireEvent.click(overlayElement);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
