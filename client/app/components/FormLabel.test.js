import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import FormLabel from '../components/FormLabel';

describe( 'Result Component', () =>
{
  test('renders htmlfor and label', () => {
    const props = {
      htmlFor: 'date',
      label: 'Test Label',
    };
    const htmlFor = 'date';

      render( <FormLabel { ...props } text={ htmlFor } /> );
      const htmlForText = screen.getByText(htmlFor);
    expect(htmlForText).toBeInTheDocument();
  } );
    
    test('renders htmlfor and label', () => {
    const props = {
      htmlFor: 'date',
      label: 'Test Label',
    };
    const label = 'Test Label';

      render( <FormLabel { ...props } text={label}  /> );
    const labelText = screen.getByText(label);
    expect(labelText).toBeInTheDocument();

  });

});
