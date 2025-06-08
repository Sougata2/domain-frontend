import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./Pages/Home";
import EditUserOld from "./Pages/EditUserOld";
import ViewUser from "./Pages/ViewUser";
import DeleteUser from "./Pages/DeleteUser";
import Login from "./Pages/Login";
import AddDistrict from "@/Pages/AddDistrict.jsx";
import AddCity from "@/Pages/AddCity.jsx";
import AddState from "@/Pages/AddState.jsx";
import MapDistrict from "@/Pages/MapDistrict.jsx";
import { Toaster } from "@/components/ui/sonner";
import Layout from "./DomainComponents/Layout";
import AddMenu from "./Pages/AddMenu";
import EditMenu from "./Pages/EditMenu";
import AddUser from "./Pages/AddUser";
import EditUser from "./Pages/EditUser";
import AddRole from "@/Pages/AddRole.jsx";
import ManageUser from "./Pages/ManageUser";
import MapMenuToRole from "./Pages/MapMenuToRole";
import AddUserOld from "./Pages/AddUserOld";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster position="bottom-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="edit/:id" element={<EditUserOld />} />
            <Route path="user/:id" element={<ViewUser />} />
            <Route path="add" element={<AddUserOld />} />
            <Route path="delete/:id" element={<DeleteUser />} />
            <Route path={"add-district"} element={<AddDistrict />} />
            <Route path={"add-city"} element={<AddCity />} />
            <Route path={"add-state"} element={<AddState />} />
            <Route path={"/map-district"} element={<MapDistrict />} />
            <Route path={"/add-menu"} element={<AddMenu />} />
            <Route path={"/edit-menu/:id"} element={<EditMenu />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path={"/edit-user/:id"} element={<EditUser />} />
            <Route path={"/add-role"} element={<AddRole />} />
            <Route path={"/manage-user"} element={<ManageUser />} />
            <Route path={"/map-menu-to-role"} element={<MapMenuToRole />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
