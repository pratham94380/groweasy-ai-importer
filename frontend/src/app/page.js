"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";




export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
    onDrop,
  });

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setPreview(data.preview);
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          GrowEasy CSV Importer
        </h1>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />

          {file ? (
            <>
              <p className="text-green-600 font-semibold">Selected File</p>
              <p className="mt-2 text-gray-800">{file.name}</p>
            </>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-800">
                Drag & Drop CSV here
              </p>
              <p className="text-gray-500 mt-2">or click to browse</p>
            </>
          )}
        </div>

        <button
          onClick={uploadFile}
          disabled={!file || loading}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload & Preview"}
        </button>

        {preview.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              CSV Preview
            </h2>

            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  {Object.keys(preview[0]).map((key) => (
                    <th
                      key={key}
                      className="border px-4 py-2 text-left text-gray-800"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {preview.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="border px-4 py-2 text-gray-700">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
