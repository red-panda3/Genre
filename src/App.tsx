import React, { useRef, useState } from "react";
import axios from "axios";
import { Scale, Upload } from "lucide-react";

function App() {
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  const[loading,setloading]=useState(false)
  const[trigger,setTrigger]=useState(false)
  const[res,setres]=useState<string | null>(null);
  // Function to trigger file input click
  const triggerFileInput = () => {
       setTimeout(() => {
  setTrigger(true);
}, 100);
    setTrigger(false)
    if (ref.current) ref.current.click();
  };

  // Function to handle file upload
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response2 = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAudioFile(response2.data.fileUrl); // Save uploaded file URL
      setloading(true)
      const response1 = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setloading(false)
      console.log("Upload successful:", response1.data);
      setres(response1.data)
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="bg-black flex flex-col items-center justify-center w-full h-screen">
      <div className={`w-[250px] h-[180px] bg-teal-400 rounded-2xl flex flex-col items-center justify-evenly p-4 ${trigger==true ? 'scale-105':'scale-100' }`}
        onClick={triggerFileInput}>
        <Upload size={48} />
        <input type="file" accept="audio/*" className="hidden" ref={ref} onChange={handleFileChange} />
        <div className="text-lg">{audioFile ? <p>Uploaded</p> : <p>Select a File</p>}</div>
      </div>

      {audioFile && (
        <div className="mt-5 text-center">
          <p className="text-white mt-2">Playing: {audioFile.split("/").pop()}</p>
          <audio controls src={audioFile} className="mt-3" />
        </div>
      )}
      {
        loading && (
          <div className="mt-2 text-center text-xl text-white">
            Loading....
        </div>
        )
      }
      {
        res!=null && (
          <div className="mt-2 text-center text-xl text-white">
            {res}
        </div>
        )
      }
    </div>
  );
}

export default App;