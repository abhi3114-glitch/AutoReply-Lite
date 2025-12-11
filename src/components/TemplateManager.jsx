import { useState, useRef, useEffect } from 'react';

function TemplateManager({ templates }) {
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const fileInputRef = useRef(null);
    const searchInputRef = useRef(null);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl+K or Cmd+K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            // Ctrl+N to create new template
            if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !showModal) {
                e.preventDefault();
                handleNew();
            }
            // Escape to close modal or clear search
            if (e.key === 'Escape') {
                if (showModal) {
                    setShowModal(false);
                    setEditingTemplate(null);
                } else if (searchQuery) {
                    setSearchQuery('');
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showModal, searchQuery]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleNew = () => {
        setEditingTemplate({
            name: '',
            triggers: [],
            body: '',
            category: 'general',
        });
        setShowModal(true);
    };

    const handleEdit = (template) => {
        setEditingTemplate({ ...template });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this template?')) {
            templates.deleteTemplate(id);
            showToast('Template deleted', 'success');
        }
    };

    const handleDuplicate = (id) => {
        const duplicate = templates.duplicateTemplate(id);
        if (duplicate) {
            showToast('Template duplicated', 'success');
        }
    };

    const handleSave = (templateData) => {
        if (templateData.id) {
            templates.updateTemplate(templateData.id, templateData);
            showToast('Template updated', 'success');
        } else {
            templates.addTemplate(templateData);
            showToast('Template created', 'success');
        }
        setShowModal(false);
        setEditingTemplate(null);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = templates.importTemplates(event.target.result);
                if (result.success) {
                    showToast(`Imported ${result.count} templates`, 'success');
                } else {
                    showToast(result.error, 'error');
                }
            };
            reader.readAsText(file);
        }
        e.target.value = '';
    };

    const handleReset = () => {
        if (confirm('This will replace all templates with the default set. Continue?')) {
            templates.resetToDemo();
            showToast('Reset to demo templates', 'success');
        }
    };

    // Filter templates
    let filteredTemplates = templates.templates;

    if (searchQuery) {
        filteredTemplates = templates.searchTemplates(searchQuery);
    }

    if (selectedCategory !== 'all') {
        filteredTemplates = filteredTemplates.filter(t => t.category === selectedCategory);
    }

    if (showFavoritesOnly) {
        filteredTemplates = filteredTemplates.filter(t => templates.isFavorite(t.id));
    }

    // Get category info
    const getCategoryInfo = (categoryId) => {
        return templates.categories.find(c => c.id === categoryId) || { name: 'General', color: '#8b5cf6' };
    };

    return (
        <div>
            {/* Header */}
            <div className="template-manager-header">
                <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
                    Template Manager
                </h1>
                <div className="flex gap-3">
                    <button className="btn btn-secondary" onClick={templates.exportTemplates}>
                        Export
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Import
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        style={{ display: 'none' }}
                    />
                    <button className="btn btn-secondary" onClick={handleReset}>
                        Reset
                    </button>
                    <button className="btn btn-primary" onClick={handleNew}>
                        + New Template
                    </button>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="filter-bar">
                <div className="search-box">
                    <span className="search-icon">Search</span>
                    <input
                        ref={searchInputRef}
                        type="text"
                        className="search-input"
                        placeholder="Search templates... (Ctrl+K)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className="search-clear"
                            onClick={() => setSearchQuery('')}
                        >
                            x
                        </button>
                    )}
                </div>

                <div className="filter-buttons">
                    <select
                        className="category-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {templates.categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <button
                        className={`btn btn-secondary ${showFavoritesOnly ? 'active' : ''}`}
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    >
                        {showFavoritesOnly ? 'Favorites' : 'All'}
                    </button>
                </div>
            </div>

            {/* Recent Templates */}
            {templates.recent.length > 0 && !searchQuery && selectedCategory === 'all' && !showFavoritesOnly && (
                <div className="recent-section">
                    <h3 className="section-title">Recently Used</h3>
                    <div className="recent-list">
                        {templates.recent.map(template => (
                            <button
                                key={template.id}
                                className="recent-chip"
                                onClick={() => handleEdit(template)}
                            >
                                {template.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Template List */}
            <div className="template-list">
                {filteredTemplates.map(template => {
                    const categoryInfo = getCategoryInfo(template.category);
                    return (
                        <div key={template.id} className="template-list-item">
                            <button
                                className={`favorite-btn ${templates.isFavorite(template.id) ? 'active' : ''}`}
                                onClick={() => templates.toggleFavorite(template.id)}
                                title={templates.isFavorite(template.id) ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                {templates.isFavorite(template.id) ? 'Star' : 'Star-O'}
                            </button>

                            <div className="template-list-info">
                                <div className="template-list-header">
                                    <span className="template-list-name">{template.name}</span>
                                    <span
                                        className="category-badge"
                                        style={{ backgroundColor: categoryInfo.color + '20', color: categoryInfo.color }}
                                    >
                                        {categoryInfo.name}
                                    </span>
                                </div>
                                <div className="template-list-triggers">
                                    Keywords: {template.triggers.slice(0, 5).join(', ')}
                                    {template.triggers.length > 5 && ` +${template.triggers.length - 5} more`}
                                </div>
                            </div>

                            <div className="template-list-actions">
                                <button
                                    className="btn btn-icon"
                                    onClick={() => handleDuplicate(template.id)}
                                    title="Duplicate"
                                >
                                    Copy
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handleEdit(template)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(template.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}

                {filteredTemplates.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">Search</div>
                        <div className="empty-state-text">
                            {searchQuery ? 'No templates match your search' : 'No templates yet'}
                        </div>
                        <p className="empty-state-subtext">
                            {searchQuery
                                ? 'Try a different search term'
                                : 'Click "New Template" to create your first template'}
                        </p>
                    </div>
                )}
            </div>

            {/* Keyboard Shortcuts Help */}
            <div className="shortcuts-help">
                <span>Ctrl+K</span> Search
                <span>Ctrl+N</span> New Template
                <span>Esc</span> Close / Clear
            </div>

            {/* Edit Modal */}
            {showModal && (
                <TemplateModal
                    template={editingTemplate}
                    categories={templates.categories}
                    onSave={handleSave}
                    onClose={() => {
                        setShowModal(false);
                        setEditingTemplate(null);
                    }}
                />
            )}

            {/* Toast */}
            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.type === 'success' ? 'OK' : 'X'} {toast.message}
                </div>
            )}
        </div>
    );
}

function TemplateModal({ template, categories, onSave, onClose }) {
    const [name, setName] = useState(template.name || '');
    const [triggers, setTriggers] = useState(template.triggers?.join(', ') || '');
    const [body, setBody] = useState(template.body || '');
    const [category, setCategory] = useState(template.category || 'general');
    const [errors, setErrors] = useState({});

    // Keyboard shortcuts in modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl+Enter to save
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('save-template-btn')?.click();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!triggers.trim()) newErrors.triggers = 'At least one keyword is required';
        if (!body.trim()) newErrors.body = 'Body is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave({
                id: template.id,
                name: name.trim(),
                triggers: triggers.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
                body: body,
                category: category,
            });
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {template.id ? 'Edit Template' : 'New Template'}
                    </h2>
                    <button className="btn btn-icon" onClick={onClose}>X</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="form-group" style={{ flex: 2 }}>
                                <label className="form-label">Template Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., Leave Approval"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                />
                                {errors.name && (
                                    <span className="form-error">{errors.name}</span>
                                )}
                            </div>

                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Trigger Keywords (comma-separated)
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="leave, vacation, time off, pto"
                                value={triggers}
                                onChange={(e) => setTriggers(e.target.value)}
                            />
                            {errors.triggers && (
                                <span className="form-error">{errors.triggers}</span>
                            )}
                            <p className="form-hint">
                                These keywords will trigger this template when found in an email
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Reply Template</label>
                            <textarea
                                className="form-textarea large"
                                placeholder={`Hi {{name}},\n\nYour request has been processed.\n\nBest regards`}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                            />
                            {errors.body && (
                                <span className="form-error">{errors.body}</span>
                            )}
                            <p className="form-hint">
                                Use {'{{variableName}}'} for placeholders that can be filled in when composing
                            </p>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <span className="modal-shortcut">Ctrl+Enter to save</span>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" id="save-template-btn">
                            {template.id ? 'Save Changes' : 'Create Template'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TemplateManager;
