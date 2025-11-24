import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import { PlayCircle, Mic, Search, Headphones, Globe, ExternalLink, Bot, Volume2, X, FileText, Clock, Youtube, Sparkles, ArrowRight } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import AIChat from '../components/AIChat';
import { generateSummary, generateSpeech } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';

const Podcasts: React.FC = () => {
    const { language, podcasts } = useApp();
    const t = TRANSLATIONS[language];
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [topicFilter, setTopicFilter] = useState('All');
    const [langFilter, setLangFilter] = useState('All');
    const [durationFilter, setDurationFilter] = useState('All');
    
    // Modal State
    const [selectedPodcast, setSelectedPodcast] = useState<any | null>(null);
    const [summaryMode, setSummaryMode] = useState<'text' | 'audio' | null>(null);
    const [generatedSummary, setGeneratedSummary] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [isPlayingVideo, setIsPlayingVideo] = useState(false);

    const getDurationMinutes = (durationStr: string): number => {
        const match = durationStr.match(/(\d+)/);
        return match ? parseInt(match[0]) : 0;
    };

    const getYoutubeId = (url: string | undefined): string | null => {
        if (!url) return null;
        // Simple regex for common YouTube ID formats (standard, short, embed)
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const filteredPodcasts = podcasts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTopic = topicFilter === 'All' || p.topic === topicFilter;
        const matchesLang = langFilter === 'All' || p.language === langFilter;
        
        let matchesDuration = true;
        if (durationFilter !== 'All') {
            const minutes = getDurationMinutes(p.duration);
            if (durationFilter === 'short') matchesDuration = minutes < 30;
            else if (durationFilter === 'medium') matchesDuration = minutes >= 30 && minutes <= 60;
            else if (durationFilter === 'long') matchesDuration = minutes > 60;
        }

        return matchesSearch && matchesTopic && matchesLang && matchesDuration;
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

    const durationOptions = [
        { label: 'All Durations', value: 'All' },
        { label: '< 30 min', value: 'short' },
        { label: '30-60 min', value: 'medium' },
        { label: '> 60 min', value: 'long' }
    ];

    const openSummaryModal = (podcast: any, playImmediately = false) => {
        setSelectedPodcast(podcast);
        setSummaryMode(null);
        setGeneratedSummary('');
        setIsPlayingVideo(playImmediately);
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
        setIsPlayingVideo(false);
    };

    return (
        <div className="space-y-6 relative pb-20">
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

            {/* Link to Deep Analysis Page */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">New: Deep Podcast Analyzer</h3>
                        <p className="text-indigo-100 text-sm opacity-90">Get AI-powered scores, contradictions check, and detailed metrics for any podcast link.</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/podcast-analysis')}
                    className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                    Try Tool <ArrowRight className="w-4 h-4" />
                </button>
            </div>

             <div className="flex flex-col md:flex-row gap-4 flex-wrap">
                <FilterBar activeValue={topicFilter} onSelect={setTopicFilter} options={topicOptions} icon={<Headphones className="w-4 h-4" />} />
                <FilterBar activeValue={langFilter} onSelect={setLangFilter} options={langOptions} icon={<Globe className="w-4 h-4" />} />
                <FilterBar activeValue={durationFilter} onSelect={setDurationFilter} options={durationOptions} icon={<Clock className="w-4 h-4" />} />
             </div>

             <div className="grid grid-cols-1 gap-4">
                 {filteredPodcasts.length === 0 ? (
                     <div className="text-center py-12 text-slate-500 dark:text-slate-400">No podcasts found.</div>
                 ) : filteredPodcasts.map(p => {
                     const youtubeId = getYoutubeId(p.url || p.audioUrl);
                     return (
                     <div key={p.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow group">
                         <div 
                            className="w-full md:w-48 h-48 md:h-auto bg-slate-200 dark:bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden relative cursor-pointer"
                            onClick={() => openSummaryModal(p, true)}
                        >
                             <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                             <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                 <PlayCircle className="w-12 h-12 text-white opacity-90" />
                             </div>
                             <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{p.duration}</span>
                             {youtubeId && <div className="absolute top-2 left-2 bg-red-600 text-white p-1 rounded-full"><Youtube className="w-4 h-4" /></div>}
                         </div>
                         
                         <div className="flex-1 flex flex-col">
                             <div className="flex justify-between items-start">
                                 <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white cursor-pointer hover:text-nexus-600" onClick={() => openSummaryModal(p, true)}>{p.title}</h3>
                                    <p className="text-sm text-nexus-600 dark:text-nexus-400 font-medium mb-2">{p.source} • {p.date}</p>
                                 </div>
                                 <div className="flex flex-col gap-1 items-end">
                                     {p.language === 'ar' && <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-1 rounded font-bold">العربية</span>}
                                     <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">{p.topic}</span>
                                 </div>
                             </div>

                             <p className="text-slate-600 dark:text-slate-300 mb-4 flex-1 line-clamp-2">{p.description}</p>
                             
                             {p.summaryPoints && p.summaryPoints.length > 0 && (
                                 <div className="mb-4">
                                     <p className="text-xs font-bold text-slate-500 mb-1">KEY POINTS:</p>
                                     <div className="flex flex-wrap gap-2">
                                        {p.summaryPoints.map((pt: string, i: number) => (
                                            <span key={i} className="text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
                                                {pt}
                                            </span>
                                        ))}
                                     </div>
                                 </div>
                             )}

                             <div className="mt-auto flex justify-between items-center border-t border-slate-100 dark:border-slate-700 pt-4">
                                 <button 
                                    onClick={() => openSummaryModal(p, false)}
                                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center gap-1"
                                 >
                                    <Bot className="w-4 h-4" /> AI Smart Summary
                                 </button>

                                 <button 
                                    onClick={() => openSummaryModal(p, true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-nexus-600 text-white rounded-lg hover:bg-nexus-700 text-sm font-medium"
                                 >
                                     {youtubeId ? 'Watch Video' : t.common.listen} <PlayCircle className="w-4 h-4" />
                                 </button>
                             </div>
                         </div>
                     </div>
                 )})}
             </div>
             <AIChat contextData={`Page: Podcasts. Listing ${filteredPodcasts.length} episodes.`} />

             {/* Smart Summary / Player Modal */}
             {selectedPodcast && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
                        <div className="p-4 bg-nexus-600 text-white flex justify-between items-center shrink-0">
                            <h3 className="font-bold flex items-center gap-2 truncate max-w-[80%]">
                                {isPlayingVideo ? <PlayCircle className="w-5 h-5"/> : <Bot className="w-5 h-5" />} 
                                {isPlayingVideo ? selectedPodcast.title : 'Smart Summary'}
                            </h3>
                            <button onClick={closeModal} className="hover:bg-white/20 p-1 rounded"><X className="w-5 h-5" /></button>
                        </div>
                        
                        <div className="overflow-y-auto p-0">
                            {/* Video Player Section */}
                            {isPlayingVideo && getYoutubeId(selectedPodcast.url || selectedPodcast.audioUrl) ? (
                                <div className="aspect-video w-full bg-black">
                                     <iframe 
                                        width="100%" 
                                        height="100%" 
                                        src={`https://www.youtube.com/embed/${getYoutubeId(selectedPodcast.url || selectedPodcast.audioUrl)}?autoplay=1`} 
                                        title={selectedPodcast.title} 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : isPlayingVideo && (
                                <div className="p-8 text-center">
                                    <p className="mb-4 text-slate-600 dark:text-slate-300">This source cannot be embedded. Please open it externally.</p>
                                    <a 
                                        href={selectedPodcast.url || selectedPodcast.audioUrl} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-nexus-600 text-white rounded-lg hover:bg-nexus-700"
                                    >
                                        Open Source <ExternalLink className="w-4 h-4"/>
                                    </a>
                                </div>
                            )}

                            <div className="p-6">
                                {/* Summary Points List from Admin/Smart Fetch */}
                                {selectedPodcast.summaryPoints && selectedPodcast.summaryPoints.length > 0 && (
                                    <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                                        <h4 className="font-bold text-sm text-slate-500 uppercase mb-3 flex items-center gap-2">
                                            <FileText className="w-4 h-4"/> Key Takeaways
                                        </h4>
                                        <ul className="space-y-2">
                                            {selectedPodcast.summaryPoints.map((pt: string, idx: number) => (
                                                <li key={idx} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                    <span className="text-nexus-600 font-bold">•</span>
                                                    {pt}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* AI Generator Section */}
                                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                                    <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Generate Deep Summary</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Use AI to analyze the content further:</p>

                                    {!summaryMode ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <button 
                                                onClick={() => handleGenerateSummary('text')}
                                                className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-nexus-500 dark:hover:border-nexus-500 hover:bg-nexus-50 dark:hover:bg-nexus-900/30 transition-all"
                                            >
                                                <FileText className="w-6 h-6 text-nexus-600 dark:text-nexus-400" />
                                                <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Read Analysis</span>
                                            </button>
                                            <button 
                                                onClick={() => handleGenerateSummary('audio')}
                                                className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-nexus-500 dark:hover:border-nexus-500 hover:bg-nexus-50 dark:hover:bg-nexus-900/30 transition-all"
                                            >
                                                <Volume2 className="w-6 h-6 text-nexus-600 dark:text-nexus-400" />
                                                <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Listen (Audio)</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {isGenerating ? (
                                                <div className="flex items-center justify-center py-8 text-nexus-600 dark:text-nexus-400 gap-2">
                                                    <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full"></div>
                                                    Generating...
                                                </div>
                                            ) : (
                                                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 max-h-40 overflow-y-auto">
                                                    {summaryMode === 'audio' && <div className="mb-2 text-xs text-green-600 dark:text-green-400 font-bold flex items-center gap-1"><Volume2 className="w-3 h-3" /> Playing Audio...</div>}
                                                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line text-sm">{generatedSummary}</p>
                                                </div>
                                            )}
                                            <button onClick={() => setSummaryMode(null)} className="text-sm text-slate-500 dark:text-slate-400 underline">Back to options</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             )}
        </div>
    );
};

export default Podcasts;