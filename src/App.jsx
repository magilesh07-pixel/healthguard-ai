import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Intake from "./pages/Intake";
import Scans from "./pages/Scans";
import Landing from "./pages/Landing";
import HealthProfile from "./pages/HealthProfile";
import Info from "./pages/Info";

import AiDoctor from "./pages/AiDoctor";

// Wrapper to handle path-specific UI logic
function AppContent({ 
    patientData, 
    setPatientData, 
    theme, 
    toggleTheme, 
    mousePosition, 
    reportLoading, 
    setReportLoading,
    privacyMode,
    togglePrivacyMode
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
                    theme={theme} 
                    toggleTheme={toggleTheme} 
                    patientData={patientData} 
                    reportLoading={reportLoading}
                    onReportStart={() => setReportLoading(true)}
                    privacyMode={privacyMode}
                    togglePrivacyMode={togglePrivacyMode}
                />
                <main className={`${isLanding ? '' : 'p-6 max-w-7xl mx-auto w-full'} flex-grow relative`}>
                    <Routes>
                        <Route path="/" element={<Landing theme={theme} toggleTheme={toggleTheme} />} />
                        <Route path="/dashboard" element={<Home data={patientData} theme={theme} setReportLoading={setReportLoading} privacyMode={privacyMode} />} />
                        <Route path="/intake" element={<Intake onUpdateData={setPatientData} />} />
                        <Route path="/scans" element={<Scans />} />
                        <Route path="/ai-doctor" element={<AiDoctor theme={theme} />} />
                        <Route path="/profile" element={<HealthProfile data={patientData} />} /> 
                        <Route path="/info/:type" element={<Info />} /> 
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
    const [privacyMode, setPrivacyMode] = useState(false);
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("theme");
        if (saved) return saved;
        return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 40;
            const y = (e.clientY / window.innerHeight - 0.5) * 40;
            setMousePosition({ x, y });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const toggleTheme = () => {
        setTheme(prev => prev === "dark" ? "light" : "dark");
    };

    const togglePrivacyMode = () => setPrivacyMode(prev => !prev);

    return (
        <BrowserRouter>
            <AppContent 
                patientData={patientData} 
                setPatientData={setPatientData}
                theme={theme} 
                toggleTheme={toggleTheme} 
                mousePosition={mousePosition} 
                reportLoading={reportLoading}
                setReportLoading={setReportLoading}
                privacyMode={privacyMode}
                togglePrivacyMode={togglePrivacyMode}
            />
        </BrowserRouter>
    );
}

export default App;