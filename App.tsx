import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Packs from './pages/Packs';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import PublicCalendar from './pages/PublicCalendar';
import ChatBot from './components/ChatBot';
import { Pack, Booking, Slide, ContactInfo, User, PortfolioItem } from './types';
import { db } from './services/supabaseService';
import { LogOut, User as UserIcon, ShieldCheck, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { supabase } from './services/supabaseService'; // ZID EL IMPORT HEDHA


// --- REFACTORED NAVBAR ---
const Navbar: React.FC<{ user: User | null, onLogout: () => void }> = ({ user, onLogout }) => {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');
    const [isDarkMode, setIsDarkMode] = useState(false);

   useEffect(() => {
    const savedTheme = localStorage.getItem('color-theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
    } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
    }
}, []);

    const toggleTheme = () => {
    if (isDarkMode) {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light'; // <--- Zid hedhi
        localStorage.setItem('color-theme', 'light');
        setIsDarkMode(false);
    } else {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark'; // <--- Zid hedhi
        localStorage.setItem('color-theme', 'dark');
        setIsDarkMode(true);
    }
};
    if (isAdminPage) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 text-black dark:text-white transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="text-2xl font-serif tracking-tighter hover:opacity-80 transition">
                    HAMOUDA PHOTOGRAPHY
                </Link>
                <div className="hidden md:flex space-x-8 uppercase text-[10px] tracking-widest font-bold text-zinc-600 dark:text-zinc-400">
                    <Link to="/" className="hover:text-black dark:hover:text-white transition">Accueil</Link>
                    <Link to="/portfolio" className="hover:text-black dark:hover:text-white transition">Portfolio</Link>
                    <Link to="/packs" className="hover:text-black dark:hover:text-white transition">Packs</Link>
                    <Link to="/calendar" className="hover:text-black dark:hover:text-white transition flex items-center gap-1"><CalendarIcon size={12} /> Disponibilité</Link>
                    <Link to="/contact" className="hover:text-black dark:hover:text-white transition">Contact</Link>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="text-zinc-500 hover:text-black dark:hover:text-white transition p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        {isDarkMode ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 5.05A1 1 0 016.465 3.636l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM5 11a1 1 0 100-2H4a1 1 0 100 2h1zM8 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm0-12a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1z"></path></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                        )}
                    </button>

                    {user ? (
                        <div className="flex items-center space-x-4">
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white flex items-center gap-1">
                                    <ShieldCheck size={18} />
                                    <span className="hidden sm:inline uppercase text-[9px] tracking-widest font-bold">Admin</span>
                                </Link>
                            )}
                            <div className="flex items-center space-x-2 text-xs font-bold bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-black dark:text-white">
                                <UserIcon size={14} className="text-zinc-500" />
                                <span className="hidden sm:inline">{user.name}</span>
                            </div>
                            <button onClick={onLogout} className="text-zinc-500 hover:text-red-500 transition-colors">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="text-[10px] bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-sm font-bold uppercase tracking-widest hover:opacity-80 transition">
                            Connexion
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

function App() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [packs, setPacks] = useState<Pack[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [slides, setSlides] = useState<Slide[]>([]);
const [contact, setContact] = useState<ContactInfo>({
  phone: "",
  instagram: "",
  facebook: "",
  email: ""
});    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
        const [chatOpen, setChatOpen] = useState(false);


    useEffect(() => {
        let mounted = true;
        const initApp = async () => {
            try {
                // S'assurer que le mode sombre est appliqué au démarrage si nécessaire
                if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }

                const [p, b, s, u, c, port] = await Promise.all([
    db.getPacks().catch(() => []), // Rod-ha array fergh toul
    db.getBookings().catch(() => []),
    db.getSlides().catch(() => []),
    db.getUsers().catch(() => []),
    db.getContact().catch(() => null), // Rod-ha null
    db.getPortfolio().catch(() => [])
]);

// W fil state:
setPacks(p || []);
setSlides(s || []);
if (c) setContact(c);
            } catch (err) {
                console.error("Critical Init Error:", err);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        initApp();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        const checkSession = async () => {
            // ... session logic
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data: userData } = await supabase.from('users').select('*').eq('id', session.user.id).single();
                if (userData) setUser(userData);
            }
        };
        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session?.user) setUser(null);
        });
        return () => { authListener.subscription.unsubscribe(); };
    }, []);

    // Auto-save interactions omitted for brevity but presumed same...
    useEffect(() => { if (!loading) db.savePacks(packs).catch(console.error); }, [packs, loading]);
    useEffect(() => { if (!loading) db.saveBookings(bookings).catch(console.error); }, [bookings, loading]);
    useEffect(() => { if (!loading) db.saveSlides(slides).catch(console.error); }, [slides, loading]);
    useEffect(() => { if (!loading) db.saveContact(contact).catch(console.error); }, [contact, loading]);

    if (loading) {
        return (
            <div className="h-screen bg-white dark:bg-black flex flex-col items-center justify-center space-y-4 transition-colors duration-300">
                <Loader2 className="text-black dark:text-white animate-spin" size={40} />
                <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-zinc-400">Chargement Studio Hamouda...</p>
            </div>
        );
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <React.Fragment> {/* Use Fragment to avoid extra divs if possible, but HashRouter needs one child usually */}
            <HashRouter>
                <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
                    <Navbar user={user} onLogout={handleLogout} />
                    <main className="flex-grow pt-20">
                        <Routes>
                            <Route path="/" element={<Home slides={slides} packs={packs}  />} />
                            <Route path="/portfolio" element={<Portfolio items={portfolioItems} />} />
                            <Route path="/packs" element={<Packs packs={packs} />} />
                            <Route path="/calendar" element={<PublicCalendar bookings={bookings} setChatOpen={setChatOpen} />} />
                            <Route path="/contact" element={<Contact contact={contact} user={user} />} />

                            <Route path="/login" element={<Login setUser={setUser} />} />
                            <Route
                                path="/admin/*"
                                element={
                                    user?.role === 'admin' ? (
                                        <Admin
                                            packs={packs}
                                            setPacks={setPacks}
                                            bookings={bookings}
                                            setBookings={setBookings}
                                            slides={slides}
                                            setSlides={setSlides}
                                            contact={contact}
                                            setContact={setContact}
                                            users={users}
                                            setUsers={setUsers}
                                            portfolioItems={portfolioItems} // <-- ZEDNA HEDHI
                                            setPortfolioItems={setPortfolioItems} // <-- W ZEDNA HEDHI
                                        />
                                    ) : (
                                        <div className="h-[80vh] flex items-center justify-center font-serif text-2xl text-center px-6">
                                            Accès réservé à Hamdi Hamouda.
                                        </div>
                                    )
                                }
                            />
                        </Routes>
                    </main>
                    <ChatBot bookings={bookings}
                    externalOpen={chatOpen}
                    setExternalOpen={setChatOpen} />
                </div>
            </HashRouter>
        </React.Fragment>
    );
}

export default App;
