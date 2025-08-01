import { Button } from "@/components/ui/button";
import FormInput from "@/DomainComponents/FormInput";
import FormSelect from "@/DomainComponents/FormSelect";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router";
import ConfirmationAlert from "@/DomainComponents/ConfirmationAlert";

function RegisterFormStages() {
  const defaultValues = {
    menu: "",
    stageOrder: "",
    form: "",
  };

  const {
    control,
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });
  const form = watch("form");

  const [subMenuOptions, setSubMenuOptions] = useState([]);
  const [subMenus, setSubMenus] = useState([]);
  const [formOptions, setFormOptions] = useState([]);
  const [forms, setForms] = useState([]);
  const [stages, setStages] = useState([]);
  const [defaultTab, setDefaultTab] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const fetchSubMenu = useCallback(async () => {
    try {
      const response = await axios.get("/menu/sub-menus");
      const data = response.data;
      setSubMenus(data);
      const stagedMenus = form.value.stages?.map((s) => s.menu.id);
      const unstagedMenus = data
        .filter((d) => !stagedMenus?.includes(d.id))
        .map((d) => ({ label: d.name, value: d }));
      setSubMenuOptions(unstagedMenus);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [form]);

  const fetchForm = useCallback(async () => {
    try {
      const response = await axios.get("/form/all");
      const data = response.data;
      setForms(data);
      setFormOptions(data.map((d) => ({ label: d.name, value: d })));
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  const fetchStages = useCallback(async () => {
    try {
      const response = await axios.get(
        `/form-stage/by-form-id/${form?.value.id}`
      );
      const data = response.data;
      setStages(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [form]);

  useEffect(() => {
    if (form) {
      (async () => {
        await fetchSubMenu();
      })();
    }
  }, [fetchSubMenu, form]);

  useEffect(() => {
    (async () => {
      await fetchForm();
    })();
  }, [fetchForm]);

  useEffect(() => {
    if (form) {
      (async () => {
        await fetchStages();
      })();
    }
  }, [fetchStages, form]);

  useEffect(() => {
    if (stages.length > 0) {
      setDefaultTab(String(stages[0]?.id));
    }
  }, [stages, stages.length]);

  async function handleOnSubmit(data) {
    try {
      const payload = {
        ...data,
        stageOrder: Number(data.stageOrder),
        menu: { id: data.menu.value.id },
        form: { id: data.form.value.id },
      };

      if (isEditing) {
        const _ = await axios.put("/form-stage", payload);
      } else {
        const _ = await axios.post("/form-stage", payload);
      }

      reset(defaultValues);
      toast.success("Success", {
        description: `Stage ${isEditing ? "Updated" : "Registered"}`,
      });
      setIsEditing(false);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  async function handleDelete(id) {
    try {
      const _ = await axios.delete("/form-stage", {
        data: { id },
      });
      setDeleteId("");
      await fetchStages();
      toast.warning("Deleted", { description: "Stage Removed" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  async function selectForEdit(stageId) {
    try {
      const response = await axios.get(`/form-stage/${stageId}`);
      const data = response.data;
      const { id, stageOrder, menu, form } = data;
      reset({
        id,
        stageOrder,
        menu: {
          label: menu.name,
          value: subMenus.find((s) => s.id === menu.id),
        },
        form: { label: form.name, value: forms.find((f) => f.id === form.id) },
      });
      setIsEditing(true);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center flex-col gap-15">
      <ConfirmationAlert
        isOpen={openAlert}
        closeHandler={() => setOpenAlert(false)}
        handleConfirm={() => {
          handleDelete(deleteId);
          setOpenAlert(false);
        }}
      />
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <div className="flex flex-col gap-3 w-md">
          <div>
            <FormSelect
              control={control}
              error={errors.form}
              defaultValue={null}
              disabled={isEditing}
              label={"Form"}
              name={"form"}
              options={formOptions}
              validation={{
                required: {
                  value: true,
                  message: "Form is Required",
                },
              }}
            />
          </div>
          <div>
            <FormSelect
              control={control}
              error={errors.menu}
              defaultValue={null}
              label={"Menu"}
              name={"menu"}
              options={subMenuOptions}
              validation={{
                required: {
                  value: true,
                  message: "Menu is Required",
                },
              }}
            />
          </div>
          <div>
            <FormInput
              register={register}
              label={"Stage order"}
              name={"stageOrder"}
              error={errors.stageOrder}
              validation={{
                required: {
                  value: true,
                  message: "Stage Order is required",
                },
                min: {
                  value: 1,
                  message: "Stage order starts with 1",
                },
              }}
              type={"number"}
            />
          </div>
          <div>
            <Button>Save</Button>
          </div>
        </div>
      </form>
      {form && (
        <div className="flex w-md justify-start">
          <div className="flex flex-col gap-3">
            <div className="text-4xl">Stage</div>
            {!form.value.stages.length && <div>No Stages registered yet.</div>}
            {form.value.stages.length && (
              <Tabs
                className="w-full"
                value={defaultTab}
                onValueChange={setDefaultTab}
              >
                <TabsList>
                  {stages.map((s) => (
                    <TabsTrigger key={s.id} value={String(s.id)}>
                      {s.menu.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {stages.map((s) => (
                  <TabsContent key={s.id} value={String(s.id)}>
                    <div className="py-1 px-2 w-full flex flex-col gap-2">
                      <div>
                        <span>Link → </span>
                        <Link to={`/${s.menu.url}`}>{s.menu.url}</Link>
                      </div>
                      <div>
                        <span>Order → </span>
                        <span>{s.stageOrder}</span>
                      </div>
                      <div className="flex gap-2">
                        <div>
                          <Button
                            variant="outline"
                            onClick={() => selectForEdit(s.id)}
                          >
                            edit
                          </Button>
                        </div>
                        <div>
                          <Button
                            onClick={() => {
                              setOpenAlert(true);
                              setDeleteId(s.id);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterFormStages;
