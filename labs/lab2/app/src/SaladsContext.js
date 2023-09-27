import { createContext, useContext, useReducer } from "react";
import Salad from "./Salad";

const SaladsContext = createContext(null);

const SaladsDispatchContext = createContext(null);

export function SaladsProvider({ children }) {
  const [salads, dispatch] = useReducer(saladsReducer, initialSalads);

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
  var saladsList = salads;
  switch (action.type) {
    case "added": {
      saladsList = [...salads, action.salad];
      break;
    }
    case "removed": {
      saladsList = salads.filter((s) => s.uuid !== action.salad.uuid);
      break;
    }
    case "remove_all": {
      saladsList = [];
      break;
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
  localStorage.setItem("salads", JSON.stringify(saladsList));
  return saladsList;
}

const initialSalads = fetchSaladsFromLocalStorage();

function fetchSaladsFromLocalStorage() {
  if (!localStorage.getItem("salads")) {
    return [];
  } else {
    return Salad.parse(localStorage.getItem("salads"));
  }
}
