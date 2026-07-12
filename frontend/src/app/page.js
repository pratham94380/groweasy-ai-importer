"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";




export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [crmRecords, setCrmRecords] = useState([]);
  const [imported, setImported] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [skippedRecords, setSkippedRecords] = useState([]);

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

      const response = await fetch(
        "https://groweasy-ai-importer-backend-cxtn.onrender.com/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        setPreview(data.preview);
        setAllRows(data.allRows);
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

  const handleConfirmImport = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://groweasy-ai-importer-backend-cxtn.onrender.com/import",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rows: allRows,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setCrmRecords(data.records);
        setImported(data.imported);
        setSkipped(data.skipped);
        setSkippedRecords(data.skippedRecords);
      }
      else {
        alert("Import failed");
      }
    }
    catch (err) {
      console.error(err);
      alert("Server Error");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          GrowEasy CSV Importer
        </h1>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />

          {file ? (
            <>
              <div className="text-4xl">📄</div>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {file.name}
              </p>
              <p className="text-green-600 text-sm">Ready to Upload</p>
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

        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={uploadFile}
            disabled={!file || loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Uploading..." : "Upload & Preview"}
          </button>

          <button
            onClick={handleConfirmImport}
            disabled={preview.length === 0}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            Confirm Import
          </button>
        </div>

        {preview.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                CSV Preview
              </h2>

              <div className="overflow-auto max-h-[420px]">
                <table className="w-full text-sm border border-gray-300">
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
                          <td
                            key={i}
                            className="border px-3 py-2 text-gray-700"
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {crmRecords.length > 0 && (
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                  Parsed CRM Records
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-300">
                    <thead className="bg-green-200">
                      <tr>
                        {Object.keys(crmRecords[0]).map((key) => (
                          <th
                            key={key}
                            className="border px-3 py-2 text-left whitespace-nowrap text-gray-900 bg-green-200"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {crmRecords.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, i) => (
                            <td
                              key={i}
                              className="border px-3 py-2 whitespace-nowrap text-gray-800"
                            >
                              {String(value ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600">Imported</p>
                    <p className="text-3xl font-bold text-green-600">
                      {imported}
                    </p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600">Skipped</p>
                    <p className="text-3xl font-bold text-red-600">{skipped}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {skippedRecords.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">
              Skipped Records
            </h2>

            <table className="min-w-max border border-gray-300">
              <thead className="bg-red-200">
                <tr>
                  {Object.keys(skippedRecords[0]).map((key) => (
                    <th
                      key={key}
                      className="border px-3 py-2 text-left text-gray-800"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {skippedRecords.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="border px-4 py-2 text-gray-800">
                        {String(value ?? "")}
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
