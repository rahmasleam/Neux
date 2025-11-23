import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants';
import { PlusCircle, Link as LinkIcon, Save } from 'lucide-react';

const Admin: React.FC = () => {
    const { language, addItem } = useApp();
    const t = TRANSLATIONS[language];
    
    const [category, setCategory] = useState('latest');
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [source, setSource] = useState('');
    const [region, setRegion] = useState('Global');
    
    // Helper fields dependent on category
    const [imageUrl, setImageUrl] = useState('https://picsum.photos/800/400');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newItem: any = {
            title,
            description,
            url,
            source: source || 'Admin Added',
            region,
            imageUrl
        };

        // Add category specific fields defaults
        if (category === 'latest') {
            newItem.category = 'Tech';
            newItem.tags = ['Admin'];
        } else if (category === 'startup') {
            newItem.category = 'Startup';
            newItem.sector = 'General';
            newItem.tags = ['New'];
        } else if (category === 'events') {
            newItem.startDate = new Date().toISOString();
            newItem.endDate = new Date().toISOString();
            newItem.type = 'Conference';
            newItem.registrationLink = url;
            newItem.location = 'TBD';
        } else if (category === 'podcasts') {
            newItem.duration = '30 min';
            newItem.topic = 'Tech';
            newItem.language = 'en';
            newItem.summaryPoints = ['New Episode'];
        }

        addItem(category, newItem);
        
        // Reset form
        setTitle('');
        setUrl('');
        setDescription('');
        alert("Item added successfully!");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-3xl font-bold text-slate-900">{t.nav.admin}</h1>
                <p className="text-slate-500">Add new links and content to the platform.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nexus-500 bg-slate-50 outline-none"
                    >
                        <option value="latest">Latest News</option>
                        <option value="startup">Startup News</option>
                        <option value="events">Event</option>
                        <option value="podcasts">Podcast</option>
                        <option value="newsletters">Newsletter</option>
                        <option value="partners">Partner</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                    <input 
                        required
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Article or Item Title"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nexus-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea 
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Short summary..."
                        rows={3}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nexus-500 outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">URL / Link</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input 
                                required
                                type="url" 
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nexus-500 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Source Name</label>
                        <input 
                            type="text" 
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            placeholder="e.g. TechCrunch"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nexus-500 outline-none"
                        />
                    </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Region</label>
                        <select 
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nexus-500 bg-slate-50 outline-none"
                        >
                            <option value="Global">Global</option>
                            <option value="Egypt">Egypt</option>
                            <option value="MENA">MENA</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Image URL (Optional)</label>
                        <input 
                            type="text" 
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nexus-500 outline-none"
                        />
                    </div>
                </div>

                <button type="submit" className="w-full py-3 bg-nexus-600 text-white rounded-lg hover:bg-nexus-700 font-bold flex items-center justify-center gap-2">
                    <PlusCircle className="w-5 h-5" /> Add Content
                </button>
            </form>
        </div>
    );
};

export default Admin;