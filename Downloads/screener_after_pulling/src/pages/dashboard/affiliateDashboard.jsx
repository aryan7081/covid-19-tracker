import {useState, useEffect} from 'react';
import { useLocation, Link, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { ENV_PROXY } from '@/configs/globalVariable';


async function fetchUploadedList() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${ENV_PROXY}/v4/upload?affiliate=true`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

export function AffiliateDashboard() {
  const [uploadedList, setUploadedList] = useState([]);

  function removeItemFromList(id) {
    const newList = uploadedList.filter((item) => item._id !== id);
    console.log(newList.length);
    setUploadedList(newList);
  }

  useEffect(() => {
    let intervalId;

    async function fetchUploadedData() {
      try {
        const response = await fetchUploadedList();
        setUploadedList(response);

        // Check if any element has a state of 'pending'
        const hasPending = response.some(element => element.state === 'pending');

        // Set an interval to fetch data every 5 seconds only if there's a 'pending' state
        if (hasPending && !intervalId) {
          intervalId = setInterval(() => {
            fetchUploadedData();
          }, 1000);
        } else if (!hasPending && intervalId) {
          // Clear the interval if there are no pending items
          clearInterval(intervalId);
          intervalId = null;
        }
      } catch (error) {
        console.error("error", error);
      }
    }

    fetchUploadedData();

    // Clean up the interval when the component is unmounted or the effect reruns
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  useEffect(() => {
    console.log("uploadedList", uploadedList);
  }, [uploadedList]);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Uploaded Data
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["url", "character count", "uploaded on", "status"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uploadedList.map(
                ({ _id, created_at, state, url, character_count }, key) => {
                  const parts = url.split("/");
                  if (parts.length > 3 && parts[0] === "") {
                    url = parts.slice(parts.length - 1).join("/");
                  }
                  const className = `py-3 px-5 ${
                    key === uploadedList.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;
                  return (
                    <tr key={_id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {url}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {character_count}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {created_at}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={state=="done" ? "green" : "blue-gray"}
                          value={state}
                          className="py-0.5 px-2 text-[11px] font-medium"
                        />
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default AffiliateDashboard;
