import React from 'react';
import { Filter } from 'lucide-react';

interface FilterOption {
    label: string;
    value: string;
}

interface FilterBarProps {
    options: FilterOption[];
    activeValue: string;
    onSelect: (value: string) => void;
    icon?: React.ReactNode;
}

const FilterBar: React.FC<FilterBarProps> = ({ options, activeValue, onSelect, icon }) => {
    return (
        <div className="flex flex-wrap items-center gap-2 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm transition-colors">
            <div className="px-2 text-slate-400 dark:text-slate-500">
                {icon || <Filter className="w-4 h-4" />}
            </div>
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onSelect(opt.value)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                        activeValue === opt.value
                            ? 'bg-nexus-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};

export default FilterBar;