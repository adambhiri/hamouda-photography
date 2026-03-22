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
import { LogOut, User as UserIcon, ShieldCheck, Calendar as CalendarIcon, Loader2 , X , Menu , Camera , Package , Mail , Home as LucideHome , Sun , Moon} from 'lucide-react';
import { supabase } from './services/supabaseService'; // ZID EL IMPORT HEDHA


const Navbar: React.FC<{ user: any, onLogout: () => void }> = ({ user, onLogout }) => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Init m'al localStorage walla system preference
        return document.documentElement.classList.contains('dark');
    });

    // Toggle Logic
    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // Toggle Menu Lock Scroll
    useEffect(() => {
        if (isMenuOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isMenuOpen]);

    const navLinks = [
        { name: 'Accueil', path: '/', icon: <LucideHome size={18} /> },
        { name: 'Portfolio', path: '/portfolio', icon: <Camera size={18} /> },
        { name: 'Packs', path: '/packs', icon: <Package size={18} /> },
        { name: 'Disponibilité', path: '/calendar', icon: <CalendarIcon size={18} /> },
        { name: 'Contact', path: '/contact', icon: <Mail size={18} /> },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-[60] bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-zinc-100 dark:border-zinc-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    
                    {/* LOGO */}
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-lg md:text-xl font-serif tracking-[0.2em] z-[70] dark:text-white text-black">
                        HAMOUDA <span className="font-light opacity-60">PHOTOGRAPHY</span>
                    </Link>

                    {/* DESKTOP LINKS & THEME (Visible only on LG screens) */}
                    <div className="hidden lg:flex items-center space-x-8 uppercase text-[10px] tracking-[0.2em] font-bold text-zinc-500">
                        {navLinks.map((link) => (
                            <Link key={link.path} to={link.path} className={`hover:text-black dark:hover:text-white transition-colors ${location.pathname === link.path ? 'text-black dark:text-white' : ''}`}>
                                {link.name}
                            </Link>
                        ))}
                        
                        {/* Theme Toggle Desktop */}
                        <button onClick={toggleTheme} className="p-2 ml-4 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors text-zinc-900 dark:text-white">
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>

                    {/* ACTIONS (Mobile Theme + Menu Toggle) */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle Mobile Header (Optional, kept for quick access) */}
                        <button onClick={toggleTheme} className="lg:hidden p-2 text-zinc-900 dark:text-white z-[70]">
                             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-zinc-900 dark:text-white z-[70]"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* MOBILE MENU OVERLAY */}
            <div className={`fixed inset-0 z-[50] lg:hidden transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
                <div className={`absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)} />
                
                <div className={`absolute top-0 right-0 w-[80%] max-w-sm h-full bg-white dark:bg-zinc-950 shadow-2xl p-10 flex flex-col transition-transform duration-500 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="mt-20 flex flex-col space-y-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-4 text-sm uppercase tracking-[0.3em] font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all"
                            >
                                <span className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-full">{link.icon}</span>
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto border-t border-zinc-100 dark:border-zinc-900 pt-8 flex flex-col gap-6">
                        {/* Extra Action fil-Mobile: Theme info */}
                        <p className="text-[8px] uppercase tracking-[0.4em] text-zinc-400 text-center">
                            Mode {isDarkMode ? 'Sombre' : 'Clair'} Activé
                        </p>

                        {!user && (
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-black dark:hover:text-white text-center">
                                Espace Client / Admin
                            </Link>
                        )}
                        {user && (
                            <button onClick={() => {onLogout(); setIsMenuOpen(false);}} className="text-red-500 text-[10px] uppercase font-bold tracking-widest">
                                Déconnexion
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
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
                            <Route path="/portfolio" element={<Portfolio />} />
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
