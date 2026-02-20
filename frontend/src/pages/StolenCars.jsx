import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Calendar, Search, Loader2 } from "lucide-react";
import { API_URL } from "../api";


const StolenCars = () => {
    const [stolenCars, setStolenCars] = useState([]);
    const [newReport, setNewReport] = useState({ plate_number: '', description: '' });
    const [showReportForm, setShowReportForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStolenCars();
    }, []);

    const fetchStolenCars = async () => {
        try {
            // Need to check auth token usage, assuming api wrapper or direct fetch with token
            // For now, simple fetch as it's a public/protected endpoint depending on implementation plan
            // In plan I said "GET /stolen-cars/".
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/stolen-cars/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setStolenCars(data);
            }
        } catch (error) {
            console.error("Failed to fetch stolen cars", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/stolen-cars/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newReport),
            });

            if (response.ok) {
                setNewReport({ plate_number: '', description: '' });
                setShowReportForm(false);
                fetchStolenCars(); // Refresh list
            } else {
                alert('Failed to report. Ensure you are logged in.');
            }
        } catch (error) {
            console.error("Error reporting stolen car", error);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent flex items-center gap-3">
                        <ShieldAlert className="text-red-500 h-10 w-10" />
                        Stolen Vehicle Tracker
                    </h1>
                    <p className="text-gray-400 mt-2">Report and track missing vehicles across the network</p>
                </div>

                <button
                    onClick={() => setShowReportForm(!showReportForm)}
                    className="btn-danger px-6 py-3 rounded-xl flex items-center gap-2 font-bold"
                >
                    <PlusCircle size={20} />
                    {showReportForm ? 'Cancel Report' : 'Report Stolen Car'}
                </button>
            </div>

            {showReportForm && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="glass-panel p-6 rounded-2xl border-l-4 border-l-red-500"
                >
                    <h3 className="text-xl font-bold mb-4 text-white">New Stolen Report</h3>
                    <form onSubmit={handleReportSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Plate Number (e.g. ABC-123)"
                            value={newReport.plate_number}
                            onChange={(e) => setNewReport({ ...newReport, plate_number: e.target.value })}
                            className="glass-input p-3 rounded-lg w-full"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description (Color, Model, Distinctive marks)"
                            value={newReport.description}
                            onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                            className="glass-input p-3 rounded-lg w-full"
                            required
                        />
                        <button type="submit" className="btn-danger p-3 rounded-lg font-bold">
                            Submit Report
                        </button>
                    </form>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-gray-400">Loading reports...</p>
                ) : stolenCars.length === 0 ? (
                    <p className="text-gray-500 col-span-3 text-center py-10">No stolen cars reported yet. Stay safe!</p>
                ) : (
                    stolenCars.map((car) => (
                        <motion.div
                            key={car.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-red-500/50 transition-all cursor-default"
                        >
                            <div className="absolute top-0 right-0 p-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${car.status === 'found' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400 animate-pulse'}`}>
                                    {car.status}
                                </span>
                            </div>

                            <div className="flex items-start gap-4 mb-4">
                                <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                                    <AlertCircle className="text-red-500 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-mono font-bold text-white tracking-wider">{car.plate_number}</h3>
                                    <p className="text-sm text-gray-400">Reported on {new Date(car.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <p className="text-gray-300 mb-4 bg-gray-800/50 p-3 rounded-lg border border-white/5">
                                {car.description}
                            </p>

                            {car.last_seen_location && (
                                <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 p-2 rounded-lg text-sm border border-yellow-400/20">
                                    <MapPin size={16} />
                                    <span>Last seen: {car.last_seen_location}</span>
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StolenCars;
