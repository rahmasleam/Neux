import React from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import NewsCard from '../components/NewsCard';
import AIChat from '../components/AIChat';
import { Filter, ExternalLink, Globe } from 'lucide-react';

const Latest: React.FC = () => {
  const { language, regionFilter, setRegionFilter, latestNews, resources } = useApp();
  const t = TRANSLATIONS[language];
  
  const filteredNews = latestNews.filter(item => 
    regionFilter === 'All' || item.region === regionFilter
  );

  // Filter specific news sources to display in the sidebar
  const newsSources = resources.filter(r => r.type === 'News');

  // Construct context for AI
  const pageContext = `Page: Latest News. displaying ${filteredNews.length} articles. Top headline: ${filteredNews[0]?.title}.`;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.sections.latestTitle}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Aggregated from trusted global and local sources.</p>
                </div>
                
                {/* Filters */}
                <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 shadow-sm transition-colors">
                    <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500 mx-2" />
                    <button 
                        onClick={() => setRegionFilter('All')} 
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${regionFilter === 'All' ? 'bg-nexus-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setRegionFilter('Global')} 
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${regionFilter === 'Global' ? 'bg-nexus-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                    >
                        Global
                    </button>
                    <button 
                        onClick={() => setRegionFilter('Egypt')} 
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${regionFilter === 'Egypt' ? 'bg-nexus-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                    >
                        Egypt
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredNews.map(item => (
                    <NewsCard key={item.id} item={item} />
                ))}
            </div>
        </div>

        {/* Sidebar for Sources */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-nexus-600" /> Trusted Sources
                </h3>
                <div className="space-y-3">
                    {newsSources.map(source => (
                        <a 
                            key={source.id} 
                            href={source.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center justify-between group p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-nexus-600 dark:group-hover:text-nexus-400">{source.name}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-nexus-500" />
                        </a>
                    ))}
                </div>
            </div>
        </div>

        <AIChat contextData={pageContext} />
    </div>
  );
};

export default Latest;