import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input.jsx";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import axios from "axios";
import { toast } from "sonner";

function AddState() {
  const initialValues = {
    stateName: "",
  };

  const [formData, setFormData] = useState(initialValues);
  const [states, setStates] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get("http://localhost:8080/domain/state");
      setStates(response.data);
    })();
  }, []);

  function handleOnChange(e) {
    const { name, value } = e.target;
    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  async function handleOnSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/domain/state",
        formData
      );
      setStates((prevState) => [...prevState, response.data]);
      toast.success("Success", { description: "State Added!" });
      setFormData(initialValues);
    } catch (err) {
      toast.error("Error", { description: err.message });
    }
  }

  return (
    <div className={"container w-1/3 mx-auto"}>
      <form className={"flex flex-col gap-2"} onSubmit={handleOnSubmit}>
        <div className={"form-group"}>
          <Label htmlFor={"stateName"}>State Name</Label>
          <Input
            type={"text"}
            name={"stateName"}
            value={formData.stateName}
            onChange={handleOnChange}
          />
        </div>
        <div className={"form-group"}>
          <Button className={""}>Submit</Button>
        </div>
      </form>
      <div className={"mt-5"}>
        <div
          className={
            "flex justify-between align-items-center bg-slate-100 px-2.5 py-0.5 rounded"
          }
        >
          <div>S.No</div>
          <div>State Name</div>
          <div>Actions</div>
        </div>
        {states.length === 0 && (
          <div className={"my-4 text-center"}>Add States</div>
        )}
        <div className={"mt-2"}>
          {states.map((state, index) => (
            <div
              key={state.id}
              className={"mb-2 flex justify-between align-items-center"}
            >
              <div>{index + 1}</div>
              <div>{state.stateName}</div>
              <div className={"flex gap-1 justify-end"}>
                <Button
                  className={
                    "bg-emerald-400 hover:bg-emerald-500 text-emerald-700"
                  }
                ></Button>
                <Button
                  className={"bg-red-400 hover:bg-red-500 text-red-700"}
                ></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddState;
