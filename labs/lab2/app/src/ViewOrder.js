import { useSalads } from "./SaladsContext";
import { useSaladsDispatch } from "./SaladsContext";
import { useToast } from "./ToastContext";
import { useNavigate } from "react-router-dom";

export function SaladItemDisplay({ salad, component }) {
  var label = "";
  switch (component) {
    case "foundation":
      label = "Bas:";
      break;
    case "protein":
      label = "Protein:";
      break;
    case "extra":
      label = "Extras:";
      break;
    case "dressing":
      label = "Dressing:";
      break;
    default:
      break;
  }
  return (
    <div className="d-flex align-items-center">
      <b className="mx-2">{label}</b>
      <p className="mb-0">
        {Object.entries(salad.ingredients)
          .filter(([ing, props]) => props[component] === true)
          .reduce((string, [ing, props]) => string + ", " + ing, "")
          .slice(2)}
      </p>
    </div>
  );
}

function SaladDisplay({ salad, removeSalad }) {
  return (
    <div className="d-flex align-items-center justify-content-between">
      <div className="d-flex flex-column flex-grow-1">
        <SaladItemDisplay salad={salad} component={"foundation"} />
        <SaladItemDisplay salad={salad} component={"protein"} />
        <SaladItemDisplay salad={salad} component={"extra"} />
        <SaladItemDisplay salad={salad} component={"dressing"} />
      </div>
      <p className="mb-0 mx-5">Total: {salad.getPrice()} kr</p>
      <div className="d-flex align-items-center">
        <button className="btn btn-outline-primary mr-2">Edit</button>
        <button
          onClick={() => removeSalad(salad)}
          className="btn btn-outline-danger"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function ViewOrder() {
  const shoppingCart = useSalads();
  const dispatch = useSaladsDispatch();
  const { addToast } = useToast(); // Use the useToast hook
  const navigate = useNavigate();

  const removeSalad = (salad) => {
    // Dispatch the 'removed' action to remove the salad
    dispatch({ type: "removed", salad });
  };

  function getPriceOfOrder() {
    return shoppingCart.length === 0
      ? 0
      : shoppingCart
          .map((salad) => salad.getPrice())
          .reduce((sum, price) => sum + price);
  }

  async function handlePlaceOrder() {
    const payload = shoppingCart.map((salad) => Object.keys(salad.ingredients));
    console.log(payload);

    const req = new Request("http://localhost:8080/orders", {
      method: "POST",
      body: JSON.stringify(payload), // Convert payload to JSON string
      headers: {
        "Content-Type": "application/json", // Set Content-Type header as an object
      },
    });

    try {
      const res = await fetch(req);
      if (res.ok) {
        const data = await res.json();
        addToast({
          id: `order-toast-${data.uuid}`,
          title: `Beställningen ${data.uuid} har lagts`,
          message: `Total: ${data.price} kr`,
          type: "alert-success",
        });
        navigate(`/view-order`);
        dispatch({ type: "remove_all" });
      } else {
        addToast({
          id: `order-toast-failed`,
          title: `Det gick inte att lägga beställningen`,
          message: `Försök igen senare, ${res.status}`,
          type: "alert-failure",
        });
        console.error("Failed to fetch data:", res.status);
      }
    } catch (error) {
      addToast({
        id: `order-error-${error}`,
        title: `Det gick inte att lägga beställningen`,
        message: `Försök igen senare, ${error}`,
        type: "alert-failure",
      });
    }
  }

  return (
    <div className="container-fluid">
      <div className="row h-200 p-5 bg-light border rounded-3">
        <h2>Din beställning</h2>
        {shoppingCart.length === 0 ? (
          <p>Plocka ihop en sallad för att lägga till den i din beställning</p>
        ) : (
          <></>
        )}
        <ul className="w-100">
          {shoppingCart.map((salad) => (
            <li key={salad.uuid} className="mb-3">
              <SaladDisplay salad={salad} removeSalad={removeSalad} />
            </li>
          ))}
        </ul>
        <button
          className="btn btn-outline-primary mr-2"
          onClick={handlePlaceOrder}
        >
          Lägg beställningen - {getPriceOfOrder()} kr
        </button>
      </div>
      <div className="position-fixed bottom-0 end-0 p-3"></div>
    </div>
  );
}

export default ViewOrder;
