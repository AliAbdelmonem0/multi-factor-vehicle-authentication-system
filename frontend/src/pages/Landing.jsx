import { Link } from "react-router-dom";
import { Camera, ScanFace, FileText, ArrowRight, Shield } from "lucide-react";

export default function Landing() {
    return (
        <div className="bg-slate-50 min-h-screen font-sans selection:bg-secondary selection:text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden pt-20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-primary opacity-95"></div>
                    <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" className="w-full h-full object-cover" alt="Background" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-32 text-center lg:text-left">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
                                <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
                                Next Generation AI System
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
                                Smart Traffic <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Enforcement</span>
                            </h1>
                            <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                                Utilizing YOLOv8 and advanced OCR to detect obscured plates and identify drivers through facial recognition. Ensuring fairness and safety on Egyptian roads.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/dashboard" className="px-8 py-4 bg-secondary hover:bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2">
                                    Launch Dashboard <ArrowRight size={20} />
                                </Link>
                                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-lg backdrop-blur-sm transition-all">
                                    Learn System
                                </button>
                            </div>
                        </div>
                        <div className="hidden lg:block relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/20 bg-slate-900/50 backdrop-blur-xl p-6">
                                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="text-xs text-slate-400 font-mono ml-4">system_monitor.exe</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
                                        <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400">
                                            <Camera size={24} />
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-400">Camera Feed</div>
                                            <div className="text-white font-bold">Active (1080p)</div>
                                        </div>
                                        <div className="ml-auto text-green-400 text-xs font-mono">LIVE</div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
                                        <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                                            <ScanFace size={24} />
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-400">Face Recognition</div>
                                            <div className="text-white font-bold">Scanning...</div>
                                        </div>
                                        <div className="ml-auto text-blue-400 text-xs font-mono flex gap-1">
                                            <span className="w-1 h-3 bg-blue-400 rounded-full animate-bounce"></span>
                                            <span className="w-1 h-3 bg-blue-400 rounded-full animate-bounce delay-75"></span>
                                            <span className="w-1 h-3 bg-blue-400 rounded-full animate-bounce delay-150"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full text-slate-50 fill-current">
                        <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-2">Core Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Advanced Traffic Intelligence
                        </p>
                        <p className="mt-4 text-xl text-slate-500">
                            Our system combines multiple AI layers to ensure accurate detection and identification in all conditions.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Camera, title: "Plate Detection", desc: "Detects Egyptian license plates even when obscured or dirty using YOLOv8 models.", color: "bg-orange-500" },
                            { icon: ScanFace, title: "Driver ID", desc: "Compares driver's face with the database to ensure the fine goes to the correct person.", color: "bg-blue-500" },
                            { icon: Shield, title: "Electronic Sticker", desc: "Digital identity system using QR codes containing encrypted driver and vehicle data.", color: "bg-teal-500" },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-100 border border-gray-100 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1">
                                <div className={`h-14 w-14 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
