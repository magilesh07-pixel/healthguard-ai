import React from "react";

function UploadScan() {
    return (
        <div className="p-6 bg-white rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Upload Medical Scan</h2>

            <input type="file" className="mb-4" />

            <button className="bg-green-600 text-white px-4 py-2 rounded">
                Analyze Scan
            </button>
        </div>
    );
}

export default UploadScan;