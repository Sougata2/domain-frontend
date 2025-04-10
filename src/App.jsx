import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./Pages/Home";
import EditUser from "./Pages/EditUser";
import ViewUser from "./Pages/ViewUser";
import AddUser from "./Pages/AddUser";
import DeleteUser from "./Pages/DeleteUser";
import {Button} from "./components/ui/button";
import {useTranslation} from "react-i18next";
import Login from "./Pages/Login";
import AddDistrict from "@/Pages/AddDistrict.jsx";
import AddCity from "@/Pages/AddCity.jsx";
import AddState from "@/Pages/AddState.jsx";

function App() {
    const {t, i18n} = useTranslation();
    return (
        <div>
            <div className={"flex"}>
                <div className={"w-full text-center py-4"}>{t("welcome")}</div>
                <div className="flex w-full justify-center gap-2.5">
                    <Button
                        className={"bg-slate-400 hover:bg-slate-500"}
                        onClick={() => i18n.changeLanguage("en")}
                    >
                        English
                    </Button>
                    <Button
                        className={"bg-slate-400 hover:bg-slate-500"}
                        onClick={() => i18n.changeLanguage("hi")}
                    >
                        Hindi
                    </Button>
                </div>
            </div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="edit/:id" element={<EditUser/>}/>
                    <Route path="user/:id" element={<ViewUser/>}/>
                    <Route path="add" element={<AddUser/>}/>
                    <Route path="delete/:id" element={<DeleteUser/>}/>
                    <Route path={"add-district"} element={<AddDistrict/>}/>
                    <Route path={"add-city"} element={<AddCity/>}/>
                    <Route path={"add-state"} element={<AddState/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
