import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Intake from "./pages/Intake";
import Scans from "./pages/Scans";
import Landing from "./pages/Landing";
import HealthProfile from "./pages/HealthProfile";
import Info from "./pages/Info";
import AiDoctor from "./pages/AiDoctor";
import Auth from "./pages/Auth";
import LungTest from "./pages/LungTest";
import EyeLab from "./pages/EyeLab";
import { auth, onAuthStateChanged } from "./firebase";

// Wrapper to handle path-specific UI logic
function AppContent({
    patientData,
    setPatientData,
    mousePosition,
    reportLoading,
    setReportLoading,
    onSaveHistory,
    user,
    historyVersion,
    onNewIntake
}) {
    const location = useLocation();
    const isLanding = location.pathname === "/";

    return (
        <div className={`min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-blue-500/30 relative overflow-hidden flex flex-col transition-colors duration-500`}>
            {/* Animated Background Orbs */}
            <div
                className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-transform duration-700 ease-out"
                style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
            >
                <div className="bg-orb orb-1"></div>
                <div className="bg-orb orb-2"></div>
                <div className="bg-orb orb-3"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBoNDBWMEgwem0zOSAxaDF2LTFIMzlaIiBmaWxsPSJwdXJwbGUiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==')] opacity-10"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar
                    patientData={patientData}
                    reportLoading={reportLoading}
                    onReportStart={() => setReportLoading(true)}
                    user={user}
                />
                <main className={`${isLanding ? '' : 'pt-24 lg:pt-44 p-6 max-w-7xl mx-auto w-full'} flex-grow relative`}>
                    <Routes>
                        <Route path="/" element={<Landing user={user} />} />
                        <Route path="/dashboard" element={<Dashboard data={patientData} setReportLoading={setReportLoading} user={user} setPatientData={setPatientData} historyVersion={historyVersion} />} />
                        <Route path="/intake" element={<Intake onUpdateData={onNewIntake} />} />
                        <Route path="/scans" element={<Scans user={user} onSaveHistory={onSaveHistory} />} />
                        <Route path="/ai-doctor" element={<AiDoctor onSaveHistory={onSaveHistory} />} />
                        <Route path="/profile" element={<HealthProfile data={patientData} />} />
                        <Route path="/info/:type" element={<Info />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/lungs" element={<LungTest user={user} onSaveHistory={onSaveHistory} patientData={patientData} />} />
                        <Route path="/eyes" element={<EyeLab user={user} onSaveHistory={onSaveHistory} historyVersion={historyVersion} />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

function App() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [patientData, setPatientData] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [historyVersion, setHistoryVersion] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) setPatientData(null); // Clear data on logout
        });
        return () => unsubscribe();
    }, []);

    // Automatic data persistence removed per user request
    // Data will now be lost on refresh


    const handleSaveHistory = async (type, entryData) => {
        if (!user) return; // Don't save if not logged in
        
        await fetch('/api/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-ID': user.uid // Pass the real global ID
            },
            body: JSON.stringify({ type, data: entryData })
        });
        setHistoryVersion(v => v + 1);
    };

    const handleNewIntake = async (newData) => {
        setPatientData(newData);
        handleSaveHistory('intake', newData);
    };

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", "light");
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 40;
            const y = (e.clientY / window.innerHeight - 0.5) * 40;
            setMousePosition({ x, y });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);



    return (
        <BrowserRouter>
            <AppContent
                patientData={patientData}
                setPatientData={setPatientData}
                onNewIntake={handleNewIntake}
                mousePosition={mousePosition}
                reportLoading={reportLoading}
                setReportLoading={setReportLoading}
                onSaveHistory={handleSaveHistory}
                user={user}
                historyVersion={historyVersion}
            />
        </BrowserRouter>
    );
}

export default App;