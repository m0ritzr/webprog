import { createContext, useContext, useReducer } from 'react';

const SaladsContext = createContext(null);

const SaladsDispatchContext = createContext(null);

export function SaladsProvider({ children }) {
  const [salads, dispatch] = useReducer(
    saladsReducer,
    initialSalads
  );

  return (
    <SaladsContext.Provider value={salads}>
      <SaladsDispatchContext.Provider value={dispatch}>
        {children}
      </SaladsDispatchContext.Provider>
    </SaladsContext.Provider>
  );
}

export function useSalads() {
  return useContext(SaladsContext);
}

export function useSaladsDispatch() {
  return useContext(SaladsDispatchContext);
}

function saladsReducer(salads, action) {
  switch (action.type) {
    case 'added': {
      return [...salads, action.salad];
    }
    case 'removed': {
      return salads.filter(s => s.uuid !== action.salad.uuid);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialSalads = [
];
