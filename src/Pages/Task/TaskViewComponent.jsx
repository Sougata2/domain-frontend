import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

import axios from "axios";

const loadComponent = (name) => lazy(() => import(`./components/${name}.jsx`));

function TaskViewComponent({ referenceNumber, role, type }) {
  const [components, setComponents] = useState([]);

  const fetchComponent = useCallback(async () => {
    try {
      const response = await axios.get(
        `/view-component/by-role-and-application-type?role=${role}&type=${type}`
      );
      const data = response.data;
      setComponents(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [role, type]);

  useEffect(() => {
    if (role) {
      (async () => {
        await fetchComponent();
      })();
    }
  }, [fetchComponent, role]);

  return (
    <div className="flex flex-col gap-4">
      {components.map((c) => {
        const DynamicComponent = loadComponent(c.name);
        return (
          <Suspense fallback={<Spinner />} key={c.id}>
            <DynamicComponent referenceNumber={referenceNumber} />
          </Suspense>
        );
      })}
    </div>
  );
}

export default TaskViewComponent;
