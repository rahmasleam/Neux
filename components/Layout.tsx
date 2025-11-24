import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Rocket, Calendar, Mic, Mail, BarChart2, Users, UserCircle, Bell, LogIn, LogOut, Menu, X, Sparkles, Sun, Moon, Link as LinkIcon, ShieldCheck, BrainCircuit } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, language, toggleLanguage, logout, notificationsEnabled, toggleNotifications, theme, toggleTheme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  const navItems = [
    { to: '/', label: t.nav.latest, icon: Newspaper },
    { to: '/startups', label: t.nav.startups, icon: Rocket },
    { to: '/events', label: t.nav.events, icon: Calendar },
    { to: '/podcasts', label: t.nav.podcasts, icon: Mic },
    { to: '/podcast-analysis', label: 'Podcast Analysis', icon: BrainCircuit },
    { to: '/newsletters', label: t.nav.newsletters, icon: Mail },
    { to: '/market', label: t.nav.market, icon: BarChart2 },
    { to: '/partners', label: t.nav.partners, icon: Users },
  ];

  if (isAdmin) {
      navItems.push({ to: '/admin', label: t.nav.admin, icon: ShieldCheck });
  }

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-200 ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-nexus-600 rounded-lg flex items-center justify-center shadow-lg shadow-nexus-500/30">
                  <LayoutDashboard className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">
                  Nexus<span className="text-nexus-600 dark:text-nexus-400">Mena</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex flex-1 justify-center mx-4">
              <div className="flex items-center space-x-1 rtl:space-x-reverse max-w-full overflow-x-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors mx-1 flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
                        isActive 
                        ? 'bg-nexus-50 dark:bg-nexus-900/50 text-nexus-600 dark:text-nexus-400' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                ))}
                <NavLink
                  to="/ai-assistant"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors mx-1 flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
                      isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                      : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                    }`
                  }
                >
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{t.nav.aiAssistant}</span>
                </NavLink>
              </div>
            </nav>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-nexus-600 dark:hover:text-nexus-400 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              <button 
                onClick={toggleLanguage} 
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-nexus-600 dark:hover:text-nexus-400 transition-colors"
                title="Switch Language"
              >
                <span className="font-bold text-xs border border-slate-300 dark:border-slate-600 rounded px-2 py-1">{language === 'en' ? 'AR' : 'EN'}</span>
              </button>
              
              <button 
                onClick={toggleNotifications}
                className={`p-2 transition-colors relative ${notificationsEnabled ? 'text-nexus-600 dark:text-nexus-400' : 'text-slate-400 dark:text-slate-500'}`}
              >
                <Bell className="w-5 h-5" />
                {notificationsEnabled && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>}
              </button>

              {user ? (
                <div className={`flex items-center gap-3 ${language === 'ar' ? 'rtl:pl-2 rtl:border-r rtl:ml-2 rtl:mr-0' : 'pl-2 border-l ml-2'}`}>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-slate-800 dark:text-white flex items-center gap-1">
                        {user.name}
                        {isAdmin && <ShieldCheck className="w-3 h-3 text-nexus-600" />}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={logout} className="text-xs text-red-500 hover:underline">{t.nav.logout}</button>
                      <Link to="/saved" className="text-xs text-nexus-600 dark:text-nexus-400 hover:underline">{t.nav.saved}</Link>
                    </div>
                  </div>
                  <UserCircle className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/auth')}
                  className="flex items-center gap-2 px-4 py-2 bg-nexus-600 text-white rounded-lg text-sm font-medium hover:bg-nexus-700 transition-colors shadow-sm whitespace-nowrap"
                >
                  <LogIn className="w-4 h-4" />
                  {t.nav.login}
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center gap-2">
               <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400">
                 {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
               </button>
               <button onClick={toggleLanguage} className="p-2 text-slate-500 dark:text-slate-400">
                <span className="font-bold text-xs border border-slate-300 dark:border-slate-600 rounded px-2 py-1">{language === 'en' ? 'AR' : 'EN'}</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus:outline-none p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 ${
                      isActive 
                      ? 'bg-nexus-50 dark:bg-nexus-900/50 text-nexus-600 dark:text-nexus-400' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
               <NavLink
                  to="/ai-assistant"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 ${
                      isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                      : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                    }`
                  }
                >
                  <Sparkles className="w-5 h-5 flex-shrink-0" />
                  <span>{t.nav.aiAssistant}</span>
                </NavLink>
              
              {/* User section in mobile menu */}
              <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4">
                {user ? (
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-3 mb-2">
                      <UserCircle className="w-8 h-8 text-slate-400" />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white flex items-center gap-1">
                          {user.name}
                          {isAdmin && <ShieldCheck className="w-3 h-3 text-nexus-600" />}
                        </div>
                        <Link to="/saved" className="text-xs text-nexus-600 dark:text-nexus-400 hover:underline">
                          {t.nav.saved}
                        </Link>
                      </div>
                    </div>
                    <button 
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-red-500 flex items-center gap-2 mt-2"
                    >
                      <LogOut className="w-5 h-5" /> 
                      {t.nav.logout}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }} 
                    className="w-full text-left px-3 py-2 text-nexus-600 dark:text-nexus-400 flex items-center gap-2"
                  >
                    <LogIn className="w-5 h-5" /> 
                    {t.nav.login}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
