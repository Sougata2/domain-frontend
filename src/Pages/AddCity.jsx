import {Label} from "@radix-ui/react-label";
import {Input} from "@/components/ui/input.jsx";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.jsx";
import {DomainAlert} from "@/DomainComponents/DomainAlert.jsx";
import axios from "axios";

function AddCity() {
    const initialValues = {
        cityName: "",
    }
    const initialErrorValues = {
        type: "", message: "",
    }

    const [formData, setFormData] = useState(initialValues);
    const [alert, setAlert] = useState(initialErrorValues);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await axios.get("http://localhost:8080/domain/city")
            setCities(response.data);
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
            const response = await axios.post("http://localhost:8080/domain/city", formData);
            setCities(prevState => [...prevState, response.data]);
            setAlert({type: "success", message: "City Add Successfully"});
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
                    <Label htmlFor={"cityName"}>City Name</Label>
                    <Input type={"text"} name={"cityName"} value={formData.cityName} onChange={handleOnChange}/>
                </div>
                <div className={"form-group"}>
                    <Button className={""}>Submit</Button>
                </div>
            </form>
            <div className={"mt-5"}>
                <div className={"flex justify-between align-items-center bg-slate-100 px-2.5 py-0.5 rounded"}>
                    <div>S.No</div>
                    <div>City Name</div>
                    <div>Actions</div>
                </div>
                {cities.length === 0 && <div className={"my-4 text-center"}>Add Cities</div>}
                <div className={"mt-2"}>
                    {cities.map((city, index) => (
                        <div key={city.id} className={"mb-2 flex justify-between align-items-center"}>
                            <div>{index + 1}</div>
                            <div>{city.cityName}</div>
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

export default AddCity;