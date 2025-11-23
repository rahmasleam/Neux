import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import { PlayCircle, Mic, Search, Headphones, Globe, ExternalLink, Bot, Volume2, X, FileText } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import AIChat from '../components/AIChat';
import { generateSummary, generateSpeech } from '../services/geminiService';

const Podcasts: React.FC = () => {
    const { language, podcasts } = useApp();
    const t = TRANSLATIONS[language];
    const [searchTerm, setSearchTerm] = useState('');
    const [topicFilter, setTopicFilter] = useState('All');
    const [langFilter, setLangFilter] = useState('All');
    
    // Modal State
    const [selectedPodcast, setSelectedPodcast] = useState<any | null>(null);
    const [summaryMode, setSummaryMode] = useState<'text' | 'audio' | null>(null);
    const [generatedSummary, setGeneratedSummary] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

    const filteredPodcasts = podcasts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTopic = topicFilter === 'All' || p.topic === topicFilter;
        const matchesLang = langFilter === 'All' || p.language === langFilter;
        return matchesSearch && matchesTopic && matchesLang;
    });

    const topicOptions = [
        { label: t.common.all, value: 'All' },
        { label: 'Tech', value: 'Tech' },
        { label: 'AI', value: 'AI' },
        { label: 'Startups', value: 'Startup' },
        { label: 'Entrepreneurship', value: 'Entrepreneurship' },
        { label: 'Business', value: 'Business' }
    ];

    const langOptions = [
        { label: t.common.all, value: 'All' },
        { label: 'Arabic', value: 'ar' },
        { label: 'English', value: 'en' }
    ];

    const openSummaryModal = (podcast: any) => {
        setSelectedPodcast(podcast);
        setSummaryMode(null);
        setGeneratedSummary('');
    };

    const handleGenerateSummary = async (mode: 'text' | 'audio') => {
        if (!selectedPodcast) return;
        setSummaryMode(mode);
        setIsGenerating(true);
        setGeneratedSummary('');

        // 1. Generate Text Summary first
        const summary = await generateSummary(
            `Podcast Title: ${selectedPodcast.title}\nDescription: ${selectedPodcast.description}\nTopic: ${selectedPodcast.topic}`, 
            language
        );

        if (mode === 'text') {
            setGeneratedSummary(summary);
            setIsGenerating(false);
        } else {
            // 2. If Audio, pass summary to TTS
            setGeneratedSummary("Generating Audio for: " + summary.substring(0, 50) + "...");
            const base64Audio = await generateSpeech(summary);
            
            if (base64Audio) {
                playAudio(base64Audio);
                setGeneratedSummary(summary); // Show text while playing
            } else {
                setGeneratedSummary("Failed to generate audio.");
            }
            setIsGenerating(false);
        }
    };

    const playAudio = async (base64: string) => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            setAudioContext(ctx);
            
            const binaryString = atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            const dataInt16 = new Int16Array(bytes.buffer);
            const frameCount = dataInt16.length;
            const buffer = ctx.createBuffer(1, frameCount, 24000); 
            const channelData = buffer.getChannelData(0);
            for (let i = 0; i < frameCount; i++) {
                channelData[i] = dataInt16[i] / 32768.0;
            }

            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.start();

        } catch (e) {
            console.error("Audio Playback Error", e);
            alert("Could not play audio. Ensure your browser supports AudioContext.");
        }
    };

    const stopAudio = () => {
        if (audioContext) {
            audioContext.close();
            setAudioContext(null);
        }
    };

    const closeModal = () => {
        stopAudio();
        setSelectedPodcast(null);
    };

    return (
        <div className="space-y-6 relative">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Mic className="w-8 h-8 text-nexus-600 dark:text-nexus-400" />
                        {t.sections.podcastsTitle}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Listen to global and MENA tech leaders.</p>
                 </div>
                 
                 {/* Search Bar */}
                 <div className="relative w-full md:w-64">
                    <input 
                        type="text" 
                        placeholder={t.common.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-nexus-500 focus:border-transparent outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
                 </div>
             </div>

             <div className="flex flex-col md:flex-row gap-4 flex-wrap">
                <FilterBar activeValue={topicFilter} onSelect={setTopicFilter} options={topicOptions} icon={<Headphones className="w-4 h-4" />} />
                <FilterBar activeValue={langFilter} onSelect={setLangFilter} options={langOptions} icon={<Globe className="w-4 h-4" />} />
             </div>

             <div className="grid grid-cols-1 gap-4">
                 {filteredPodcasts.length === 0 ? (
                     <div className="text-center py-12 text-slate-500 dark:text-slate-400">No podcasts found.</div>
                 ) : filteredPodcasts.map(p => (
                     <div key={p.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow group">
                         <div className="w-full md:w-48 h-48 md:h-auto bg-slate-200 dark:bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden relative">
                             <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                             <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                 <PlayCircle className="w-12 h-12 text-white opacity-90" />
                             </div>
                             <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{p.duration}</span>
                         </div>
                         
                         <div className="flex-1 flex flex-col">
                             <div className="flex justify-between items-start">
                                 <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{p.title}</h3>
                                    <p className="text-sm text-nexus-600 dark:text-nexus-400 font-medium mb-2">{p.source} • {p.date}</p>
                                 </div>
                                 <div className="flex flex-col gap-1 items-end">
                                     {p.language === 'ar' && <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-1 rounded font-bold">العربية</span>}
                                     <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">{p.topic}</span>
                                 </div>
                             </div>

                             <p className="text-slate-600 dark:text-slate-300 mb-4 flex-1">{p.description}</p>
                             
                             <div className="flex gap-2 mb-4">
                                {p.summaryPoints.map((pt, i) => (
                                    <span key={i} className="text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
                                        {pt}
                                    </span>
                                ))}
                             </div>

                             <div className="mt-auto flex justify-between items-center border-t border-slate-100 dark:border-slate-700 pt-4">
                                 <button 
                                    onClick={() => openSummaryModal(p)}
                                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center gap-1"
                                 >
                                    <Bot className="w-4 h-4" /> AI Smart Summary
                                 </button>

                                 <a href={p.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-nexus-600 text-white rounded-lg hover:bg-nexus-700 text-sm font-medium">
                                     {t.common.listen} <ExternalLink className="w-4 h-4" />
                                 </a>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
             <AIChat contextData={`Page: Podcasts. Listing ${filteredPodcasts.length} episodes.`} />

             {/* Smart Summary Modal */}
             {selectedPodcast && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn border border-slate-200 dark:border-slate-700">
                        <div className="p-4 bg-nexus-600 text-white flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2"><Bot className="w-5 h-5" /> Smart Summary</h3>
                            <button onClick={closeModal} className="hover:bg-white/20 p-1 rounded"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6">
                            <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{selectedPodcast.title}</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Choose how you want to consume this summary:</p>

                            {!summaryMode ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => handleGenerateSummary('text')}
                                        className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-nexus-500 dark:hover:border-nexus-500 hover:bg-nexus-50 dark:hover:bg-nexus-900/30 transition-all"
                                    >
                                        <FileText className="w-8 h-8 text-nexus-600 dark:text-nexus-400" />
                                        <span className="font-bold text-slate-700 dark:text-slate-200">Read Text</span>
                                    </button>
                                    <button 
                                        onClick={() => handleGenerateSummary('audio')}
                                        className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-nexus-500 dark:hover:border-nexus-500 hover:bg-nexus-50 dark:hover:bg-nexus-900/30 transition-all"
                                    >
                                        <Volume2 className="w-8 h-8 text-nexus-600 dark:text-nexus-400" />
                                        <span className="font-bold text-slate-700 dark:text-slate-200">Listen (Audio)</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {isGenerating ? (
                                        <div className="flex items-center justify-center py-8 text-nexus-600 dark:text-nexus-400 gap-2">
                                            <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full"></div>
                                            Generating {summaryMode === 'audio' ? 'Audio' : 'Text'}...
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto">
                                            {summaryMode === 'audio' && <div className="mb-2 text-xs text-green-600 dark:text-green-400 font-bold flex items-center gap-1"><Volume2 className="w-3 h-3" /> Playing Audio...</div>}
                                            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{generatedSummary}</p>
                                        </div>
                                    )}
                                    <button onClick={() => setSummaryMode(null)} className="text-sm text-slate-500 dark:text-slate-400 underline">Back to options</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
             )}
        </div>
    );
};

export default Podcasts;