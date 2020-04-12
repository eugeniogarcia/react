import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  //El /i es para indicar que sea no sensible a mayusculas
  const linkElement = getByText(/Demostración de Herramientas de Test./i);
  expect(linkElement).toBeInTheDocument();
});
