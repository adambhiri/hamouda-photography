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
import { LogOut, User as UserIcon, ShieldCheck, Calendar as CalendarIcon, Loader2 , X , Menu } from 'lucide-react';
import { supabase } from './services/supabaseService'; // ZID EL IMPORT HEDHA


const Navbar: React.FC<{ user: any, onLogout: () => void }> = ({ user, onLogout }) => {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Sync Dark Mode
    useEffect(() => {
        const savedTheme = localStorage.getItem('color-theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
            setIsDarkMode(true);
        }
    };

    if (isAdminPage) return null;

    const navLinks = [
        { name: 'Accueil', path: '/' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Packs', path: '/packs' },
        { name: 'Disponibilité', path: '/calendar', icon: <CalendarIcon size={12} /> },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 text-black dark:text-white transition-all">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                
                {/* LOGO */}
                <Link to="/" className="text-xl md:text-2xl font-serif tracking-tighter hover:opacity-80 transition z-50">
                    HAMOUDA PHOTOGRAPHY
                </Link>

                {/* DESKTOP MENU (Hidden on Mobile/Tablet) */}
                <div className="hidden lg:flex space-x-8 uppercase text-[10px] tracking-widest font-bold text-zinc-600 dark:text-zinc-400">
                    {navLinks.map((link) => (
                        <Link key={link.path} to={link.path} className="hover:text-black dark:hover:text-white transition flex items-center gap-1">
                            {link.icon} {link.name}
                        </Link>
                    ))}
                </div>

                {/* RIGHT SECTION (Theme + Admin + Hamburger) */}
                <div className="flex items-center space-x-2 md:space-x-4">
                    <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>

                    {user ? (
                        <div className="flex items-center space-x-2 md:space-x-4">
                            <Link to="/admin" className="text-zinc-500 dark:text-zinc-400 hover:text-black"><ShieldCheck size={20}/></Link>
                            <button onClick={onLogout} className="text-zinc-500 hover:text-red-500"><LogOut size={20}/></button>
                        </div>
                    ) : (
                        /* El Bouton Connexion na7ineha mel Desktop - t-najem t-khalliha ken t-heb */
                        null 
                    )}

                    {/* HAMBURGER ICON (Visible on Mobile & Tablet) */}
                    <button 
                        className="lg:hidden z-50 p-2 text-zinc-600 dark:text-zinc-400"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* MOBILE & TABLET OVERLAY MENU */}
            <div className={`
                fixed inset-0 bg-white dark:bg-black z-40 flex flex-col items-center justify-center space-y-8 transition-transform duration-500 ease-in-out
                ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                lg:hidden
            `}>
                <div className="flex flex-col items-center space-y-6 text-center">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.path} 
                            to={link.path} 
                            onClick={() => setIsMenuOpen(false)}
                            className="text-2xl uppercase tracking-[0.3em] font-light hover:text-zinc-500 transition"
                        >
                            {link.name}
                        </Link>
                    ))}
                    
                    {/* Secret Admin Link in Mobile Menu (Optional) */}
                    {!user && (
                        <Link 
                            to="/login" 
                            onClick={() => setIsMenuOpen(false)}
                            className="mt-10 text-[10px] text-zinc-400 uppercase tracking-widest"
                        >
                            Espace Photographe
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
