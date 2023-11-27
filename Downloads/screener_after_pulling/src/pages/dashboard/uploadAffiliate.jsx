import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";
import { useState } from "react";
import { ENV_PROXY } from "@/configs/globalVariable";


const UploadButton = ({selectedFiles, setSelectedFiles}) => {
  console.log("selectedFiles", selectedFiles)
  const [isDragging, setIsDragging] = useState(false);

  const handleFileInput = async (e) => {
    setSelectedFiles([...selectedFiles, ...e.target.files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    setSelectedFiles([...selectedFiles, ...e.dataTransfer.files]);
  };
  return (
    <div className="flex items-center justify-center">
      <label
        htmlFor="upload-button"
        className={`flex flex-col items-center justify-center border-2 border-gray-600 rounded-md w-64 h-64 cursor-pointer p-4 text-center transition-all ${
          isDragging ? "bg-gray-300" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
        <span
          className={`text-lg font-medium transition-all ${
            isDragging ? "text-gray-600" : ""
          }`}
        >
          {selectedFiles.length
            ? `${selectedFiles.length} file${
                selectedFiles.length > 1 ? "s" : ""
              } added`
            : "Drag and drop files here or click here"}
        </span>
        <input
          id="upload-button"
          type="file"
          onChange={handleFileInput}
          multiple
          className="hidden"
        />
      </label>
    </div>
  );
};


const CrawlForm = ({url, setUrl, fetchedLinks, setFetchedLinks}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
  
    return (
      <div className="flex flex-col justify-center mb-10 pr-12 pl-12">
        <div className="form-container">
          <h1 className="text-center">Link</h1>
          <form onSubmit={(event) => event.preventDefault()}>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="https://openai.com"
                name="heading"
                className="w-full px-4 py-2 my-3  mr-2 border rounded-md focus:outline-none focus:shadow-outline-blue"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>
    );
  };

export function UploadAffiliate() {
  const [fetchedLinks, setFetchedLinks] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function uploadFile(files, links) {
    if (loading) return;
    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    if (links && links.length > 0) {
      links.forEach((link) => {
        formData.append("links", link);
      });
    }
  
    const token = localStorage.getItem("token");
    const response = await fetch(`${ENV_PROXY}/v4/upload?affiliate=true`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    setLoading(false);
    const data = await response.json();
    setSelectedFiles([]);
    // Redirect to another route after a successful fetch call
    navigate("/dashboard/home");
    return data;
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
           Upload Affiliate data
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2 flex flex-col">
          <CrawlForm url={url} setUrl={setUrl} fetchedLinks={fetchedLinks} setFetchedLinks={setFetchedLinks}/>
          <UploadButton selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
          <div className="flex justify-center mt-10 mb-10">
            <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                onClick = {() => uploadFile(selectedFiles, [...fetchedLinks, url])}
                >
                {loading ? "uploading and training..." : "Add affilliate data"}
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default UploadAffiliate;
