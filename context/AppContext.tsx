import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Language, Region, ChatMessage, NewsItem, EventItem, PodcastItem, NewsletterItem, MarketMetric, PartnerItem, ResourceItem } from '../types';
import { LATEST_NEWS, STARTUP_NEWS, EVENTS, PODCASTS, NEWSLETTERS, MARKET_DATA_INDICES, MARKET_DATA_CRYPTO, MARKET_DATA_CURRENCY, PARTNERS, RESOURCES } from '../constants';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, updateProfile, User as FirebaseUser } from 'firebase/auth';

interface AppContextType {
  user: User | null;
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
  addItem: (category: string, item: any) => void;
  addResource: (item: ResourceItem) => void;
  
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
  const [loading, setLoading] = useState(true);
  
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [regionFilter, setRegionFilter] = useState<Region | 'All'>('All');
  const [savedChats, setSavedChats] = useState<{ id: string; title: string; messages: ChatMessage[]; date: string }[]>([]);

  // Data State Initialization
  const [latestNews, setLatestNews] = useState<NewsItem[]>(LATEST_NEWS);
  const [startupNews, setStartupNews] = useState<NewsItem[]>(STARTUP_NEWS);
  const [events, setEvents] = useState<EventItem[]>(EVENTS);
  const [podcasts, setPodcasts] = useState<PodcastItem[]>(PODCASTS);
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>(NEWSLETTERS);
  const [marketIndices] = useState<MarketMetric[]>(MARKET_DATA_INDICES);
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

  // Auth Effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          favorites: [],
          preferences: { notifications: true, regions: ['Global'] },
          savedChats: []
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
    await signInWithEmailAndPassword(auth, email, pass);
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
    await signOut(auth);
    setFavorites([]);
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
      case 'partners':
        setPartners(prev => [newItem, ...prev]);
        break;
    }
  };

  const addResource = (item: ResourceItem) => {
    setResources(prev => [item, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      user,
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
      addItem,
      addResource,
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