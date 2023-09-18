import { createBrowserRouter } from "react-router-dom";
import App from './App';
import inventory from "./inventory.mjs";
import ComposeSalad from "./ComposeSalad";
import ViewOrder from "./ViewOrder";
import Confirmation from "./Confirmation";
import { Outlet } from "react-router-dom";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "",
        element: <div className="container-fluid">
                    <div className="row h-200 p-5 bg-light border rounded-3">
                      <p>Välkommen till Salladsbaren!</p>
                    </div>
                  </div>
      },
      {
        path: "*",
        element: <div className="container-fluid">
                    <div className="row h-200 p-5 bg-light border rounded-3">
                      <p>Sidan kunde inte hittas.</p>
                    </div>
                  </div>
      },
      {
        path: "compose-salad",
        element: <ComposeSalad inventory={inventory} />
      },
      {
        path: "view-order",
        element: <div><Outlet/><ViewOrder/></div>,
        children: [
          {
            path: "confirm/:saladUuid",
            element: <Confirmation />
          }
        ]
      }
    ]
  },
]);
export default router