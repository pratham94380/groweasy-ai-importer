"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Home() {
  const [file, setFile] = useState(null);

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
      </div>
    </main>
  );
}
