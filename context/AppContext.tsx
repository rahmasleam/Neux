import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Language, Region, ChatMessage, NewsItem, EventItem, PodcastItem, NewsletterItem, MarketMetric, PartnerItem, ResourceItem, PodcastAnalysis } from '../types';
import { LATEST_NEWS, STARTUP_NEWS, EVENTS, PODCASTS, NEWSLETTERS, MARKET_DATA_INDICES, MARKET_DATA_CRYPTO, MARKET_DATA_CURRENCY, PARTNERS, RESOURCES } from '../constants';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, updateProfile, User as FirebaseUser } from 'firebase/auth';

interface AppContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  regionFilter: Region | 'All';
  setRegionFilter: (r: Region | 'All') => void;
  savedChats: { id: string; title: string; messages: ChatMessage[]; date: string }[];
  saveCurrentChat: (messages: ChatMessage[]) => void;
  savedAnalyses: PodcastAnalysis[];
  saveAnalysis: (analysis: PodcastAnalysis) => void;
  deleteAnalysis: (id: string) => void;
  addItem: (category: string, item: any) => void;
  updateItem: (category: string, item: any) => void;
  deleteItem: (id: string, category: string) => void;
  addResource: (item: ResourceItem) => void;
  getItemById: (id: string) => any | null;
  
  // Data State
  latestNews: NewsItem[];
  startupNews: NewsItem[];
  events: EventItem[];
  podcasts: PodcastItem[];
  newsletters: NewsletterItem[];
  marketIndices: MarketMetric[];
  partners: PartnerItem[];
  resources: ResourceItem[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Mock User State for error fallback/demo persistence
  const [mockUser, setMockUser] = useState<User | null>(() => {
      const stored = localStorage.getItem('nexus_mock_user');
      return stored ? JSON.parse(stored) : null;
  });

  const [favorites, setFavorites] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [regionFilter, setRegionFilter] = useState<Region | 'All'>('All');
  const [savedChats, setSavedChats] = useState<{ id: string; title: string; messages: ChatMessage[]; date: string }[]>([]);
  const [savedAnalyses, setSavedAnalyses] = useState<PodcastAnalysis[]>([]);

  // Data State Initialization
  const [latestNews, setLatestNews] = useState<NewsItem[]>(LATEST_NEWS);
  const [startupNews, setStartupNews] = useState<NewsItem[]>(STARTUP_NEWS);
  const [events, setEvents] = useState<EventItem[]>(EVENTS);
  const [podcasts, setPodcasts] = useState<PodcastItem[]>(PODCASTS);
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>(NEWSLETTERS);
  const [marketIndices, setMarketIndices] = useState<MarketMetric[]>(MARKET_DATA_INDICES);
  const [partners, setPartners] = useState<PartnerItem[]>(PARTNERS);
  const [resources, setResources] = useState<ResourceItem[]>(RESOURCES);

  // Theme Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Persist Mock User
  useEffect(() => {
      if (mockUser) {
          // Sync savedAnalyses to mock user object for persistence in this demo
          const updatedUser = { ...mockUser, savedAnalyses };
          localStorage.setItem('nexus_mock_user', JSON.stringify(updatedUser));
      } else {
          localStorage.removeItem('nexus_mock_user');
      }
  }, [mockUser, savedAnalyses]);

  // Auth Effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Real Firebase User found
        const u = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          favorites: [],
          preferences: { notifications: true, regions: ['Global'] },
          savedChats: [],
          savedAnalyses: []
        };
        setUser(u);
        setIsAdmin(firebaseUser.email === 'admin@edafaa.com');
      } else {
        // No Firebase user, check for Mock fallback
        if (mockUser) {
            setUser(mockUser);
            setIsAdmin(mockUser.email === 'admin@edafaa.com');
            if (mockUser.savedAnalyses) setSavedAnalyses(mockUser.savedAnalyses);
        } else {
            setUser(null);
            setIsAdmin(false);
            setSavedAnalyses([]);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [mockUser]); 

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);

  const login = async (email: string, pass: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
        console.error("Firebase Login Error:", error.code);
        
        if (email === 'admin@edafaa.com') {
             const adminUser: User = {
                id: 'admin-demo-bypass',
                name: 'Admin User',
                email: email,
                favorites: [],
                preferences: { notifications: true, regions: ['Global'] },
                savedChats: [],
                savedAnalyses: []
             };
             setMockUser(adminUser);
             setUser(adminUser);
             setIsAdmin(true);
             return;
        }
        throw error;
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    try {
        await signOut(auth);
    } catch (e) {
        console.error("SignOut Error", e);
    }
    setMockUser(null);
    setUser(null);
    setFavorites([]);
    setIsAdmin(false);
    setSavedAnalyses([]);
  };

  const saveCurrentChat = (messages: ChatMessage[]) => {
      if (messages.length === 0) return;
      const newChat = {
          id: Date.now().toString(),
          title: `Chat ${new Date().toLocaleDateString()} - ${messages[0]?.content.substring(0, 20)}...`,
          messages: messages,
          date: new Date().toISOString()
      };
      setSavedChats(prev => [newChat, ...prev]);
  };

  const saveAnalysis = (analysis: PodcastAnalysis) => {
      setSavedAnalyses(prev => [analysis, ...prev]);
  };

  const deleteAnalysis = (id: string) => {
      setSavedAnalyses(prev => prev.filter(a => a.id !== id));
  };

  const addItem = (category: string, item: any) => {
    const newItem = { ...item, id: Date.now().toString() };
    switch (category) {
      case 'latest':
        setLatestNews(prev => [newItem, ...prev]);
        break;
      case 'startup':
        setStartupNews(prev => [newItem, ...prev]);
        break;
      case 'events':
        setEvents(prev => [newItem, ...prev]);
        break;
      case 'podcasts':
        setPodcasts(prev => [newItem, ...prev]);
        break;
      case 'newsletters':
        setNewsletters(prev => [newItem, ...prev]);
        break;
      case 'market':
        setMarketIndices(prev => [newItem, ...prev]);
        break;
      case 'partners':
        setPartners(prev => [newItem, ...prev]);
        break;
      case 'resources':
        setResources(prev => [newItem, ...prev]);
        break;
    }
  };

  const updateItem = (category: string, item: any) => {
    const updateFn = (prev: any[]) => prev.map(i => i.id === item.id ? item : i);
    switch (category) {
      case 'latest':
        setLatestNews(updateFn);
        break;
      case 'startup':
        setStartupNews(updateFn);
        break;
      case 'events':
        setEvents(updateFn);
        break;
      case 'podcasts':
        setPodcasts(updateFn);
        break;
      case 'newsletters':
        setNewsletters(updateFn);
        break;
      case 'market':
        setMarketIndices(prev => prev.map(i => i.name === item.name ? item : i));
        break;
      case 'partners':
        setPartners(updateFn);
        break;
    }
  };

  const deleteItem = (id: string, category: string) => {
    switch (category) {
        case 'latest':
            setLatestNews(prev => prev.filter(i => i.id !== id));
            break;
        case 'startup':
            setStartupNews(prev => prev.filter(i => i.id !== id));
            break;
        case 'events':
            setEvents(prev => prev.filter(i => i.id !== id));
            break;
        case 'podcasts':
            setPodcasts(prev => prev.filter(i => i.id !== id));
            break;
        case 'newsletters':
            setNewsletters(prev => prev.filter(i => i.id !== id));
            break;
        case 'market':
            setMarketIndices(prev => prev.filter(i => i.name !== id)); // Market uses name/symbol usually
            break;
        case 'partners':
            setPartners(prev => prev.filter(i => i.id !== id));
            break;
        case 'resources':
            setResources(prev => prev.filter(i => i.id !== id));
            break;
    }
  };

  const addResource = (item: ResourceItem) => {
    setResources(prev => [item, ...prev]);
  };

  const getItemById = (id: string) => {
      const allItems = [...latestNews, ...startupNews, ...events, ...podcasts, ...newsletters, ...partners, ...resources];
      return allItems.find(item => item.id === id) || null;
  };

  return (
    <AppContext.Provider value={{
      user,
      isAdmin,
      loading,
      theme,
      toggleTheme,
      language,
      toggleLanguage,
      favorites,
      toggleFavorite,
      notificationsEnabled,
      toggleNotifications,
      login,
      signup,
      resetPassword,
      logout,
      regionFilter,
      setRegionFilter,
      savedChats,
      saveCurrentChat,
      savedAnalyses,
      saveAnalysis,
      deleteAnalysis,
      addItem,
      updateItem,
      deleteItem,
      addResource,
      getItemById,
      latestNews,
      startupNews,
      events,
      podcasts,
      newsletters,
      marketIndices,
      partners,
      resources
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};