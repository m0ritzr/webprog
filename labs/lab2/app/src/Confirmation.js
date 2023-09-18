import React from 'react';
import { useParams } from 'react-router-dom';
import { useSalads } from './SaladsContext'; 

function Confirmation() {
  const { saladUuid } = useParams();
  const salads = useSalads(); 

  // Find the salad with the matching UUID
  const confirmedSalad = salads.find((salad) => salad.uuid === saladUuid);

  return (
    <div className="container-fluid">
      <div className="row h-200 p-5 bg-light border rounded-3">
        <h2>Confirmation for Salad</h2>
        {confirmedSalad ? (
          <>
            <p>Salad: {Object.keys(confirmedSalad.ingredients).join(', ')}</p>
            <p>Total Price: {confirmedSalad.getPrice()} kr</p>
          </>
        ) : (
          <p>Salad not found with ID: {saladUuid}</p>
        )}
      </div>
    </div>
  );
}

export default Confirmation;
