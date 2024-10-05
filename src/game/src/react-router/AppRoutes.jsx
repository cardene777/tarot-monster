import { RouterProvider, createHashRouter } from "react-router-dom";
import App from "../App.jsx";
import List from "../pages/List.jsx";

const router = createHashRouter([
  { path: "/", element: <App /> },
  { path: "/list", element: <List /> },
]);
const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
