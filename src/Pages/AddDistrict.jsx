import {Label} from "@radix-ui/react-label";
import {Input} from "@/components/ui/input.jsx";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.jsx";
import {DomainAlert} from "@/DomainComponents/DomainAlert.jsx";
import axios from "axios";

function AddDistrict() {
    const initialValues = {
        distName: "",
    }
    const initialErrorValues = {
        type: "", message: "",
    }

    const [formData, setFormData] = useState(initialValues);
    const [alert, setAlert] = useState(initialErrorValues);
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await axios.get("http://localhost:8080/domain/district")
            setDistricts(response.data);
        })();
    }, [])

    function handleOnChange(e) {
        const {name, value} = e.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    async function handleOnSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/domain/district", formData);
            setDistricts(prevState => [...prevState, response.data]);
            setAlert({type: "success", message: "District Add Successfully"});
            setFormData(initialValues);
        } catch (err) {
            setAlert({type: "error", message: err.message});
        }
    }

    return (
        <div className={"container w-1/3 mx-auto"}>
            <div className="me-auto">
                {alert.type && <DomainAlert {...alert} />}
            </div>
            <form className={"flex flex-col gap-2"} onSubmit={handleOnSubmit}>
                <div className={"form-group"}>
                    <Label htmlFor={"distName"}>District Name</Label>
                    <Input type={"text"} name={"distName"} value={formData.distName} onChange={handleOnChange}/>
                </div>
                <div className={"form-group"}>
                    <Button className={""}>Submit</Button>
                </div>
            </form>
            <div className={"mt-5"}>
                <div className={"flex justify-between align-items-center bg-slate-100 px-2.5 py-0.5 rounded"}>
                    <div>S.No</div>
                    <div>District Name</div>
                    <div>Actions</div>
                </div>
                {districts.length === 0 && <div className={"my-4 text-center"}>Add Districts</div>}
                <div className={"mt-2"}>
                    {districts.map((district, index) => (
                        <div key={district.id} className={"mb-2 flex justify-between align-items-center"}>
                            <div>{index + 1}</div>
                            <div>{district.distName}</div>
                            <div className={"flex gap-1 justify-end"}>
                                <Button
                                    className={"bg-emerald-400 hover:bg-emerald-500 text-emerald-700"}></Button>
                                <Button className={"bg-red-400 hover:bg-red-500 text-red-700"}></Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AddDistrict;