import { Button } from "@/components/ui/button";
import FormInput from "@/DomainComponents/FormInput";
import FormSelect from "@/DomainComponents/FormSelect";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router";

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

  const [subMenus, setSubMenus] = useState([]);
  const [forms, setForms] = useState([]);
  const [stages, setStages] = useState([]);
  const [defaultTab, setDefaultTab] = useState("");

  const fetchSubMenus = useCallback(async () => {
    try {
      const response = await axios.get("/menu/sub-menus");
      const data = response.data;
      setSubMenus(data.map((d) => ({ label: d.name, value: d })));
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, []);

  const fetchForms = useCallback(async () => {
    try {
      const response = await axios.get("/form/all");
      const data = response.data;
      setForms(data.map((d) => ({ label: d.name, value: d })));
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
    (async () => {
      await fetchSubMenus();
    })();
  }, [fetchSubMenus]);

  useEffect(() => {
    (async () => {
      await fetchForms();
    })();
  }, [fetchForms]);

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

      const _ = await axios.post("/form-stage", payload);
      reset();
      toast.success("Success", { description: "Stage Registered" });
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }

  return (
    <div className="flex justify-center items-center flex-col gap-30">
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <div className="flex flex-col gap-3 w-md">
          <div>
            <FormSelect
              control={control}
              error={errors.menu}
              defaultValue={null}
              label={"Menu"}
              name={"menu"}
              options={subMenus}
              validation={{
                required: {
                  value: true,
                  message: "Menu is Required",
                },
              }}
            />
          </div>
          <div>
            <FormSelect
              control={control}
              error={errors.form}
              defaultValue={null}
              label={"Form"}
              name={"form"}
              options={forms}
              validation={{
                required: {
                  value: true,
                  message: "Form is Required",
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
                  <Link to={`/${s.menu.url}`}>{s.menu.name}</Link>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterFormStages;
