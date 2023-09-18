import { useState } from 'react';
import Salad from './Salad';
import { useSaladsDispatch } from './SaladsContext';
import { useNavigate } from "react-router-dom";


function OptionsSingleSelector({options, value, onChange }) {
  return (
    <div>
    <select required value={value} onChange={onChange}>
      <option value=''>Gör ditt val</option>
      {options.map(([name, props]) => 
        <option value={name} key={name}>
          {name}, {props.price} kr
        </option>
      )}
    </select>
    <div className='invalid-feedback'>Du måste välja en</div>
    </div>
  )
}

function OptionsMultiSelector({options, values, onSelection}) {
  return(
    <div className="row h-200 p-5 bg-light border rounded-3">
      {options.map(([name, props]) => (
        <div className="col-4" key={name}>
          <label>
            <input
              type="checkbox"
              checked={Boolean(values[name])}
              onChange={() => onSelection(name)}
            />
            {name}, {props.price} kr
          </label>
        </div>
      )) }
    </div> 
    )  
}

function ComposeSalad({inventory, addSalad}) {
  let foundations = Object.entries(inventory).filter(([name, props]) => props.foundation);
  let proteins = Object.entries(inventory).filter(([name, props]) => props.protein);
  let extras = Object.entries(inventory).filter(([name, props]) => props.extra);
  let dressings = Object.entries(inventory).filter(([name, props]) => props.dressing);

  const [foundation, setFoundation] = useState(''); 
  const [protein, setProtein] = useState(''); 
  const [dressing, setDressing] = useState('');
  const [extra, setExtra] = useState({});

  const dispatch = useSaladsDispatch();
  const navigate = useNavigate();

  const handleFoundationSelection = (event) => {
    event.preventDefault();
    const selectedFoundation = event.target.value;
    setFoundation(selectedFoundation);
  } 
  const handleProteinSelection = (event) => {
    event.preventDefault();
    const selectedProtein = event.target.value;
    setProtein(selectedProtein);
  }

  const handleExtrasSelection = (selectedExtra) => {
    console.log('extraselection' + selectedExtra)
    if (extra[selectedExtra]) {
      // If extra is currently selected, remove it
      const updatedExtras = { ...extra };
      delete updatedExtras[selectedExtra];
      setExtra(updatedExtras);
    } else { 
      setExtra({...extra, [selectedExtra]: true})
    }

    // kolla på checkboxen's värde
  }

  const handleDressingSelection = (event) => {
    event.preventDefault();
    const selectedDressing = event.target.value;
    setDressing(selectedDressing);
  }

  const makeCeasarSalad = (event) => {
    event.preventDefault();
    setFoundation('Sallad');
    setProtein('Kycklingfilé');
    setExtra({
      Bacon: true,
      'Körsbärstomater': true,
      Krutonger: true,
      Parmesan: true
    });
    setDressing('Ceasardressing');
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (foundation === '' || protein === '' || dressing === '') {
      event.target.classList.add("was-validated");
      return null;
    }

    const salad = new Salad();
    salad.add(foundation, inventory[foundation])
    salad.add(protein, inventory[protein])
    salad.add(dressing, inventory[dressing])
    for (const [name, bool] of Object.entries(extra)) {
      if (bool) salad.add(name, inventory[name])
    }
    
    dispatch({type: 'added', salad: salad})

    // Reset the selections
    setFoundation('');
    setProtein('');
    setDressing('');
    setExtra({});
    event.target.classList.remove("was-validated");

    navigate(`/view-order/confirm/${salad.uuid}`)
  };

  return (
    <div className="container col-12">
      <div className="row h-200 p-5 bg-light border rounded-3">
        <h2>Välj innehållet i din sallad</h2>
        <form onSubmit={handleFormSubmit} noValidate>
          <h4 className="mt-4">Välj bas</h4>
          <OptionsSingleSelector 
            options={foundations} 
            value={foundation} 
            onChange={handleFoundationSelection}
          />
          <h4 className="mt-4">Välj protein</h4>
          <OptionsSingleSelector 
            options={proteins} 
            value={protein} 
            onChange={handleProteinSelection} 
          />
          <h4 className="mt-4">Välj extras</h4>
          <OptionsMultiSelector 
            options={extras} 
            values={extra} 
            onSelection={handleExtrasSelection} 
          />
          <h4 className="mt-4">Välj dressing</h4>
          <OptionsSingleSelector 
            options={dressings} 
            value={dressing} 
            onChange={handleDressingSelection} 
          />
          <button className="btn btn-primary align-self-end" type="button" onClick={makeCeasarSalad}>Ceasar</button>
          <button className="btn btn-primary align-self-end" type="submit">Lägg till i beställningen</button>
        </form>
      </div>
    </div>
  );
}
export default ComposeSalad;