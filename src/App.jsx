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
import EditSubService from "./Pages/EditSubService";
import AddForms from "./Pages/AddForms";
import ManageForm from "./Pages/ManageForm";
import EditForm from "./Pages/EditForm";
import ManageSubServices from "./Pages/ManageSubServices";
import AddSubService from "./Pages/AddSubService";
import NewRequest from "./Pages/service/NewRequest";
import AddStatus from "./Pages/status/AddStatus";
import ManageStatus from "./Pages/status/ManageStatus";
import EditStatus from "./Pages/status/EditStatus";
import ApplicationList from "./Pages/service/ApplicationList";
import AddDevice from "./Pages/device/AddDevice";
import AddActivity from "./Pages/activity/AddActivity";
import ManageActivity from "./Pages/activity/ManageActivity";
import AddSpecification from "./Pages/specification/AddSpecification";
import EditActivity from "./Pages/activity/EditActivity";
import ManageSpecification from "./Pages/specification/ManageSpecification";
import EditSpecification from "./Pages/specification/EditSpecification";
import MapSpecficationToActivity from "./Pages/activity/MapSpecficationToActivity";
import MapActivityToSubSerivce from "./Pages/activity/MapActivityToSerivce";
import RegisterFormStages from "./Pages/formStages/RegisterFormStages";
import ServiceLayout from "./DomainComponents/ServiceLayout";
import AddLab from "./Pages/lab/AddLab";
import ManageLab from "./Pages/lab/ManageLab";
import EditLab from "./Pages/lab/EditLab";
import LabInformation from "./Pages/lab/LabInformation";
import UserDocument from "./Pages/userDocuments/UserDocument";
import AddMandatoryDocument from "./Pages/mandatoryDocument/AddMandatoryDocument";
import ManageMandatoryDocument from "./Pages/mandatoryDocument/ManageMandatoryDocument";
import EditMandatoryDocument from "./Pages/mandatoryDocument/EditMandatoryDocument";
import SrfPreview from "./Pages/preview/SrfPreview";
import AddWorkFlow from "./Pages/WorkFlow/AddWorkFlow";
import ManageWorkFlow from "./Pages/WorkFlow/ManageWorkFlow";
import EditWorkFlow from "./Pages/WorkFlow/EditWorkFlow";
import AssignmentList from "./Pages/Task/AssignmentList";
import TaskView from "./Pages/Task/TaskView";

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
        <Route path="/edit-sub-service/:id" element={<EditSubService />} />
        <Route path={"/add-form"} element={<AddForms />} />
        <Route path={"/manage-form"} element={<ManageForm />} />
        <Route path={"/edit-form/:id"} element={<EditForm />} />
        <Route path={"/manage-sub-service"} element={<ManageSubServices />} />
        <Route path={"/add-sub-service"} element={<AddSubService />} />
        <Route path={"/new-request"} element={<NewRequest />} />
        <Route element={<ServiceLayout />}>
          <Route
            path={"/new-request/:referenceNumber"}
            element={<NewRequest />}
          />
          <Route
            path={"/add-device/:referenceNumber"}
            element={<AddDevice />}
          />
          <Route
            path={"/lab-information/:referenceNumber"}
            element={<LabInformation />}
          />
          <Route
            path={"/user-document/:referenceNumber"}
            element={<UserDocument />}
          />
          <Route
            path={"/srf-preview/:referenceNumber"}
            element={<SrfPreview />}
          />
        </Route>
        <Route path={"/add-status"} element={<AddStatus />} />
        <Route path={"/manage-status"} element={<ManageStatus />} />
        <Route path={"/edit-status/:id"} element={<EditStatus />} />
        <Route path={"/application-list"} element={<ApplicationList />} />
        <Route path={"/add-activity"} element={<AddActivity />} />
        <Route path={"/edit-activity/:id"} element={<EditActivity />} />
        <Route path={"/manage-activity"} element={<ManageActivity />} />
        <Route
          path={"/map-activity-to-sub-service"}
          element={<MapActivityToSubSerivce />}
        />
        <Route
          path={"/map-specification-to-activity/:id"}
          element={<MapSpecficationToActivity />}
        />
        <Route path={"/add-specification"} element={<AddSpecification />} />
        <Route
          path={"/edit-specification/:id"}
          element={<EditSpecification />}
        />
        <Route
          path={"/manage-specification"}
          element={<ManageSpecification />}
        />
        <Route
          path={"/register-form-stages"}
          element={<RegisterFormStages />}
        />
        <Route path={"/add-lab"} element={<AddLab />} />
        <Route path={"/manage-lab"} element={<ManageLab />} />
        <Route path={"/edit-lab/:id"} element={<EditLab />} />
        <Route
          path={"/add-mandatory-document"}
          element={<AddMandatoryDocument />}
        />
        <Route
          path={"/manage-mandatory-document"}
          element={<ManageMandatoryDocument />}
        />
        <Route
          path={"/edit-mandatory-document/:id"}
          element={<EditMandatoryDocument />}
        />
        <Route path={"/add-workflow"} element={<AddWorkFlow />} />
        <Route path={"/manage-workflow"} element={<ManageWorkFlow />} />
        <Route path={"/edit-workflow/:id"} element={<EditWorkFlow />} />
        <Route path={"/assignee-list"} element={<AssignmentList />} />
        <Route path={"/task-view/:referenceNumber"} element={<TaskView />} />
      </Route>
    </Routes>
  );
}

export default App;
