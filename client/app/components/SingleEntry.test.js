import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import SingleEntry from '../components/SingleEntry';

describe( 'Result Component', () =>
{
  test('renders label and value', () => {
    const props = {
      label: 'Test Label',
      value: 'Test Value',
    };
    const label = 'Test Label';

      render( <SingleEntry { ...props } text={label}  /> );
    const labelText = screen.getByText(label);
    expect(labelText).toBeInTheDocument();
  } );
    
    test('renders label and value', () => {
    const props = {
      label: 'Test Label',
      value: 'Test Value',
    };
    const value = 'Test Value';

      render( <SingleEntry { ...props } text={value}  /> );
    const valueText = screen.getByText(value);
    expect(valueText).toBeInTheDocument();

  });

});
