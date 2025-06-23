import { Navigate, Route, Routes, useNavigate } from "react-router";
import Home from "./Pages/Home";
import EditUserOld from "./Pages/EditUserOld";
import ViewUser from "./Pages/ViewUser";
import DeleteUser from "./Pages/DeleteUser";
import Login from "./Pages/Login";
import AddDistrict from "@/Pages/AddDistrict.jsx";
import AddCity from "@/Pages/AddCity.jsx";
import AddState from "@/Pages/AddState.jsx";
import MapDistrict from "@/Pages/MapDistrict.jsx";
import Layout from "./DomainComponents/Layout";
import AddMenu from "./Pages/AddMenu";
import ManageMenu from "./Pages/ManageMenu";
import AddUser from "./Pages/AddUser";
import EditUser from "./Pages/EditUser";
import AddRole from "@/Pages/AddRole.jsx";
import ManageUser from "./Pages/ManageUser";
import MapMenuToRole from "./Pages/MapMenuToRole";
import AddUserOld from "./Pages/AddUserOld";
import EditMenu from "./Pages/EditMenu";
import "./axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { validateToken } from "./state/userSlice";
import Cookies from "js-cookie";
import AddService from "./Pages/AddService";
import ManageService from "./Pages/ManageService";
import MapSubServiceToService from "./Pages/MapSubServiceToService";
import EditService from "./Pages/editService";
import AddSubService from "./Pages/AddSubService";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useSelector((state) => state.user);

  useEffect(() => {
    const token = Cookies.get("Authorization");
    if (token) {
      if (id === "") {
        dispatch(validateToken(token.split(" ")[1]));
      }
    } else {
      navigate("/login");
    }
  }, [id, dispatch, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={"/login"} />} />
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
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
        <Route path={"/manage-menu/:id"} element={<ManageMenu />} />
        <Route path={"/edit-menu/:id"} element={<EditMenu />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path={"/edit-user/:id"} element={<EditUser />} />
        <Route path={"/add-role"} element={<AddRole />} />
        <Route path={"/manage-user"} element={<ManageUser />} />
        <Route path={"/map-menu-to-role"} element={<MapMenuToRole />} />
        <Route path={"/add-service"} element={<AddService />} />
        <Route path={"/manage-service"} element={<ManageService />} />
        <Route
          path={"/map-sub-service-to-service/:id"}
          element={<MapSubServiceToService />}
        />
        <Route path={"/edit-service/:id"} element={<EditService />} />
        <Route path="/add-sub-service" element={<AddSubService />} />
      </Route>
    </Routes>
  );
}

export default App;
