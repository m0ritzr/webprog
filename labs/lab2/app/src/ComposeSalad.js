import { useState } from 'react';
import Salad from './Salad';

function OptionsSingleSelector({options, value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map(([name, props]) => 
        <option value={name} key={name}>
          {name}, {props.price} kr
        </option>
      )}
    </select>
  )
}

function OptionsMultiSelector({options, values, onSelection}) {
  console.log(JSON.stringify(values));
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

  const [foundation, setFoundation] = useState('Pasta'); 
  const [protein, setProtein] = useState('Norsk fjordlax'); 
  const [dressing, setDressing] = useState('Pesto');
  const [extra, setExtra] = useState({Bacon: true, Fetaost: true});

  const handleFoundationSelection = (selectedFoundation) => {
    setFoundation(selectedFoundation);
  }
  const handleProteinSelection = (selectedProtein) => {
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
  }

  const handleDressingSelection = (selectedDressing) => {
    setDressing(selectedDressing);
  }

  const makeCeasarSalad = (e) => {
    e.preventDefault();setFoundation('Sallad');
    setProtein('Kycklingfilé');
    setExtra({
      Bacon: true,
      'Körsbärstomater': true,
      Krutonger: true,
      Parmesan: true
    });
    setDressing('Ceasardressing');
  }


  const handleFormSubmit = (e) => {
    e.preventDefault();
    const salad = new Salad();
    salad.add(foundation, inventory[foundation])
    salad.add(protein, inventory[protein])
    salad.add(dressing, inventory[dressing])
    for (const [name, bool] of Object.entries(extra)) {
      if (bool) salad.add(name, inventory[name])
    }
    addSalad(salad);
    // Reset the selections
    setFoundation('Sallad');
    setProtein('Kycklingfilé');
    setDressing('Ceasardressing');
    setExtra({});
  };

  return (
    <div className="container col-12">
      <div className="row h-200 p-5 bg-light border rounded-3">
        <h2>Välj innehållet i din sallad</h2>
        <form onSubmit={handleFormSubmit}>
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
          <button className="btn btn-primary align-self-end" onClick={makeCeasarSalad}>Ceasar</button>
          <button className="btn btn-primary align-self-end" type="submit">Lägg till i beställningen</button>
        </form>
      </div>
    </div>
  );
}
export default ComposeSalad;