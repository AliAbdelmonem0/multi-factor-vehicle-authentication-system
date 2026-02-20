import { useState, useEffect } from "react";
import { getDrivers, createDriver, API_URL } from "../api";
import { Plus, QrCode, Search, User, Car, AlertCircle, Loader2 } from "lucide-react";
import QRCode from "qrcode";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [drivers, setDrivers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [qrCodeData, setQrCodeData] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token || user?.role !== "admin") {
            navigate("/login");
            return;
        }
        loadDrivers();
    }, [user, token]);

    const loadDrivers = async () => {
        try {
            // Pass token to API calls (assuming api.js is updated to handle tokens, or we pass it here)
            // For now, let's assume getDrivers is protected on backend but we need to send header
            // We will quick-fix api.js to accept token
            const response = await fetch(`${API_URL}/drivers/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDrivers(data);
            }
        } catch (error) {
            console.error("Error loading drivers", error);
        } finally {
            setLoading(false);
        }
    };

    // ... rest of component (render)
    // Need to update CreateDriver call too

    const handleCreateDriver = async (formData) => {
        try {
            const response = await fetch(`${API_URL}/drivers/`, {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed");
            loadDrivers();
            setShowModal(false);
        } catch (e) {
            alert("Error adding driver");
        }
    };

    const generateQR = async (driver) => {
        // Create a URL pointing to the public verification page
        const verificationUrl = `${window.location.origin}/verify-driver/${driver.id}`;

        try {
            const url = await QRCode.toDataURL(verificationUrl, { width: 300, margin: 2, color: { dark: '#0F172A', light: '#FFFFFF' } });
            setQrCodeData(url);
            setSelectedDriver(driver);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="pt-24 min-h-screen bg-slate-50 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-primary">Driver Database</h1>
                        <p className="text-gray-500 mt-2">Manage registered drivers and electronic stickers.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-secondary hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
                    >
                        <Plus size={20} /> Add Driver
                    </button>
                </div>

                {/* Stats / Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drivers.map((driver) => (
                        <div key={driver.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            {driver.photo_url ? (
                                                <img
                                                    src={`${API_URL}/${driver.photo_url}`}
                                                    alt={driver.name}
                                                    className="h-16 w-16 rounded-2xl object-cover ring-4 ring-gray-50 group-hover:ring-blue-50 transition-all"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <User size={32} />
                                                </div>
                                            )}
                                            <div className="absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{driver.name}</h3>
                                            <p className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded-md inline-block mt-1">
                                                {driver.national_id}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Car size={18} className="text-secondary" />
                                            <span className="font-medium text-sm">{driver.cars[0]?.model || "Unknown Model"}</span>
                                        </div>
                                        <span className="font-mono font-bold text-slate-800 bg-white px-2 py-1 rounded border border-gray-200 text-sm">
                                            {driver.cars[0]?.plate_number || "NO PLATE"}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => generateQR(driver)}
                                    className="mt-6 w-full py-3 bg-primary/5 hover:bg-primary/10 text-primary font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors group-hover:bg-primary group-hover:text-white"
                                >
                                    <QrCode size={18} />
                                    Generate Sticker
                                </button>
                            </div>
                        </div>
                    ))}
                    {drivers.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                            <div className="mx-auto h-20 w-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                                <User size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">No Drivers Registered</h3>
                            <p className="text-gray-500 mt-2">Get started by adding your first driver to the system.</p>
                        </div>
                    )}
                </div>

                {/* Add Driver Modal */}
                {showModal && (
                    <DriverModal onClose={() => setShowModal(false)} onSubmit={handleCreateDriver} />
                )}

                {/* QV Code Overlay */}
                {selectedDriver && qrCodeData && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="bg-primary p-6 text-center">
                                <h3 className="text-xl font-bold text-white">Digital Sticker</h3>
                                <p className="text-blue-200 text-sm">Official Traffic Authority</p>
                            </div>
                            <div className="p-8 flex flex-col items-center">
                                <div className="bg-white p-2 rounded-xl shadow-inner border border-gray-100">
                                    <img src={qrCodeData} alt="QR Code" className="w-48 h-48" />
                                </div>
                                <div className="mt-6 text-center w-full space-y-2">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Driver Name</p>
                                        <p className="font-bold text-primary text-lg">{selectedDriver.name}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Vehicle Plate</p>
                                        <p className="font-mono text-xl font-bold text-secondary">{selectedDriver.cars[0]?.plate_number}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 border-t border-slate-100">
                                <button
                                    onClick={() => { setSelectedDriver(null); setQrCodeData("") }}
                                    className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function DriverModal({ onClose, onSubmit }) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        await onSubmit(formData);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-primary">New Registration</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <span className="text-2xl">×</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <User size={16} className="text-secondary" /> Personal Info
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input name="name" required className="w-full rounded-xl border-gray-200 bg-slate-50 focus:border-secondary focus:ring-secondary transition-all p-3 text-gray-900" placeholder="e.g. Ahmed Mohamed" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                                <input name="national_id" required className="w-full rounded-xl border-gray-200 bg-slate-50 focus:border-secondary focus:ring-secondary transition-all p-3 text-gray-900" placeholder="14 Digits" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Driving License</label>
                                <input name="license_number" required className="w-full rounded-xl border-gray-200 bg-slate-50 focus:border-secondary focus:ring-secondary transition-all p-3 text-gray-900" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <Car size={16} className="text-secondary" /> Vehicle Info
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
                                <input name="plate_number" required className="w-full rounded-xl border-gray-200 bg-slate-50 focus:border-secondary focus:ring-secondary transition-all p-3 font-mono text-gray-900" placeholder="ABC 123" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                    <input name="car_model" required className="w-full rounded-xl border-gray-200 bg-slate-50 focus:border-secondary focus:ring-secondary transition-all p-3 text-gray-900" placeholder="Toyota" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                    <input name="car_color" required className="w-full rounded-xl border-gray-200 bg-slate-50 focus:border-secondary focus:ring-secondary transition-all p-3 text-gray-900" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Driver Photo</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                                    <input type="file" name="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <div className="text-sm text-gray-500">
                                        <span className="text-secondary font-medium">Click to upload</span> or drag and drop
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2">
                            {loading && <Loader2 className="animate-spin h-4 w-4" />}
                            Save Driver
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
