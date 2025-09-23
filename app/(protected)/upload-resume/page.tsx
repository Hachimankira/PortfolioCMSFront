"use client";

import apiClient from "@/lib/api-client";
import { useRef, useState } from "react";

export default function UploadResumePage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf") {
                setFile(droppedFile);
            } else {
                setResult({ error: "Only PDF files are allowed." });
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setResult(null);
        } else if (selectedFile) {
            setResult({ error: "Only PDF files are allowed." });
        }
    };

    const handleSelectClick = () => {
        inputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await apiClient.post("/api/resume/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setResult(res.data);
        } catch (error: any) {
            setResult({ error: error?.response?.data || "Upload failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Upload Your Resume</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div
                    className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={handleSelectClick}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <span className="text-gray-500 mb-2">
                        {file ? (
                            <>
                                <span className="font-medium text-blue-600">{file.name}</span>
                                <span className="ml-2 text-xs text-gray-400">(PDF)</span>
                            </>
                        ) : (
                            "Drag & drop your PDF resume here"
                        )}
                    </span>
                    <button
                        type="button"
                        onClick={handleSelectClick}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow"
                    >
                        Select PDF File
                    </button>
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded w-full"
                    disabled={loading || !file}
                >
                    {loading ? "Processing..." : "Upload"}
                </button>
            </form>

            {result && (
                <pre className="mt-6 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                </pre>
            )}
        </div>
    );
}