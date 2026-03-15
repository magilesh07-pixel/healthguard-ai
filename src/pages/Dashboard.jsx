import React from "react";
import Navbar from "../components/Navbar";
import RiskChart from "../components/RiskChart";

function Dashboard() {
    return (
        <div>
            <Navbar />

            <div className="p-10">
                <h1 className="text-2xl font-bold mb-5">
                    Health Dashboard
                </h1>

                <RiskChart />
            </div>
        </div>
    );
}

export default Dashboard;