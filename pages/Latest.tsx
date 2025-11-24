import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import NewsCard from '../components/NewsCard';
import AIChat from '../components/AIChat';
import { Filter, ExternalLink, Globe, Tag } from 'lucide-react';
import FilterBar from '../components/FilterBar';

const Latest: React.FC = () => {
  const { language, regionFilter, setRegionFilter, latestNews, resources } = useApp();
  const t = TRANSLATIONS[language];
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const filteredNews = latestNews.filter(item => {
    const regionMatch = regionFilter === 'All' || item.region === regionFilter;
    const categoryMatch = categoryFilter === 'All' || item.category === categoryFilter;
    return regionMatch && categoryMatch;
  });

  // Filter specific news sources to display in the sidebar
  const newsSources = resources.filter(r => r.type === 'News');

  // Construct context for AI
  const pageContext = `Page: Latest News. displaying ${filteredNews.length} articles. Top headline: ${filteredNews[0]?.title}.`;

  const regionOptions = [
      { label: 'All Regions', value: 'All' },
      { label: 'Global', value: 'Global' },
      { label: 'Egypt', value: 'Egypt' }
  ];

  const categoryOptions = [
      { label: t.common.all, value: 'All' },
      { label: 'Tech', value: 'Tech' },
      { label: 'Startup', value: 'Startup' },
      { label: 'Economy', value: 'Economy' }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.sections.latestTitle}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Aggregated from trusted global and local sources.</p>
                </div>
            </div>
                
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                 <FilterBar 
                    activeValue={regionFilter} 
                    onSelect={(v) => setRegionFilter(v as any)} 
                    options={regionOptions}
                    icon={<Globe className="w-4 h-4" />}
                />
                 <FilterBar 
                    activeValue={categoryFilter} 
                    onSelect={setCategoryFilter} 
                    options={categoryOptions}
                    icon={<Tag className="w-4 h-4" />}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredNews.length === 0 ? (
                    <div className="col-span-2 text-center py-10 bg-slate-50 dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                        <p className="text-slate-500">No news found matching these filters.</p>
                    </div>
                ) : (
                    filteredNews.map(item => (
                        <NewsCard key={item.id} item={item} />
                    ))
                )}
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