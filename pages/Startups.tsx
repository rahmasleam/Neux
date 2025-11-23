import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import NewsCard from '../components/NewsCard';
import AIChat from '../components/AIChat';
import FilterBar from '../components/FilterBar';
import { Rocket, Globe, Zap, HeartPulse, Code, ExternalLink, Link as LinkIcon } from 'lucide-react';

const Startups: React.FC = () => {
  const { language, regionFilter, setRegionFilter, startupNews, resources } = useApp();
  const [sectorFilter, setSectorFilter] = useState('All');
  const t = TRANSLATIONS[language];

  // Logic
  const filteredData = startupNews.filter(item => {
    const regionMatch = regionFilter === 'All' || item.region === regionFilter || (regionFilter === 'Egypt' && item.region === 'MENA');
    const sectorMatch = sectorFilter === 'All' || item.sector === sectorFilter;
    return regionMatch && sectorMatch;
  });

  // Filter specific startup sources
  const startupSources = resources.filter(r => r.type === 'Startup');

  const pageContext = `Page: Startups. Displaying ${filteredData.length} news items. Active Filters - Region: ${regionFilter}, Sector: ${sectorFilter}.`;

  const sectorOptions = [
      { label: t.common.all, value: 'All' },
      { label: 'Fintech', value: 'Fintech' },
      { label: 'Healthtech', value: 'Healthtech' },
      { label: 'AI', value: 'AI' },
      { label: 'E-commerce', value: 'E-commerce' },
      { label: 'SaaS', value: 'SaaS' }
  ];

  const regionOptions = [
      { label: 'All Regions', value: 'All' },
      { label: 'Global', value: 'Global' },
      { label: 'Egypt/MENA', value: 'Egypt' }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn">
        <div className="flex-1 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Rocket className="w-8 h-8 text-nexus-600 dark:text-nexus-400" />
                        {t.sections.startupsTitle}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Daily updates on VC funding, exits, and new ventures.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <FilterBar 
                    activeValue={regionFilter} 
                    onSelect={(v) => setRegionFilter(v as any)} 
                    options={regionOptions}
                    icon={<Globe className="w-4 h-4" />}
                />
                <FilterBar 
                    activeValue={sectorFilter} 
                    onSelect={setSectorFilter} 
                    options={sectorOptions}
                    icon={<Zap className="w-4 h-4" />}
                />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow-md transform hover:scale-[1.02] transition-transform">
                    <h3 className="text-lg font-semibold opacity-90">Total MENA Funding (Q1)</h3>
                    <p className="text-3xl font-bold mt-2">$420M</p>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded mt-2 inline-block">+12% YoY</span>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm transition-colors">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <HeartPulse className="w-5 h-5 text-red-500" /> Top Sector
                    </h3>
                    <p className="text-3xl font-bold text-nexus-600 dark:text-nexus-400 mt-2">Fintech</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Leading deals in Egypt & KSA</p>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm transition-colors">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Code className="w-5 h-5 text-blue-500" /> Active Accelerators
                    </h3>
                    <p className="text-3xl font-bold text-nexus-600 dark:text-nexus-400 mt-2">14</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Currently accepting applications</p>
                </div>
            </div>

            {filteredData.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400">No startups found matching your filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredData.map(item => (
                        <NewsCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>

        {/* Sidebar for Ecosystem Sources */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-nexus-600" /> Ecosystem Sources
                </h3>
                <div className="space-y-3">
                    {startupSources.map(source => (
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

export default Startups;