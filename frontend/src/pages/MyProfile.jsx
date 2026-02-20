import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Car, Shield, LogOut } from "lucide-react";
import QRCode from "qrcode";
import { API_URL } from "../api";

export default function MyProfile() {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [driver, setDriver] = useState(null);
    const [qrCode, setQrCode] = useState("");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        loadProfile();
    }, [token]);

    const loadProfile = async () => {
        try {
            const response = await fetch(`${API_URL}/my-driver-profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDriver(data);
                generateQR(data);
            }
        } catch (e) {
            console.error("Failed to load profile");
        }
    };

    const generateQR = async (data) => {
        // Create a URL pointing to the public verification page
        const verificationUrl = `${window.location.origin}/verify-driver/${data.id}`;

        const url = await QRCode.toDataURL(verificationUrl, {
            width: 300,
            margin: 2,
            color: { dark: '#0F172A', light: '#FFFFFF' }
        });
        setQrCode(url);
    };

    if (!driver) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-gray-500">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-primary p-8 text-white flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">My Driver Profile</h1>
                            <p className="text-blue-200">Official Traffic Authority Record</p>
                        </div>
                        <button onClick={logout} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>

                    <div className="p-8 grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                {driver.photo_url ? (
                                    <img src={`${API_URL}/${driver.photo_url}`} className="w-24 h-24 rounded-2xl object-cover ring-4 ring-gray-100" />
                                ) : (
                                    <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                                        <User size={40} />
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{driver.name}</h2>
                                    <p className="text-gray-500 font-mono">{driver.national_id}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                                <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm border-b border-gray-200 pb-2">Vehicle Details</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">Plate Number</span>
                                    <span className="font-mono font-bold text-lg bg-white px-2 py-1 rounded border border-gray-200">{driver.cars[0]?.plate_number}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">Model</span>
                                    <span className="font-medium text-gray-900">{driver.cars[0]?.model}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">Color</span>
                                    <span className="font-medium text-gray-900">{driver.cars[0]?.color}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center bg-slate-900 rounded-2xl p-8 text-center text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Shield size={100} />
                            </div>
                            <h3 className="text-xl font-bold mb-6 relative z-10">Electronic Sticker</h3>
                            <div className="bg-white p-4 rounded-xl shadow-lg relative z-10">
                                <img src={qrCode} className="w-48 h-48" />
                            </div>
                            <p className="mt-4 text-sm text-blue-200 relative z-10">
                                Scan this code for immediate verification
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
