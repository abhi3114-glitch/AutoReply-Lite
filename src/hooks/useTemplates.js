import { useState, useEffect } from 'react';
import { demoTemplates, CATEGORIES } from '../data/demoTemplates';

const STORAGE_KEY = 'autoreply-templates';
const FAVORITES_KEY = 'autoreply-favorites';
const RECENT_KEY = 'autoreply-recent';
const DEMO_LOADED_KEY = 'autoreply-demo-loaded';

const MAX_RECENT = 5;

export function useTemplates() {
    const [templates, setTemplates] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load data from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const storedFavorites = localStorage.getItem(FAVORITES_KEY);
        const storedRecent = localStorage.getItem(RECENT_KEY);
        const demoLoaded = localStorage.getItem(DEMO_LOADED_KEY);

        // Load favorites
        if (storedFavorites) {
            try {
                setFavorites(JSON.parse(storedFavorites));
            } catch (e) {
                setFavorites([]);
            }
        }

        // Load recent
        if (storedRecent) {
            try {
                setRecent(JSON.parse(storedRecent));
            } catch (e) {
                setRecent([]);
            }
        }

        // Load templates
        if (stored) {
            try {
                setTemplates(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse templates:', e);
                setTemplates([]);
            }
        } else if (!demoLoaded) {
            // First load - populate with demo templates
            setTemplates(demoTemplates);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(demoTemplates));
            localStorage.setItem(DEMO_LOADED_KEY, 'true');
        }

        setLoading(false);
    }, []);

    // Save templates to localStorage whenever they change
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
        }
    }, [templates, loading]);

    // Save favorites
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        }
    }, [favorites, loading]);

    // Save recent
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
        }
    }, [recent, loading]);

    // Generate unique ID
    const generateId = () => {
        return `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    // Add new template
    const addTemplate = (template) => {
        const newTemplate = {
            ...template,
            id: generateId(),
            category: template.category || 'general',
        };
        setTemplates(prev => [...prev, newTemplate]);
        return newTemplate;
    };

    // Update existing template
    const updateTemplate = (id, updates) => {
        setTemplates(prev =>
            prev.map(t => (t.id === id ? { ...t, ...updates } : t))
        );
    };

    // Delete template
    const deleteTemplate = (id) => {
        setTemplates(prev => prev.filter(t => t.id !== id));
        setFavorites(prev => prev.filter(fid => fid !== id));
        setRecent(prev => prev.filter(rid => rid !== id));
    };

    // Duplicate template
    const duplicateTemplate = (id) => {
        const original = templates.find(t => t.id === id);
        if (original) {
            const duplicate = {
                ...original,
                id: generateId(),
                name: `${original.name} (Copy)`,
            };
            setTemplates(prev => [...prev, duplicate]);
            return duplicate;
        }
        return null;
    };

    // Toggle favorite
    const toggleFavorite = (id) => {
        setFavorites(prev =>
            prev.includes(id)
                ? prev.filter(fid => fid !== id)
                : [...prev, id]
        );
    };

    // Add to recent (when template is used)
    const addToRecent = (id) => {
        setRecent(prev => {
            const filtered = prev.filter(rid => rid !== id);
            return [id, ...filtered].slice(0, MAX_RECENT);
        });
    };

    // Check if template is favorite
    const isFavorite = (id) => favorites.includes(id);

    // Get favorite templates
    const getFavorites = () => templates.filter(t => favorites.includes(t.id));

    // Get recent templates
    const getRecent = () => {
        return recent
            .map(id => templates.find(t => t.id === id))
            .filter(Boolean);
    };

    // Get templates by category
    const getByCategory = (categoryId) => {
        if (!categoryId || categoryId === 'all') return templates;
        return templates.filter(t => t.category === categoryId);
    };

    // Search templates
    const searchTemplates = (query) => {
        if (!query.trim()) return templates;
        const lower = query.toLowerCase();
        return templates.filter(t =>
            t.name.toLowerCase().includes(lower) ||
            t.triggers.some(tr => tr.toLowerCase().includes(lower)) ||
            t.body.toLowerCase().includes(lower)
        );
    };

    // Reset to demo templates
    const resetToDemo = () => {
        setTemplates(demoTemplates);
        setFavorites([]);
        setRecent([]);
    };

    // Export templates as JSON
    const exportTemplates = () => {
        const data = JSON.stringify(templates, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'autoreply-templates.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Import templates from JSON
    const importTemplates = (jsonString) => {
        try {
            const imported = JSON.parse(jsonString);
            if (Array.isArray(imported)) {
                // Add unique IDs to imported templates
                const withIds = imported.map(t => ({
                    ...t,
                    id: t.id || generateId(),
                    category: t.category || 'general',
                }));
                setTemplates(prev => [...prev, ...withIds]);
                return { success: true, count: withIds.length };
            }
            return { success: false, error: 'Invalid format' };
        } catch (e) {
            return { success: false, error: 'Invalid JSON' };
        }
    };

    return {
        templates,
        categories: CATEGORIES,
        loading,
        favorites,
        recent: getRecent(),
        addTemplate,
        updateTemplate,
        deleteTemplate,
        duplicateTemplate,
        toggleFavorite,
        addToRecent,
        isFavorite,
        getFavorites,
        getByCategory,
        searchTemplates,
        resetToDemo,
        exportTemplates,
        importTemplates,
    };
}
