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

    render( <FormLabel { ...props }/> );
    const htmlForText = screen.getByText(props.label);
    expect(htmlForText).toBeInTheDocument();
    expect(htmlForText).toHaveAttribute('for', props.htmlFor);
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
