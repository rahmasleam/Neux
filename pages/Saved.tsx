import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import NewsCard from '../components/NewsCard';
import { Bookmark, Calendar, Mic, Mail, Users, ExternalLink } from 'lucide-react';

const Saved: React.FC = () => {
  const { language, favorites, toggleFavorite, latestNews, startupNews, events, podcasts, newsletters, partners } = useApp();
  const t = TRANSLATIONS[language];

  // Aggregate all items
  const allItems = [
    ...latestNews,
    ...startupNews,
    ...events,
    ...podcasts,
    ...newsletters,
    ...partners
  ];

  const savedItems = allItems.filter(item => favorites.includes(item.id));

  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bookmark className="w-8 h-8 text-nexus-600 dark:text-nexus-400" />
              {t.nav.saved}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{savedItems.length} items saved</p>
       </div>

       {savedItems.length === 0 ? (
           <div className="text-center py-20 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400">No saved items yet.</p>
           </div>
       ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedItems.map(item => {
                  // Determine type - News and Startups use NewsCard
                  if ('sector' in item || ('category' in item && typeof (item as any).category === 'string')) {
                      return <NewsCard key={item.id} item={item as any} />;
                  }
                  
                  // Generic Card for other types (Events, Podcasts, etc.)
                  return (
                      <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex flex-col relative group transition-all hover:shadow-md">
                          <button 
                            onClick={() => toggleFavorite(item.id)}
                            className="absolute top-4 right-4 p-2 text-nexus-600 dark:text-nexus-400 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 hover:text-red-500 dark:hover:text-red-400 transition-colors z-10"
                            title="Remove from saved"
                          >
                            <Bookmark className="w-4 h-4 fill-current" />
                          </button>

                          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                             {'startDate' in item ? <Calendar className="w-4 h-4" /> : 
                              'duration' in item ? <Mic className="w-4 h-4" /> :
                              'frequency' in item ? <Mail className="w-4 h-4" /> :
                              <Users className="w-4 h-4" />
                             }
                             {'startDate' in item ? 'Event' : 'duration' in item ? 'Podcast' : 'frequency' in item ? 'Newsletter' : 'Partner'}
                          </div>

                          {((item as any).imageUrl || (item as any).logo) && (
                              <div className="h-40 w-full mb-4 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                  <img src={(item as any).imageUrl || (item as any).logo} alt={(item as any).title || (item as any).name} className="w-full h-full object-cover" />
                              </div>
                          )}

                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                            {(item as any).title || (item as any).name}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3 flex-1">
                            {(item as any).description}
                          </p>

                           <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                               <a 
                                 href={(item as any).url || (item as any).website} 
                                 target="_blank" 
                                 rel="noreferrer" 
                                 className="inline-flex items-center gap-1 text-sm font-medium text-nexus-600 dark:text-nexus-400 hover:text-nexus-700 dark:hover:text-nexus-300 transition-colors"
                               >
                                 Open Link
                                 <ExternalLink className="w-3 h-3" />
                               </a>
                           </div>
                      </div>
                  );
              })}
           </div>
       )}
    </div>
  );
};

export default Saved;