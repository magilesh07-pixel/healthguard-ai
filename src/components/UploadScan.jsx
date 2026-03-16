import React from "react";
import { Upload } from "lucide-react";

function UploadScan() {
    return (
        <div className="glass-panel p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
                <Upload size={28} />
            </div>
            <h2 className="text-xl font-bold mb-3 text-[var(--text-primary)]">Upload Medical Scan</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-xs">Supported formats: DICOM, MRI, CT (JPG/PNG allowed for analysis).</p>

            <input type="file" className="hidden" id="scan-upload" />
            <label htmlFor="scan-upload" className="btn-primary cursor-pointer w-full justify-center">
                Analyze Scan
            </label>
        </div>
    );
}

export default UploadScan;