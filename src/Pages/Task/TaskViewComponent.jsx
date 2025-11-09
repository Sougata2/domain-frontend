import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

import axios from "axios";

const loadComponent = (name) => lazy(() => import(`./components/${name}.jsx`));

function TaskViewComponent({ referenceNumber, jobId, role, status, type }) {
  const [components, setComponents] = useState([]);

  const fetchComponent = useCallback(async () => {
    try {
      const response = await axios.get(
        `/view-component/by-role-status-and-application-type?role=${role}&type=${type}&status=${status}`
      );
      const data = response.data;
      setComponents(data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [role, status, type]);

  useEffect(() => {
    if (role && status) {
      (async () => {
        await fetchComponent();
      })();
    }
  }, [fetchComponent, role, status]);

  return (
    <div className="flex flex-col gap-10">
      {components.map((c) => {
        const DynamicComponent = loadComponent(c.name);
        return (
          <Suspense fallback={<Spinner />} key={c.id}>
            {referenceNumber && (
              <DynamicComponent referenceNumber={referenceNumber} />
            )}
            {jobId && <DynamicComponent jobId={jobId} />}
          </Suspense>
        );
      })}
    </div>
  );
}

export default TaskViewComponent;
