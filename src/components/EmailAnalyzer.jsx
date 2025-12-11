import { useState, useEffect, useCallback } from 'react';
import { findMatchingTemplates } from '../utils/keywordDetector';
import ReplyPreview from './ReplyPreview';

function EmailAnalyzer({ templates }) {
    const [emailText, setEmailText] = useState('');
    const [matchResult, setMatchResult] = useState({ matches: [], keywords: [] });
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    // Analyze email whenever text changes
    useEffect(() => {
        if (emailText.trim().length > 10) {
            const result = findMatchingTemplates(emailText, templates.templates);
            setMatchResult(result);

            // Auto-select first match if available
            if (result.matches.length > 0 && !selectedTemplate) {
                setSelectedTemplate(result.matches[0].template);
            }
        } else {
            setMatchResult({ matches: [], keywords: [] });
        }
    }, [emailText, templates.templates]);

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        templates.addToRecent(template.id);
    };

    const handleClear = () => {
        setEmailText('');
        setMatchResult({ matches: [], keywords: [] });
        setSelectedTemplate(null);
    };

    // Handle copy with keyboard shortcut
    const handleCopyShortcut = useCallback((content) => {
        navigator.clipboard.writeText(content);
    }, []);

    // Get category info
    const getCategoryInfo = (categoryId) => {
        return templates.categories?.find(c => c.id === categoryId) || { name: 'General', color: '#8b5cf6' };
    };

    return (
        <div className="split-layout">
            {/* Left Panel - Email Input */}
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Paste Email</h2>
                    {emailText && (
                        <button className="btn btn-secondary" onClick={handleClear}>
                            Clear
                        </button>
                    )}
                </div>
                <div className="card-body">
                    <textarea
                        className="form-textarea large"
                        placeholder="Paste the email content here to detect keywords and find matching reply templates..."
                        value={emailText}
                        onChange={(e) => setEmailText(e.target.value)}
                    />

                    {/* Detected Keywords */}
                    {matchResult.keywords.length > 0 && (
                        <div className="keywords-container">
                            <span className="text-sm text-muted" style={{ marginRight: '8px' }}>
                                Detected:
                            </span>
                            {matchResult.keywords.map((keyword, index) => (
                                <span key={index} className="keyword-chip matched">
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Matching Templates */}
                    {matchResult.matches.length > 0 && (
                        <div style={{ marginTop: 'var(--space-6)' }}>
                            <h3 style={{
                                fontSize: 'var(--font-size-sm)',
                                fontWeight: 600,
                                color: 'var(--text-secondary)',
                                marginBottom: 'var(--space-3)'
                            }}>
                                Suggested Templates ({matchResult.matches.length})
                            </h3>
                            <div className="template-grid">
                                {matchResult.matches.map(({ template, score, matchedTriggers }) => {
                                    const categoryInfo = getCategoryInfo(template.category);
                                    return (
                                        <div
                                            key={template.id}
                                            className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                                            onClick={() => handleTemplateSelect(template)}
                                        >
                                            <div className="template-card-header">
                                                <div className="template-card-title">
                                                    <span className="template-name">{template.name}</span>
                                                    <span
                                                        className="category-badge-sm"
                                                        style={{ backgroundColor: categoryInfo.color + '20', color: categoryInfo.color }}
                                                    >
                                                        {categoryInfo.name}
                                                    </span>
                                                </div>
                                                <span className="template-match-score">
                                                    {Math.round(score * 100)}% match
                                                </span>
                                            </div>
                                            <div className="template-triggers">
                                                {matchedTriggers.map((trigger, i) => (
                                                    <span key={i} className="template-trigger">
                                                        {trigger}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="template-preview">{template.body}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {emailText.length > 10 && matchResult.matches.length === 0 && (
                        <div className="empty-state" style={{ padding: 'var(--space-6)' }}>
                            <div className="empty-state-text">No matching templates found</div>
                            <p className="empty-state-subtext">
                                Try adding keywords like "leave", "payment", "meeting", or "follow up"
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel - Reply Preview */}
            <div className="reply-section">
                <ReplyPreview
                    template={selectedTemplate}
                    onClose={() => setSelectedTemplate(null)}
                    onCopy={handleCopyShortcut}
                />
            </div>
        </div>
    );
}

export default EmailAnalyzer;
