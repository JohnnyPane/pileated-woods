import { createContext, useContext } from "react";

const AdminRouteContext = createContext(false);

export const AdminRouteProvider = ({ children }) => {
  return (
    <AdminRouteContext.Provider value={true}>
      {children}
    </AdminRouteContext.Provider>
  );
}

export const useIsAdminRoute = () => {
  return useContext(AdminRouteContext);
}