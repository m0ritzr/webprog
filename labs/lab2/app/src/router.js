import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ComposeSalad from "./ComposeSalad";
import ViewOrder from "./ViewOrder";
import Confirmation from "./Confirmation";
import { Outlet } from "react-router-dom";

async function inventoryLoader() {
  const inventory = {};
  const categories = ["foundations", "proteins", "extras", "dressings"];

  await Promise.all(
    categories.map(async (category) => {
      const ingredients = await fetchIngredients(category);
      await Promise.all(
        ingredients.map(async (ingredient) => {
          const ingredientProps = await fetchIngredient(category, ingredient);
          inventory[ingredient] = ingredientProps;
        }),
      );
    }),
  );

  return inventory;
}

async function fetchIngredients(type) {
  return safeFetchJson(`http://localhost:8080/${type}/`);
}

async function fetchIngredient(type, ingredient) {
  return safeFetchJson(`http://localhost:8080/${type}/${ingredient}`);
}

async function safeFetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} returned status ${response.status}`);
  }
  return await response.json();
}

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <div className="container-fluid">
            <div className="row h-200 p-5 bg-light border rounded-3">
              <p>Välkommen till Salladsbaren!</p>
            </div>
          </div>
        ),
      },
      {
        path: "*",
        element: (
          <div className="container-fluid">
            <div className="row h-200 p-5 bg-light border rounded-3">
              <p>Sidan kunde inte hittas.</p>
            </div>
          </div>
        ),
      },
      {
        path: "compose-salad",
        loader: inventoryLoader,
        element: <ComposeSalad />,
      },
      {
        path: "view-order",
        element: (
          <div>
            <Outlet />
            <ViewOrder />
          </div>
        ),
        children: [
          {
            path: "confirm/:saladUuid",
            element: <Confirmation />,
          },
        ],
      },
    ],
  },
]);

export default router;
