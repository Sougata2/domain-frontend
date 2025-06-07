import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function EditUser() {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialValues);

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVER_URL + `/user/${id}`
      );
      setFormData(response.data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      (async () => {
        await fetchUser();
      })();
    } else {
      navigate("/add-user");
    }
  }, [fetchUser, id, navigate]);

  function onChange(e) {
    const { name, value } = e.target;
    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
      };

      const response = await axios.put(
        import.meta.env.VITE_SERVER_URL + "/user",
        payload
      );
      const _ = response.data;
      await fetchUser();
      toast.success("Success", {
        description: "User updated",
      });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className={"flex flex-col gap-4 justify-center items-center py-12"}>
      <form className={"flex flex-col w-md gap-4.5"} onSubmit={onSubmit}>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"firstName"}>First Name</Label>
          <Input
            name="firstName"
            placeholder={"First Name"}
            value={formData.firstName}
            id={"firstName"}
            onChange={onChange}
          />
        </div>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"lastName"}>Last Name</Label>
          <Input
            name="lastName"
            placeholder={"Last Name"}
            value={formData.lastName}
            id={"lastName"}
            onChange={onChange}
          />
        </div>
        <div className={"flex flex-col gap-2.5"}>
          <Label htmlFor={"email"}>Email</Label>
          <Input
            name="email"
            placeholder={"Email"}
            value={formData.email}
            id={"email"}
            onChange={onChange}
          />
        </div>
        <Button>Update User</Button>
      </form>
    </div>
  );
}
