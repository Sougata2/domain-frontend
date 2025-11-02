import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import makeAnimated from "react-select/animated";
import Select from "react-select";
import axios from "axios";

const animatedComponents = makeAnimated();

function MapComponentToRole() {
  const [selectedComponent, setSelectedComponent] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [componentOptions, setComponentOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  const fetchComponents = useCallback(async () => {
    try {
      const response = await axios.get("/view-component/all");
      const data = response.data;
      setComponentOptions(data.map((d) => ({ label: d.name, value: d })));
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await axios.get("/role");
      const data = response.data;
      setRoleOptions(data.map((d) => ({ label: d.name, value: d.id })));
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchRoles();
      await fetchComponents();
    })();
  }, [fetchComponents, fetchRoles]);

  useEffect(() => {
    if (selectedComponent?.value?.roles) {
      setSelectedRoles(
        selectedComponent.value.roles.map((r) => ({
          label: r.name,
          value: r.id,
        }))
      );
    } else {
      setSelectedRoles([]);
    }
  }, [selectedComponent]);

  async function handleSubmit() {
    try {
      const payload = {
        id: selectedComponent.value.id,
        roles: selectedRoles.map((sc) => ({ id: sc.value })),
      };
      await axios.put("/view-component", payload);
      toast.info("Success", { description: "Mapped Role(s) To Component" });
      await fetchComponents();
      await fetchRoles();
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-3xl flex flex-col gap-3.5">
        <Select
          options={componentOptions}
          placeholder={"Select Component"}
          onChange={(e) => setSelectedComponent(e)}
          isClearable
          isSearchable
        />
        <Select
          isMulti={true}
          closeMenuOnSelect={false}
          components={animatedComponents}
          placeholder={"Select Roles"}
          hideSelectedOptions
          options={roleOptions}
          isDisabled={!selectedComponent || !roleOptions.length}
          value={selectedRoles}
          onChange={(e) => setSelectedRoles(e)}
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>
    </div>
  );
}

export default MapComponentToRole;
