import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./Pages/Home";
import EditUser from "./Pages/EditUser";
import ViewUser from "./Pages/ViewUser";
import AddUser from "./Pages/AddUser";
import DeleteUser from "./Pages/DeleteUser";
import Login from "./Pages/Login";
import AddDistrict from "@/Pages/AddDistrict.jsx";
import AddCity from "@/Pages/AddCity.jsx";
import AddState from "@/Pages/AddState.jsx";
import MapDistrict from "@/Pages/MapDistrict.jsx";
import { Toaster } from "@/components/ui/sonner";
import Layout from "./DomainComponents/Layout";
import AddMenu from "./Pages/AddMenu";

function App() {
  return (
    <div>
      <Toaster position="bottom-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="edit/:id" element={<EditUser />} />
            <Route path="user/:id" element={<ViewUser />} />
            <Route path="add" element={<AddUser />} />
            <Route path="delete/:id" element={<DeleteUser />} />
            <Route path={"add-district"} element={<AddDistrict />} />
            <Route path={"add-city"} element={<AddCity />} />
            <Route path={"add-state"} element={<AddState />} />
            <Route path={"/map-district"} element={<MapDistrict />} />
            <Route path={"/add-menu"} element={<AddMenu />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
