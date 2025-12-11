import { useState } from 'react';
import EmailAnalyzer from './components/EmailAnalyzer';
import TemplateManager from './components/TemplateManager';
import { useTemplates } from './hooks/useTemplates';

function App() {
    const [activeTab, setActiveTab] = useState('compose');
    const templates = useTemplates();

    return (
        <div className="app">
            <header className="header">
                <div className="header-content">
                    <div className="logo">
                        <div className="logo-icon">⚡</div>
                        <span className="logo-text">AutoReply Lite</span>
                    </div>

                    <nav className="nav-tabs">
                        <button
                            className={`nav-tab ${activeTab === 'compose' ? 'active' : ''}`}
                            onClick={() => setActiveTab('compose')}
                        >
                            <span>✉️</span>
                            Compose
                        </button>
                        <button
                            className={`nav-tab ${activeTab === 'templates' ? 'active' : ''}`}
                            onClick={() => setActiveTab('templates')}
                        >
                            <span>📝</span>
                            Templates
                        </button>
                    </nav>
                </div>
            </header>

            <main className="main-content">
                {activeTab === 'compose' ? (
                    <EmailAnalyzer templates={templates} />
                ) : (
                    <TemplateManager templates={templates} />
                )}
            </main>
        </div>
    );
}

export default App;
