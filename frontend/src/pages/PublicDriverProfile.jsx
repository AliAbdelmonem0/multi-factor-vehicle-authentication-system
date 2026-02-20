import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShieldCheck, User, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "../api";

export default function PublicDriverProfile() {
    const { id } = useParams();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadPublicProfile();
    }, [id]);

    const loadPublicProfile = async () => {
        try {
            const response = await fetch(`${API_URL}/public/drivers/${id}`);
            if (!response.ok) throw new Error("Driver not found or invalid QR code");
            const data = await response.json();
            setDriver(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-8 text-center max-w-md">
                <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
                <p className="text-red-200">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4">
            <div className="max-w-md mx-auto relative">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl transform -skew-y-6"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto flex items-center justify-center mb-3 backdrop-blur-sm">
                            <ShieldCheck size={32} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Official Driver Verification</h1>
                        <p className="text-blue-100 text-sm mt-1">Ministry of Traffic & Transport</p>
                    </div>

                    {/* Profile Image */}
                    <div className="flex justify-center -mt-10">
                        <div className="p-1.5 bg-slate-900 rounded-full">
                            {driver.photo_url ? (
                                <img
                                    src={`${API_URL}/${driver.photo_url}`}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-slate-900 bg-slate-800"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center text-gray-500 border-4 border-slate-900">
                                    <User size={48} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-8 space-y-6">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-white">{driver.name}</h2>
                            <p className="text-gray-400 font-mono mt-1">{driver.national_id}</p>
                            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-bold border border-green-500/20">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Verified License
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5 text-center">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Plate Number</p>
                                <p className="text-xl font-bold text-white font-mono">{driver.cars[0]?.plate_number}</p>
                            </div>
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5 text-center">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Car Model</p>
                                <p className="text-lg font-bold text-white">{driver.cars[0]?.model}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 text-center">
                            <p className="text-xs text-gray-500">
                                Generated by Smart Traffic System
                                <br />
                                {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
