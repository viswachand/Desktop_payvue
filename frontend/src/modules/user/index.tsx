import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const UserList = lazy(() => import("./page/UserListPage"));
const UserFormPage = lazy(() => import("./page/UserForm"));


export const userRoutes: RouteObject[] = [
  {
    path: "/users",
    element: <UserList />,
  },
  {
    path: "/users/add",
    element: <UserFormPage />,
  },
  {
    path: "/users/edit/:id",
    element: <UserFormPage />,
  },
];