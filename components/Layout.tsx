import React from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Rocket, Calendar, Mic, Mail, BarChart2, Users, UserCircle, Bell, LogIn, LogOut, Menu, X, Sparkles, Sun, Moon, ShieldCheck, BrainCircuit } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, language, toggleLanguage, logout, notificationsEnabled, toggleNotifications, theme, toggleTheme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const t = TRANSLATIONS[language];

  // امنعي scrolling لما الموبايل مينو مفتوح
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const mainNavItems = [
    { to: '/', label: t.nav.latest, icon: Newspaper },
    { to: '/startups', label: t.nav.startups, icon: Rocket },
    { to: '/events', label: t.nav.events, icon: Calendar },
    { to: '/podcasts', label: t.nav.podcasts, icon: Mic },
  ];

  const analysisNavItems = [
    { to: '/podcast-analysis', label: 'Podcast Analysis', icon: BrainCircuit },
    { to: '/market', label: t.nav.market, icon: BarChart2 },
  ];

  const otherNavItems = [
    { to: '/newsletters', label: t.nav.newsletters, icon: Mail },
    { to: '/partners', label: t.nav.partners, icon: Users },
  ];

  if (isAdmin) {
    otherNavItems.push({ to: '/admin', label: t.nav.admin, icon: ShieldCheck });
  }

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-200 ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
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

            {/* Desktop Navigation - Organized in Groups */}
            <nav className="hidden lg:flex flex-1 justify-center items-center mx-4">
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                {/* Main Navigation Group */}
                <div className="flex items-center border-r border-slate-200 dark:border-slate-700 pr-3 mr-3">
                  {mainNavItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                          isActive 
                          ? 'bg-nexus-50 dark:bg-nexus-900/50 text-nexus-600 dark:text-nexus-400' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>

                {/* Analysis Group */}
                <div className="flex items-center border-r border-slate-200 dark:border-slate-700 pr-3 mr-3">
                  {analysisNavItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                          isActive 
                          ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>

                {/* Other Navigation Group */}
                <div className="flex items-center">
                  {otherNavItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                          isActive 
                          ? 'bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {/* AI Assistant Button */}
              <NavLink
                to="/ai-assistant"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                    isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                    : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                  }`
                }
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.nav.aiAssistant}</span>
              </NavLink>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-nexus-600 dark:hover:text-nexus-400 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              {/* Language Toggle */}
              <button 
                onClick={toggleLanguage} 
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-nexus-600 dark:hover:text-nexus-400 transition-colors"
                title="Switch Language"
              >
                <span className="font-bold text-xs border border-slate-300 dark:border-slate-600 rounded px-2 py-1">
                  {language === 'en' ? 'AR' : 'EN'}
                </span>
              </button>
              
              {/* Notifications */}
              <button 
                onClick={toggleNotifications}
                className={`p-2 transition-colors relative ${notificationsEnabled ? 'text-nexus-600 dark:text-nexus-400' : 'text-slate-400 dark:text-slate-500'}`}
              >
                <Bell className="w-5 h-5" />
                {notificationsEnabled && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* User Section */}
              {user ? (
                <div className={`flex items-center gap-3 ${language === 'ar' ? 'rtl:pl-3 rtl:border-r rtl:ml-3' : 'pl-3 border-l border-slate-200 dark:border-slate-700 ml-3'}`}>
                  <UserCircle className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-800 dark:text-white">
                        {user.name}
                      </span>
                      {isAdmin && <ShieldCheck className="w-3 h-3 text-nexus-600" />}
                    </div>
                    <div className="flex gap-3 text-xs">
                      <Link 
                        to="/saved" 
                        className="text-nexus-600 dark:text-nexus-400 hover:underline"
                      >
                        {t.nav.saved}
                      </Link>
                      <button 
                        onClick={logout} 
                        className="text-red-500 hover:underline"
                      >
                        {t.nav.logout}
                      </button>
                    </div>
                  </div>
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
                <span className="font-bold text-xs border border-slate-300 dark:border-slate-600 rounded px-2 py-1">
                  {language === 'en' ? 'AR' : 'EN'}
                </span>
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
          <div className="lg:hidden fixed inset-0 z-40 bg-white dark:bg-slate-800 top-16 overflow-y-auto">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              
              {/* Main Navigation */}
              <div className="mb-4">
                <h3 className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Main
                </h3>
                {mainNavItems.map((item) => (
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
              </div>

              {/* Analysis */}
              <div className="mb-4">
                <h3 className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Analysis
                </h3>
                {analysisNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 ${
                        isActive 
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>

              {/* Other */}
              <div className="mb-4">
                <h3 className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Other
                </h3>
                {otherNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 ${
                        isActive 
                        ? 'bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>

              {/* AI Assistant */}
              <div className="mb-4">
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
              </div>

              {/* User section */}
              <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4">
                {user ? (
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-3 mb-3">
                      <UserCircle className="w-10 h-10 text-slate-400" />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                          {user.name}
                          {isAdmin && <ShieldCheck className="w-4 h-4 text-nexus-600" />}
                        </div>
                        <Link 
                          to="/saved" 
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-sm text-nexus-600 dark:text-nexus-400 hover:underline"
                        >
                          {t.nav.saved}
                        </Link>
                      </div>
                    </div>
                    <button 
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-red-500 flex items-center gap-2 border-t border-slate-200 dark:border-slate-700 mt-3 pt-3"
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
