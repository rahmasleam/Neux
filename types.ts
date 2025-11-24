export type Language = 'en' | 'ar';
export type Region = 'Global' | 'Egypt' | 'MENA' | 'All';
export type Category = 'Latest' | 'Startups' | 'Events' | 'Podcasts' | 'Newsletters' | 'Market' | 'Partners';

export interface PodcastAnalysis {
  id: string;
  url: string;
  podcastName: string;
  episodeTitle: string;
  score: number;
  reportContent?: string; // Optional generic content
  summary?: string;
  metrics?: { name: string; finding: string }[];
  recommendation?: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  favorites: string[]; // IDs of saved items
  preferences: {
    notifications: boolean;
    regions: Region[];
  };
  savedChats: { id: string; title: string; messages: ChatMessage[]; date: string }[];
  savedAnalyses: PodcastAnalysis[];
}

export interface BaseItem {
  id: string;
  title: string;
  titleAr?: string; 
  description: string;
  descriptionAr?: string;
  source: string;
  url: string;
  date: string;
  region: Region;
  imageUrl: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  url: string;
  type: 'News' | 'Startup' | 'Event' | 'Podcast' | 'Newsletter' | 'Other';
  description?: string;
}

export interface NewsItem extends BaseItem {
  category: 'Tech' | 'Startup' | 'Economy';
  sector?: 'Fintech' | 'Healthtech' | 'AI' | 'E-commerce' | 'SaaS' | 'General';
  tags: string[];
}

export interface EventItem extends BaseItem {
  location: string;
  startDate: string;
  endDate: string;
  registrationLink: string;
  isVirtual: boolean;
  type: 'Conference' | 'Hackathon' | 'Workshop' | 'Meetup';
}

export interface PodcastItem extends BaseItem {
  duration: string;
  audioUrl?: string;
  summaryPoints: string[];
  language: 'ar' | 'en';
  topic: 'Business' | 'Tech' | 'Startup' | 'AI' | 'Entrepreneurship';
}

export interface NewsletterItem extends BaseItem {
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  subscribeLink: string;
}

export interface MarketMetric {
  name: string;
  value: number;
  change: number; 
  trend: 'up' | 'down' | 'neutral';
  currency?: string;
  type: 'Index' | 'Crypto' | 'Currency' | 'Commodity';
}

export interface PartnerItem {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  contactEmail: string;
  type: 'Global' | 'Egypt';
  services: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}