import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

export default function EditMenu() {
  const initialValue = {
    id: "",
    name: "",
    url: "",
  };
  const { id } = useParams();
  const [formData, setFormData] = useState(initialValue);
  const [isSubMenu, setIsSubMenu] = useState(false);

  const fetchMenuById = useCallback(async () => {
    try {
      const response = await axios.get("/menu/" + id);
      setFormData(response.data);
      if (response.data.url !== "") setIsSubMenu(true);
    } catch (e) {
      toast.error("Error", { description: e.message });
    }
  }, [id]);

  useEffect(() => {
    (async () => {
      await fetchMenuById();
    })();
  }, [fetchMenuById]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        id: formData.id,
        name: formData.name,
        url: formData.url,
      };
      const _ = await axios.put("/menu", payload);
      await fetchMenuById();

      toast.success("Success", { description: "Menu Updated" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  return (
    <div className={"flex justify-center items-center"}>
      <form className={"flex flex-col w-md gap-4.5"} onSubmit={onSubmit}>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"name"}>Menu</Label>
          <Input
            name="name"
            placeholder={"Menu Name"}
            value={formData.name}
            id={"name"}
            onChange={onChange}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isSubItem"
            checked={isSubMenu}
            onCheckedChange={() => {
              setIsSubMenu((prevState) => !prevState);
              formData.url = "";
            }}
          />
          <label
            htmlFor="isSubItem"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Sub Menu
          </label>
        </div>

        {isSubMenu && (
          <div className={"flex flex-col gap-2.5"}>
            <Label htmlFor={"url"}>Page Link</Label>
            <Input
              name={"url"}
              placeholder={`Url`}
              value={formData.url === null ? "" : formData.url}
              id={"url"}
              onChange={onChange}
            />
          </div>
        )}
        <Button>Save Changes</Button>
      </form>
    </div>
  );
}
