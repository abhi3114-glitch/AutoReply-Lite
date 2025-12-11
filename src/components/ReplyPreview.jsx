import { useState, useEffect, useCallback } from 'react';
import { extractVariables, fillTemplate, variableToLabel } from '../utils/keywordDetector';

function ReplyPreview({ template, onClose, onCopy }) {
    const [variables, setVariables] = useState({});
    const [editedBody, setEditedBody] = useState('');
    const [toast, setToast] = useState(null);

    // Reset variables when template changes
    useEffect(() => {
        if (template) {
            const vars = extractVariables(template.body);
            const initialVars = {};
            vars.forEach(v => {
                initialVars[v] = '';
            });
            setVariables(initialVars);
            setEditedBody(template.body);
        }
    }, [template]);

    // Update preview when variables change
    useEffect(() => {
        if (template) {
            setEditedBody(fillTemplate(template.body, variables));
        }
    }, [variables, template]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!template) return;

            // Ctrl+Enter to copy
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleCopy();
            }
            // Ctrl+Shift+Enter to open in email
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter') {
                e.preventDefault();
                handleOpenEmail();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [template, editedBody]);

    const handleVariableChange = (key, value) => {
        setVariables(prev => ({ ...prev, [key]: value }));
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(editedBody);
            showToast('Copied to clipboard!', 'success');
            if (onCopy) onCopy(editedBody);
        } catch (err) {
            showToast('Failed to copy', 'error');
        }
    }, [editedBody, onCopy]);

    const handleOpenEmail = useCallback(() => {
        const subject = encodeURIComponent(`Re: ${template.name}`);
        const body = encodeURIComponent(editedBody);
        window.open(`mailto:?subject=${subject}&body=${body}`);
    }, [template, editedBody]);

    if (!template) {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="empty-state">
                        <div className="empty-state-icon">Email</div>
                        <div className="empty-state-text">Select a template</div>
                        <p className="empty-state-subtext">
                            Paste an email on the left to see matching templates
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const varKeys = Object.keys(variables);

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">{template.name}</h2>
                <button className="btn btn-icon" onClick={onClose} title="Close">
                    X
                </button>
            </div>
            <div className="card-body">
                {/* Variable Inputs */}
                {varKeys.length > 0 && (
                    <div className="variable-inputs">
                        {varKeys.map(key => (
                            <div key={key} className="variable-input">
                                <label>{variableToLabel(key)}</label>
                                <input
                                    type="text"
                                    placeholder={`Enter ${variableToLabel(key).toLowerCase()}`}
                                    value={variables[key]}
                                    onChange={(e) => handleVariableChange(key, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Editable Preview */}
                <div className="form-group">
                    <label className="form-label">Reply Message</label>
                    <textarea
                        className="form-textarea large"
                        value={editedBody}
                        onChange={(e) => setEditedBody(e.target.value)}
                    />
                </div>

                {/* Actions */}
                <div className="reply-actions">
                    <button className="btn btn-primary btn-lg" onClick={handleCopy}>
                        Copy to Clipboard
                    </button>
                    <button className="btn btn-secondary btn-lg" onClick={handleOpenEmail}>
                        Open in Email
                    </button>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="shortcuts-help" style={{ marginTop: 'var(--space-4)' }}>
                    <span>Ctrl+Enter</span> Copy
                    <span>Ctrl+Shift+Enter</span> Email
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.type === 'success' ? 'OK' : 'X'} {toast.message}
                </div>
            )}
        </div>
    );
}

export default ReplyPreview;
