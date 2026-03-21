import React, { useState, useEffect, useRef } from 'react'; //useEffect, useRef

// Paths s7a7 (relative)
import { Pack, Booking, Slide, ContactInfo, User, PortfolioItem } from '../types';
import { storage, STORAGE_KEYS } from '../services/storage';
import { db } from '../services/supabaseService';

import {
    LayoutDashboard, Users, Image as ImageIcon, Package, Calendar as CalendarIcon,
    Download, Plus, Trash2, ChevronLeft, ChevronRight, Mail, X, Save, Clock,
    Database, Upload, RefreshCw, Settings, Video , Camera , Play , Check , Aperture
} from 'lucide-react';
import { Link, Routes, Route } from 'react-router-dom';
import { CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';


// 1. Define Props Interface at the top
interface AdminProps {
    packs: Pack[];
    setPacks: React.Dispatch<React.SetStateAction<Pack[]>>;
    bookings: Booking[];
    setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
    slides: Slide[];
    setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;
    contact: ContactInfo;
    setContact: React.Dispatch<React.SetStateAction<ContactInfo>>;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    portfolioItems: PortfolioItem[];
    setPortfolioItems: React.Dispatch<React.SetStateAction<PortfolioItem[]>>;
}

// --- SHARED SIDEBAR ---
const Sidebar = () => (
    <div className="w-64 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 min-h-screen p-6 space-y-8 sticky top-0 flex flex-col transition-colors duration-300">
        <Link to="/" className="text-xl font-serif block mb-8 text-black dark:text-white">Hamdi Admin</Link>
        <div className="space-y-1 flex-grow text-zinc-600 dark:text-zinc-400">
            <Link to="/admin" className="flex items-center space-x-3 p-3 hover:bg-white dark:hover:bg-zinc-900 rounded-lg text-sm transition hover:text-black dark:hover:text-white hover:shadow-sm dark:hover:shadow-none"><LayoutDashboard size={18} /> <span>Dashboard</span></Link>
            <Link to="/admin/calendar" className="flex items-center space-x-3 p-3 hover:bg-white dark:hover:bg-zinc-900 rounded-lg text-sm transition hover:text-black dark:hover:text-white hover:shadow-sm dark:hover:shadow-none"><CalendarIcon size={18} /> <span>Calendrier</span></Link>
            <Link to="/admin/packs" className="flex items-center space-x-3 p-3 hover:bg-white dark:hover:bg-zinc-900 rounded-lg text-sm transition hover:text-black dark:hover:text-white hover:shadow-sm dark:hover:shadow-none"><Package size={18} /> <span>Packs</span></Link>
            <Link to="/admin/portfolio" className="flex items-center space-x-3 p-3 hover:bg-white dark:hover:bg-zinc-900 rounded-lg text-sm transition hover:text-black dark:hover:text-white hover:shadow-sm dark:hover:shadow-none"><Aperture size={18} /> <span>Portfolio</span></Link>
            <Link to="/admin/slides" className="flex items-center space-x-3 p-3 hover:bg-white dark:hover:bg-zinc-900 rounded-lg text-sm transition hover:text-black dark:hover:text-white hover:shadow-sm dark:hover:shadow-none"><ImageIcon size={18} /> <span>Slides</span></Link>
            <Link to="/admin/users" className="flex items-center space-x-3 p-3 hover:bg-white dark:hover:bg-zinc-900 rounded-lg text-sm transition hover:text-black dark:hover:text-white hover:shadow-sm dark:hover:shadow-none"><Users size={18} /> <span>Utilisateurs</span></Link>
            <Link to="/admin/settings" className="flex items-center space-x-3 p-3 hover:bg-white dark:hover:bg-zinc-900 rounded-lg text-sm transition hover:text-black dark:hover:text-white hover:shadow-sm dark:hover:shadow-none"><Settings size={18} /> <span>Data & System</span></Link>
        </div>
        <Link to="/" className="text-[10px] text-zinc-500 uppercase tracking-widest hover:text-black dark:hover:text-white transition">← Retour au Site</Link>
    </div>
);


// --- SETTINGS / DATA VIEW ---
const SettingsView = ({ packs, bookings, slides, contact, users }: AdminProps) => {
    const [syncing, setSyncing] = useState(false);

    const exportData = () => {
        const fullData = { packs, bookings, slides, contact, users, exportDate: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hamouda_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                if (confirm("Hedha bech y-badel el data el kol. T-7eb t-kommel?")) {
                    storage.save(STORAGE_KEYS.PACKS, json.packs);
                    storage.save(STORAGE_KEYS.BOOKINGS, json.bookings);
                    storage.save(STORAGE_KEYS.SLIDES, json.slides);
                    storage.save(STORAGE_KEYS.CONTACT, json.contact);
                    storage.save(STORAGE_KEYS.USERS, json.users);
                    window.location.reload();
                }
            } catch (err) {
                alert("Fichier mouch s7i7! Vérifiez aussi les politiques RLS.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-12 text-black dark:text-white transition-colors">
            <h2 className="text-3xl font-serif">Data & System Control</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl space-y-6 shadow-sm dark:shadow-none transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-zinc-100 dark:bg-white/10 rounded-lg text-black dark:text-white"><Database size={24} /></div>
                        <div>
                            <h3 className="font-bold text-lg uppercase tracking-widest text-[12px]">Backup Manuelle</h3>
                            <p className="text-xs text-zinc-500">Sob el data mte3ek l-kol f fichier wa7dek.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={exportData} className="flex-grow bg-black dark:bg-white text-white dark:text-black py-4 rounded font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-80 transition">
                            <Download size={14} /> Export JSON
                        </button>
                        <label className="flex-grow bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 py-4 rounded font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition cursor-pointer text-black dark:text-white">
                            <Upload size={14} /> Import JSON
                            <input type="file" accept=".json" className="hidden" onChange={importData} />
                        </label>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl space-y-6 shadow-sm dark:shadow-none transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500"><RefreshCw size={24} /></div>
                        <div>
                            <h3 className="font-bold text-lg uppercase tracking-widest text-[12px]">Cloud Sync Status</h3>
                            <p className="text-xs text-zinc-500">Mode: 100% Local (No limits)</p>
                        </div>
                    </div>
                    <div className="p-4 bg-black rounded-lg border border-zinc-800">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                            <span>Storage Usage</span>
                            <span>0.02 / 500 MB</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-white w-[2%]" />
                        </div>
                    </div>
                    <button
                        onClick={async () => {
                            setSyncing(true);
                            await Promise.all([
                                db.savePacks(packs),
                                db.saveBookings(bookings),
                                db.saveSlides(slides),
                                db.saveContact(contact)
                            ]);
                            setTimeout(() => setSyncing(false), 2000);
                        }}
                        className="w-full text-zinc-500 text-[10px] uppercase font-bold tracking-widest hover:text-white transition"
                    >
                        {syncing ? 'Syncing...' : 'Force Cloud Update'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- DASHBOARD VIEW ---
// @ts-ignore
import jsPDF from 'jspdf';
// @ts-ignore
import autoTable from 'jspdf-autotable';

/// --- DASHBOARD VIEW ---
const DashboardView = ({ bookings, users, packs }: { bookings: Booking[], users: User[], packs: Pack[] }) => {
    
    // Logic mta3 el waqt bech na3rfou el chhar el jary
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1. KPI: Revenu Mensuel (Initialisation auto kol chhar)
    // Ne7sbou ken el bookings mta3 el chhar hedha w el 3am hedha
    const monthlyRevenue = bookings
        .filter(b => {
            const bookingDate = new Date(b.date);
            return (
                bookingDate.getMonth() === currentMonth && 
                bookingDate.getFullYear() === currentYear
            );
        })
        .reduce((acc, b) => {
            const pack = packs.find(p => p.id === b.pack_id || p.id === b.id);
            if (!pack) return acc;
            const price = parseInt(pack.price.replace(/[^0-9]/g, '')) || 0;
            return acc + price;
        }, 0);

    // 2. KPI: Clients (Ne7sbou el 3bed li 3amlet rdv)
    // Nesta3mlou Set bech ma na7sbouch nafs el client marrtin ken 3mal 2 rdv
    const totalClients = new Set(bookings.map(b => b.clientName)).size;

    // 3. KPI: Total Réservations
    const totalBookings = bookings.length;

    // Data for Graphs
    const bookingsByMonth = Array.from({ length: 12 }, (_, i) => {
        const monthName = new Date(0, i).toLocaleString('default', { month: 'short' });
        const revenue = bookings.filter(b => new Date(b.date).getMonth() === i).reduce((acc, b) => {
            const pack = packs.find(p => p.id === b.pack_id || p.id === b.id);
            const price = pack ? (parseInt(pack.price.replace(/[^0-9]/g, '')) || 0) : 0;
            return acc + price;
        }, 0);
        return { name: monthName, revenue };
    });

    const bookingsByPack = packs.map(p => ({
        name: p.name,
        value: bookings.filter(b => b.pack_id === p.id).length
    }));

    const COLORS_LIGHT = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];
    const COLORS_DARK = ["#60a5fa", "#a78bfa", "#f472b6", "#fbbf24", "#34d399"];

    const generateReport = () => {
        const doc = new jsPDF();
        doc.setFillColor(0, 0, 0);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text("HAMOUDA PHOTOGRAPHY", 105, 20, { align: 'center' });
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Rapport Mensuel: ${now.toLocaleString('default', { month: 'long' })} ${currentYear}`, 14, 50);
        doc.text(`Revenu du mois: ${monthlyRevenue} DT`, 14, 60);

        const tableData = bookings
            .filter(b => new Date(b.date).getMonth() === currentMonth)
            .map(b => [b.date, b.clientName, packs.find(p => p.id === b.pack_id)?.name || 'Custom']);

        autoTable(doc, {
            head: [['Date', 'Client', 'Pack']],
            body: tableData,
            startY: 75,
            headStyles: { fillColor: [0, 0, 0] }
        });

        doc.save(`rapport_hamouda_${now.getMonth()+1}.pdf`);
    };

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-center text-black dark:text-white">
                <h2 className="text-3xl font-serif">Tableau de Bord</h2>
                <button onClick={generateReport} className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition">
                    <Download size={14} /> Télécharger Rapport
                </button>
            </div>

            {/* KPI Cards (3 Cards now) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Revenu du Mois', val: `${monthlyRevenue.toLocaleString()} DT`, icon: <Database size={16} /> },
                    { label: 'Total Réservations', val: totalBookings, icon: <CalendarIcon size={16} /> },
                    { label: 'Nombre de Clients', val: totalClients, icon: <Users size={16} /> }
                ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-start shadow-sm dark:shadow-none transition-colors">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">{s.label}</p>
                            <p className="text-3xl font-serif text-black dark:text-white">{s.val}</p>
                        </div>
                        <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-400">{s.icon}</div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-900 h-80 transition-colors">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Évolution Revenu (DT)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={bookingsByMonth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#52525b" vertical={false} />
                            <XAxis dataKey="name" stroke="#52525b" fontSize={10} />
                            <YAxis stroke="#52525b" fontSize={10} />
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fff' }} />
                            <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-900 h-80 transition-colors">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Popularité des Packs</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={bookingsByPack}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                            <XAxis dataKey="name" stroke="#52525b" fontSize={10} />
                            <YAxis stroke="#52525b" fontSize={10} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#000', border: '1px solid #27272a' }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                {bookingsByPack.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={document.documentElement.classList.contains("dark") ? COLORS_DARK[index % COLORS_DARK.length] : COLORS_LIGHT[index % COLORS_LIGHT.length]} 
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// --- CALENDAR VIEW ---
const CalendarView = ({ bookings, setBookings, packs }: { bookings: Booking[], setBookings: React.Dispatch<React.SetStateAction<Booking[]>>, packs: Pack[] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    // State for Form
    const [editingId, setEditingId] = useState<number | string | null>(null);
    const [formData, setFormData] = useState({ clientName: '', packId: packs[0]?.id || '', description: '', time: '10:00', priceOverride: '' });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    const resetForm = () => {
        setEditingId(null);
        setFormData({ clientName: '', packId: packs[0]?.id || '', description: '', time: '10:00', priceOverride: '' });
    };

    const handleSaveBooking = async () => {
        if (!selectedDate || !formData.clientName) return;

        const bookingBase = {
            user_id: 'admin_manual',
            clientName: formData.clientName,
            date: selectedDate,
            time: formData.time,
            status: 'confirmed' as const,
            pack_id: formData.packId,
            description: formData.description
        };

        if (editingId) {
            // EDIT MODE
            const updatedBookings = bookings.map(b => b.id === editingId ? { ...b, ...bookingBase } : b);
            setBookings(updatedBookings);
            await db.saveBookings(updatedBookings); // Auto-save trigger
        } else {
            // ADD MODE
            const newBooking: Booking = { ...bookingBase, id: Date.now() };
            setBookings([...bookings, newBooking]);
            // db.saveBookings will be triggered by effect in Parent
        }

        resetForm();
    };

    const handleEditClick = (b: Booking) => {
        setEditingId(b.id);
        setFormData({
            clientName: b.clientName,
            packId: b.pack_id || packs[0]?.id || '',
            description: b.description || '',
            time: b.time || '10:00',
            priceOverride: ''
        });
    };

    const generateInvoice = (b: Booking) => {
        const doc = new jsPDF();
        const pack = packs.find(p => p.id === b.pack_id);

        // --- LOGO / HEADER ---
        doc.setFillColor(0, 0, 0); // Black Header
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("times", "bold");
        doc.text("HAMOUDA PHOTOGRAPHY", 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("FACTURE / DEVIS", 105, 32, { align: 'center' });

        // Reset
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        doc.text(`Date d'émission: ${new Date().toLocaleDateString()}`, 14, 50);
        doc.text(`Réf: #INV-${b.id}`, 14, 55);

        // Client Details Box
        doc.setDrawColor(0, 0, 0);
        doc.line(14, 60, 196, 60);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("CLIENT:", 14, 70);
        doc.setFont("helvetica", "normal");
        doc.text(b.clientName, 14, 76);
        doc.text(`Événement le: ${b.date} à ${b.time}`, 14, 82);

        // Items
        const items = [
            [pack?.name || 'Service Photographie', pack?.price || 'Sur Devis']
        ];

        if (b.description) {
            items.push(['Notes / Description', b.description]);
        }

        autoTable(doc, {
            head: [['Désignation', 'Prix / Détails']],
            body: items,
            startY: 95,
            theme: 'grid',
            headStyles: { fillColor: [0, 0, 0], textColor: 255, fontStyle: 'bold' },
            styles: { cellPadding: 5 }
        });

        // Footer
        // @ts-ignore
        const finalY = doc.lastAutoTable?.finalY || 150;
        doc.setFontSize(10);
        doc.text("Merci de votre confiance.", 105, finalY + 20, { align: 'center' });
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text("Hamouda Photography - Studio Professionnel", 105, finalY + 25, { align: 'center' });

        doc.save(`facture_${b.clientName}.pdf`);
    };

    return (
        <div className="space-y-8 text-black dark:text-white transition-colors">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-serif">Gestion Planning</h2>
                <div className="flex items-center gap-6 bg-white dark:bg-zinc-900 px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none transition-colors">
                    <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="hover:text-zinc-600 dark:hover:text-zinc-400 transition"><ChevronLeft /></button>
                    <span className="text-sm font-bold uppercase tracking-widest min-w-[150px] text-center text-black dark:text-white">{monthName} {year}</span>
                    <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="hover:text-zinc-600 dark:hover:text-zinc-400 transition"><ChevronRight /></button>
                </div>
            </div>
            <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 relative transition-colors">
                <div className="grid grid-cols-7 gap-4 text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-8">
                    {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-4">
                    {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="h-32 bg-transparent"></div>)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                        const dayBookings = bookings.filter(b => b.date === dStr).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
                        return (
                            <div
                                key={day}
                                onClick={() => { setSelectedDate(dStr); setShowModal(true); resetForm(); }}
                                className={`h-32 border border-zinc-200 dark:border-zinc-900 rounded-lg p-3 text-xs flex flex-col gap-2 hover:border-zinc-400 dark:hover:border-zinc-500 cursor-pointer transition ${dayBookings.length > 0 ? 'bg-zinc-50 dark:bg-zinc-900/50' : 'bg-transparent dark:bg-black/40'}`}
                            >
                                <span className={`font-bold text-sm ${dayBookings.length > 0 ? 'text-black dark:text-white' : 'text-zinc-400 dark:text-zinc-700'}`}>{day}</span>
                                {dayBookings.map(b => (
                                    <div key={b.id} className="bg-white text-black p-1.5 rounded text-[7px] font-bold uppercase tracking-tighter truncate leading-none">
                                        {b.time} - {b.clientName}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence>
                {showModal && selectedDate && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white/80 dark:bg-black/98 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full max-w-5xl h-[90vh] flex rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

                            {/* LEFT: FORM */}
                            <div className="w-1/3 border-r border-zinc-200 dark:border-zinc-800 p-8 flex flex-col gap-6 bg-zinc-50 dark:bg-zinc-900/50">
                                <h3 className="text-xl font-serif text-black dark:text-white">{editingId ? "Modifier le RDV" : "Nouveau RDV"}</h3>
                                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">{selectedDate}</p>

                                <div className="space-y-4 flex-grow overflow-y-auto">
                                    <input
                                        placeholder="Nom du Client"
                                        className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm outline-none focus:border-black dark:focus:border-white rounded text-black dark:text-white transition"
                                        value={formData.clientName}
                                        onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                                    />
                                    <input
                                        type="time"
                                        className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm outline-none focus:border-black dark:focus:border-white rounded text-black dark:text-white transition"
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    />
                                    <select
                                        className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm outline-none rounded text-zinc-700 dark:text-zinc-300 focus:border-black dark:focus:border-white transition"
                                        value={formData.packId}
                                        onChange={e => setFormData({ ...formData, packId: e.target.value })}
                                    >
                                        {packs.map(p => <option key={p.id} value={p.id}>{p.name} - {p.price}</option>)}
                                    </select>
                                    <textarea
                                        placeholder="Description / Notes"
                                        className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 px-4 py-3 text-sm outline-none focus:border-black dark:focus:border-white rounded resize-none text-black dark:text-white h-32 transition"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                                    <button onClick={handleSaveBooking} className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded font-bold uppercase tracking-widest text-[10px] hover:opacity-80 transition flex items-center justify-center gap-2">
                                        <Save size={14} /> {editingId ? "Mettre à jour" : "Enregistrer"}
                                    </button>
                                    {editingId && (
                                        <button onClick={resetForm} className="w-full bg-zinc-800 text-zinc-400 py-3 rounded font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-700 transition">
                                            Annuler Modification
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT: LIST */}
                            <div className="w-2/3 p-8 flex flex-col relative bg-white dark:bg-black/50">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-serif text-black dark:text-white">Réservations du {selectedDate}</h3>
                                    <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-black dark:hover:text-white p-2 bg-zinc-100 dark:bg-zinc-900 rounded-full"><X size={20} /></button>
                                </div>
                                <div className="space-y-4 overflow-y-auto flex-grow pr-2">
                                    {bookings.filter(b => b.date === selectedDate).sort((a, b) => (a.time || '').localeCompare(b.time || '')).map(b => (
                                        <div
                                            key={b.id}
                                            onClick={() => handleEditClick(b)}
                                            className={`border p-6 rounded-xl relative group cursor-pointer transition-all duration-300 hover:shadow-xl ${editingId === b.id ? 'bg-zinc-100 dark:bg-zinc-900 border-black dark:border-white ring-1 ring-black dark:ring-white' : 'bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 hover:border-zinc-500 dark:hover:border-zinc-600'}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-lg text-black dark:text-white">{b.clientName}</p>
                                                    <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mt-1">
                                                        {b.time} | {packs.find(p => p.id === b.pack_id)?.name}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); generateInvoice(b); }}
                                                        className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition"
                                                        title="Télécharger Facture PDF"
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                    <button
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            if (confirm(`Supprimer la réservation pour "${b.clientName}"?`)) {
                                                                await db.deleteBooking(b.id);
                                                                setBookings(bookings.filter(item => item.id !== b.id));
                                                                if (editingId === b.id) resetForm();
                                                            }
                                                        }}
                                                        className="p-2 text-zinc-400 hover:text-red-500 bg-zinc-100 dark:bg-zinc-900 hover:bg-red-500/10 rounded-lg transition"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            {b.description && <p className="text-sm text-zinc-400 mt-4 italic border-l-2 border-zinc-800 pl-4 break-all">{b.description}</p>}
                                        </div>
                                    ))}
                                    {bookings.filter(b => b.date === selectedDate).length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-full text-zinc-600 pb-20">
                                            <CalendarIcon size={48} className="mb-4 opacity-20" />
                                            <p className="font-serif italic">Aucune réservation pour cette date.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


// --- PACKS MANAGEMENT (Admin Side) ---
const PacksManagement = ({ packs, setPacks }: { packs: Pack[], setPacks: React.Dispatch<React.SetStateAction<Pack[]>> }) => (
    <div className="space-y-10 text-black dark:text-white transition-colors pb-10">
        <div className="flex justify-between items-end border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div>
                <h2 className="text-4xl font-serif tracking-tight">Gestion des Packs</h2>
                <p className="text-zinc-500 text-sm mt-2 font-medium">Configurez vos offres et marquez le pack "Populaire".</p>
            </div>
            <button
                onClick={async () => {
                    const newPackData = { name: 'Nouveau Pack', price: '0 DT', features: ['Feature 1'], popularity: false};
                    const addedPack = await db.addPack(newPackData);
                    if (addedPack) setPacks([...packs, addedPack]);
                }}
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-lg active:scale-95"
            >
                <Plus size={16} strokeWidth={3} /> Nouveau Pack
            </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {packs.map((pack, idx) => (
                <div key={pack.id} className={`group relative p-8 rounded-3xl border transition-all duration-500 shadow-sm hover:shadow-2xl ${pack.popularity ? 'border-fuchsia-500/50 bg-fuchsia-50/10 dark:bg-fuchsia-900/5' : 'bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/50'}`}>
                    
           {/* Toggle Popularité (Boolean Version) */}
<div className="absolute top-6 right-16 flex items-center gap-2">
    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">
        {pack.popularity ? '🔥 Vedette' : 'Normal'}
    </span>
    <button 
        onClick={async () => {
            const next = [...packs];
            //  Toggle el status (True -> False / False -> True)
            const newStatus = !next[idx].popularity;
            next[idx].popularity = newStatus;

            //  Update el UI toul (Optimistic)
            setPacks(next);

            //  Update Supabase (Column 'popularity' type bool)
            try {
                await db.updatePack(pack.id, { popularity: newStatus });
                console.log("✅ Status updated in DB:", newStatus);
            } catch (err) {
                console.error("🔴 DB Error:", err);
                // Rollback ken saret mochkla
                next[idx].popularity = !newStatus;
                setPacks([...next]);
            }
        }}
        className={`w-10 h-5 rounded-full transition-all duration-300 relative ${
            pack.popularity ? 'bg-fuchsia-600' : 'bg-zinc-300 dark:bg-zinc-700'
        }`}
    >
        {/* El Kaboura (The Dot) */}
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${
            pack.popularity ? 'left-6' : 'left-1'
        }`} />
    </button>
</div>

                    <button
                        onClick={async () => {
                            if (confirm(`Fasakh "${pack.name}"?`)) {
                                await db.deletePack(pack.id);
                                setPacks(packs.filter(p => p.id !== pack.id));
                            }
                        }}
                        className="absolute top-6 right-6 p-2 text-zinc-300 hover:text-red-500"
                    >
                        <Trash2 size={18} />
                    </button>

                    <div className="space-y-6">
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Nom du Service</span>
                            <input 
                                className="bg-transparent text-2xl font-serif outline-none w-full border-b border-transparent focus:border-zinc-300 pb-1" 
                                value={pack.name} 
                                onChange={e => { const next = [...packs]; next[idx].name = e.target.value; setPacks(next); }} 
                            />
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold block mb-1">Tarif</span>
                            <input 
                                className="bg-transparent text-3xl font-bold outline-none w-full" 
                                value={pack.price} 
                                onChange={e => { const next = [...packs]; next[idx].price = e.target.value; setPacks(next); }} 
                            />
                        </div>

                        {/* Features Loop... (yokeed kima houa) */}
                        <div className="space-y-4">
                            {pack.features.map((f, fIdx) => (
                                <div key={fIdx} className="flex items-center gap-3">
                                    <input 
                                        className="bg-transparent border-b border-zinc-100 dark:border-zinc-800 text-sm outline-none w-full py-1" 
                                        value={f} 
                                        onChange={e => { const next = [...packs]; next[idx].features[fIdx] = e.target.value; setPacks(next); }} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
// --- SLIDES MANAGEMENT ---
const SlidesManagement = ({ slides, setSlides }: { slides: Slide[], setSlides: React.Dispatch<React.SetStateAction<Slide[]>> }) => (
    <div className="space-y-10 text-black dark:text-white transition-colors pb-10">
        
        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div>
                <h2 className="text-4xl font-serif tracking-tight">Slides du Home</h2>
                <p className="text-zinc-500 text-sm mt-2 font-medium">Gérez les images héroïnes de votre page d'accueil.</p>
            </div>
            <button
                onClick={() =>
                    setSlides([
                        ...slides,
                        {
                            id: Date.now().toString(),
                            url: slides[0]?.url || '',
                            title: 'Nouvelle Slide',
                            posY: 50
                        }
                    ])
                }
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-lg active:scale-95"
            >
                <Plus size={16} strokeWidth={3} /> Ajouter Slide
            </button>
        </div>

        {/* Slides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {slides.map((slide, idx) => (
                <div key={slide.id} className="group bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800/50 shadow-sm hover:shadow-2xl transition-all duration-500 relative">
                    
                    {/* Image Preview Container */}

<div className="relative h-64 overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
  {/* IMAGE FIL ADMIN - SlidesManagement.tsx */}
<img
    src={slide.url}
    
    style={{ objectPosition: `50% ${slide.posY ?? 50}%` }}
    className="w-full h-48 object-cover opacity-80 dark:opacity-50 transition group-hover:opacity-100"
/>
    
    {/* Overlay Line bech nchouf el Focus Focus win s7i7 */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-[1px] bg-white/30 border-b border-black/10"></div>
    </div>
</div>
                       

                    <div className="p-6 space-y-6">
                        {/* Title Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-black">Titre de la Slide</label>
                            <input
                                className="bg-transparent border-b border-zinc-200 dark:border-zinc-800 text-lg font-serif w-full outline-none focus:border-black dark:focus:border-white transition-all text-black dark:text-white pb-1"
                                value={slide.title}
                                onChange={e => {
                                    const next = [...slides];
                                    next[idx].title = e.target.value;
                                    setSlides(next);
                                }}
                            />
                        </div>

                        {/* Position Control (Range slider styled) */}
                        <div className="space-y-3 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-black">Focus Vertical</label>
                                <span className="text-[10px] font-mono text-zinc-500">{slide.posY ?? 50}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={slide.posY ?? 50}
                                onChange={(e) => {
                                    const next = [...slides];
                                    next[idx].posY = Number(e.target.value);
                                    setSlides(next);
                                }}
                                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                            />
                        </div>

                        {/* Actions (Upload & Delete) */}
                        <div className="flex items-center justify-between pt-2">
                            <label className="cursor-pointer flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
                                <Camera size={14} />
                                Remplacer
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = () => {
                                                const next = [...slides];
                                                next[idx].url = reader.result as string;
                                                setSlides(next);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>

                            <button
                                onClick={async () => {
                                    if (confirm(`Supprimer le slide "${slide.title}"?`)) {
                                        await db.deleteSlide(slide.id);
                                        setSlides(slides.filter(s => s.id !== slide.id));
                                    }
                                }}
                                className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full"
                                title="Supprimer la slide"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
// --- PORTFOLIO MANAGEMENT ---
const PortfolioManagement = ({ items, setItems }: { items: PortfolioItem[], setItems: React.Dispatch<React.SetStateAction<PortfolioItem[]>> }) => {
    const [uploading, setUploading] = useState(false);
    const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({ category: 'Wedding', type: 'image', title: '' });

    // Sauvegarde auto
    useEffect(() => {
        const handler = setTimeout(() => {
            if (items.length > 0) {
                db.savePortfolioItems(items);
            }
        }, 1000);
        return () => clearTimeout(handler);
    }, [items]);

    const handleAddItem = async () => {
        if (!newItem.url) return alert("L'URL est requise!");
        const itemData = {
            url: newItem.url,
            category: newItem.category || 'Wedding',
            type: newItem.type || 'image',
            title: newItem.title || '',
            thumbnail: newItem.type === 'video' ? newItem.thumbnail : undefined
        };

        const addedItem = await db.addPortfolioItem(itemData);
        if (addedItem) {
            setItems([...items, addedItem]);
            setNewItem({ category: 'Wedding', type: 'image', title: '' });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'url' | 'thumbnail') => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const publicUrl = await db.uploadPortfolioFile(file);
        setUploading(false);
        if (publicUrl) {
            setNewItem(prev => ({ ...prev, [field]: publicUrl }));
        }
    };

    return (
        <div className="space-y-12 pb-20 text-black dark:text-white transition-colors">
            {/* Header Section */}
            <div className="flex flex-col gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-8">
                <h2 className="text-4xl font-serif tracking-tight flex items-center gap-4">
                    <Database className="text-zinc-400" size={28} /> Portfolio
                </h2>
                <p className="text-zinc-500 text-sm font-medium tracking-wide">Interface de gestion du contenu visuel.</p>
            </div>

            {/* --- Formulaire d'Ajout Style "Apple Store" --- */}
            <div className="bg-white dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 p-10 shadow-2xl relative overflow-hidden">
                <div className="grid lg:grid-cols-12 gap-12 relative z-10">
                    
                    {/* Left Side: Metadata */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-xs uppercase tracking-[0.4em] font-black text-zinc-400 flex items-center gap-2">
                                <Plus size={14} strokeWidth={3} /> Détails de l'élément
                            </h3>
                            
                            <input
                                type="text"
                                placeholder="Nom du shooting (ex: Mariage de Sarra & Ali)"
                                value={newItem.title || ''}
                                onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                className="w-full bg-zinc-100 dark:bg-zinc-800/50 border-none rounded-2xl px-6 py-4 text-base outline-none focus:ring-2 ring-zinc-300 dark:ring-zinc-600 transition-all placeholder:text-zinc-400"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-2">Catégorie</label>
                                    <select
                                        value={newItem.category}
                                        onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                        className="w-full bg-zinc-100 dark:bg-zinc-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold appearance-none cursor-pointer outline-none hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                    >
                                        <option value="Wedding">💍 Wedding</option>
                                        <option value="Portrait">🧑 Portrait</option>
                                        <option value="Event">🎉 Event</option>
                                        <option value="Commercial">🏢 Commercial</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-2">Type de Média</label>
                                    <select
                                        value={newItem.type}
                                        onChange={e => setNewItem({ ...newItem, type: e.target.value as any })}
                                        className="w-full bg-zinc-100 dark:bg-zinc-800/50 border-none rounded-2xl px-5 py-4 text-sm font-bold appearance-none cursor-pointer outline-none hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                    >
                                        <option value="image">📷 Image</option>
                                        <option value="video">🎬 Vidéo</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={uploading || !newItem.url}
                            onClick={handleAddItem}
                            className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:opacity-90 active:scale-[0.98] disabled:opacity-20 disabled:grayscale transition-all shadow-xl flex items-center justify-center gap-3"
                        >
                            <Save size={16} /> {uploading ? 'Traitement...' : 'Publier dans la galerie'}
                        </button>
                    </div>

                    {/* Right Side: Upload Zones */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {/* Main File */}
                        <div className={`relative h-full min-h-[180px] border-2 border-dashed ${newItem.url ? 'border-green-500' : 'border-zinc-300 dark:border-zinc-700'} rounded-[2rem] flex flex-col items-center justify-center p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all group`}>
                            <input 
                                type="file" 
                                onChange={(e) => handleFileUpload(e, 'url')} 
                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                accept={newItem.type === 'video' ? 'video/*' : 'image/*'}
                            />
                            {newItem.url ? (
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"><Check size={24} /></div>
                                    <p className="text-xs font-bold text-green-500 uppercase tracking-widest">Fichier Chargé</p>
                                </div>
                            ) : (
                                <div className="text-center space-y-3">
                                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform"><Camera size={24} /></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Glisser le fichier {newItem.type}</p>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Zone (Video Only) */}
                        {newItem.type === 'video' && (
                            <div className={`relative h-[120px] border-2 border-dashed ${newItem.thumbnail ? 'border-blue-500' : 'border-zinc-300 dark:border-zinc-700'} rounded-[1.5rem] flex flex-col items-center justify-center p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all animate-in zoom-in-95 duration-300`}>
                                <input type="file" onChange={(e) => handleFileUpload(e, 'thumbnail')} className="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" />
                                {newItem.thumbnail ? (
                                    <div className="flex items-center gap-4">
                                        <img src={newItem.thumbnail} className="w-16 h-12 object-cover rounded-lg border border-white/20 shadow-md" />
                                        <p className="text-[9px] font-black uppercase tracking-widest text-blue-500">Thumbnail OK</p>
                                    </div>
                                ) : (
                                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 text-center">Ajouter une image de couverture</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Galerie Grid (More spacing & hover) --- */}
            <div className="space-y-8">
                <div className="flex justify-between items-center px-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Archives ({items.length})</h3>
                    <div className="flex gap-2">
                        {['Wedding', 'Portrait', 'Event', 'Commercial'].map(cat => (
                           <span key={cat} className="text-[8px] bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full font-bold uppercase text-zinc-500">{cat}</span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {items.map((item, index) => (
                        <div key={item.id} className="group relative aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-500">
                            {/* Logic mta3 Thumbnail  */}
                            <img
                                src={item.type === 'video' ? (item.thumbnail || 'https://via.placeholder.com/400x500?text=Video+No+Thumb') : item.url}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col justify-between">
                                <button
                                    onClick={async () => {
                                        if (confirm("Supprimer définitivement?")) {
                                            await db.deletePortfolioItem(item.id);
                                            setItems(items.filter(i => i.id !== item.id));
                                        }
                                    }}
                                    className="self-end p-2.5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl hover:bg-red-500 hover:border-red-500 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>

                                <div className="space-y-2">
                                    <input
                                        value={item.title || ''}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index].title = e.target.value;
                                            setItems(newItems);
                                        }}
                                        className="bg-transparent text-white font-serif text-lg border-b border-white/20 focus:border-white outline-none w-full"
                                    />
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">{item.category}</span>
                                        {item.type === 'video' && <Play size={12} fill="white" className="text-white" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- MAIN ADMIN COMPONENT ---
const Admin: React.FC<AdminProps> = (props) => {

    // useEffect hooks bch nsajlou el data automatiquement
    const useDebouncedEffect = (effect: () => void, deps: any[], delay: number) => {
        const isInitialMount = useRef(true);
        useEffect(() => {
            if (isInitialMount.current) {
                isInitialMount.current = false;
                return;
            }
            const handler = setTimeout(() => effect(), delay);
            return () => clearTimeout(handler);
        }, deps);
    };

    useDebouncedEffect(() => {
        console.log("Auto-saving packs to Supabase...");
        db.savePacks(props.packs);
    }, [props.packs], 1000);

    useDebouncedEffect(() => {
        console.log("Auto-saving bookings to Supabase...");
        db.saveBookings(props.bookings);
    }, [props.bookings], 1000);

    useDebouncedEffect(() => {
        console.log("Auto-saving slides to Supabase...");
        db.saveSlides(props.slides);
    }, [props.slides], 1000);

    /* --- PORTFOLIO EFFECT (Not needed if we save directly on Add/Delete) ---
       But if we add edit feature later, we might need it. 
       For now, Add/Delete calls db directly in component.
    */


    return (
        <div className="h-screen fixed inset-0 bg-black overflow-hidden flex text-white font-sans">
            <Sidebar />
            <div className="flex-grow h-full overflow-y-auto p-10 bg-zinc-50 dark:bg-zinc-950/30">
                <Routes>
                    <Route path="/" element={<DashboardView bookings={props.bookings} users={props.users} packs={props.packs} />} />
                    <Route path="/calendar" element={<CalendarView bookings={props.bookings} setBookings={props.setBookings} packs={props.packs} />} />
                    <Route path="/packs" element={<PacksManagement packs={props.packs} setPacks={props.setPacks} />} />
                    <Route path="/portfolio" element={<PortfolioManagement items={props.portfolioItems} setItems={props.setPortfolioItems} />} />
                    <Route path="/slides" element={<SlidesManagement slides={props.slides} setSlides={props.setSlides} />} />
                    <Route path="/users" element={
                        <div className="space-y-8 text-white">
                            <h2 className="text-3xl font-serif">Utilisateurs</h2>
                            {/* --- ZID EL BOUTON HEDHA --- */}
                            <button
                                onClick={async () => {
                                    console.log("🟡 Rafraîchissement de la liste des utilisateurs...");
                                    const latestUsers = await db.getUsers(); // Nejbdou el lista el jdida
                                    props.setUsers(latestUsers); // N'actualisiw el state
                                    console.log("✅ Liste des utilisateurs mise à jour!");
                                }}
                                className="bg-zinc-800 text-white px-4 py-2 rounded font-bold text-xs uppercase tracking-widest hover:bg-zinc-700"
                            >
                                Rafraîchir
                            </button>
                            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                                <table className="w-full text-left">

                                    <thead className="bg-zinc-950 text-[10px] uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-800">

                                        <tr><th className="p-4">Nom</th><th className="p-4">Email</th><th className="p-4">Rôle</th><th className="p-4">Actions</th><th className="p-4">Delete</th></tr>
                                    </thead>
                                    <tbody>
                                        {props.users.map(u => (
                                            <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                                                <td className="p-4 font-bold">{u.name}</td>
                                                <td className="p-4 text-zinc-400">{u.email}</td>
                                                <td className="p-4"><span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${u.role === 'admin' ? 'bg-white text-black' : 'bg-zinc-800'}`}>{u.role}</span></td>
                                                <td className="p-4"><button className="text-zinc-600 hover:text-white"><Mail size={16} /></button></td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={async () => {
                                                            // Ma t'fassakhch l'admin principal
                                                            if (u.email === 'hamdi@hamouda.tn') {
                                                                alert("Impossible de supprimer le compte admin principal.");
                                                                return;
                                                            }
                                                            if (confirm(`Supprimer l'utilisateur "${u.name}"?`)) {
                                                                await db.deleteUser(u.id);
                                                                props.setUsers(props.users.filter(user => user.id !== u.id));
                                                            }
                                                        }}
                                                        className="text-zinc-600 hover:text-red-500"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>

                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    } />
                    <Route path="/settings" element={<SettingsView {...props} />} />
                </Routes>
            </div>
        </div>
    );
};

export default Admin;