import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCallback, useEffect, useState } from "react";
import { VscCircleSlash } from "react-icons/vsc";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "react-router";

import axios from "axios";

function Jobs({ referenceNumber }) {
  const [data, setData] = useState([]);

  const fetchDevicesWithJobs = useCallback(async () => {
    try {
      const response = await axios.get(
        `/device/device-with-jobs/${referenceNumber}`
      );
      setData(response.data);
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  }, [referenceNumber]);

  useEffect(() => {
    (async () => {
      await fetchDevicesWithJobs();
    })();
  }, [fetchDevicesWithJobs]);

  console.log(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs</CardTitle>
        <CardDescription>
          list of all the jobs respective to the devices registered in the
          application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <table className="table-bordered">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Device</th>
              <th>Job Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={d.job_id}>
                <th>{i + 1}</th>
                <td>{d.device_name}</td>
                <td>
                  {d.status ? (
                    <Badge variant={"secondary"}>{d.status}</Badge>
                  ) : (
                    <VscCircleSlash size={17} />
                  )}
                </td>
                <td>
                  {d.job_id ? (
                    <Link
                      className="hover:underline"
                      to={`/job-view/${d.job_id}`}
                    >
                      view
                    </Link>
                  ) : (
                    <VscCircleSlash size={17} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export default Jobs;
