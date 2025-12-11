# AutoReply Lite

A lightweight, offline-capable utility that detects keywords in email text and maps them to predefined reply templates, speeding up common business email responses.

## Features

### Core Features

- **Keyword Detection**: Paste email content to automatically detect keywords using tokenization and pattern matching
- **Template Matching**: Maps detected keywords to relevant reply templates with match scoring
- **Variable Placeholders**: Templates support dynamic placeholders like `{{name}}`, `{{date}}` that can be filled before sending
- **Preview and Edit**: Edit the generated reply before copying or sending
- **Copy/Email Integration**: One-click copy to clipboard or open directly in email client via mailto
- **Offline Capable**: All data stored locally in browser storage
- **Dark Theme**: Modern, premium UI with glassmorphism design

### Template Management

- **Create/Edit/Delete**: Full CRUD operations for templates
- **Categories**: Organize templates into HR, Finance, Scheduling, Project, or General
- **Favorites**: Star frequently used templates for quick access
- **Recent Templates**: Quick access to last 5 used templates
- **Duplicate**: Clone existing templates as starting points
- **Import/Export**: Backup and restore templates as JSON files
- **Search**: Quickly find templates by name, keywords, or content

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+K | Focus search (Template Manager) |
| Ctrl+N | Create new template |
| Ctrl+Enter | Copy to clipboard / Save template |
| Ctrl+Shift+Enter | Open in email client |
| Escape | Close modal / Clear search |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Demo Templates

The app comes pre-loaded with 10 business templates across 5 categories:

### HR / Leave
- Leave Approval
- Leave Request - Needs Discussion
- Out of Office Response

### Finance / Billing
- Payment Information

### Scheduling
- Meeting Scheduling
- Meeting Confirmation

### General
- Acknowledgment
- Follow-up Request
- Introduction / First Contact

### Project Management
- Project Status Update

## Template Format

Templates use a simple JSON structure:

```json
{
  "id": "unique-id",
  "name": "Template Name",
  "category": "general",
  "triggers": ["keyword1", "keyword2", "multi word trigger"],
  "body": "Hi {{name}},\n\nYour request for {{date}} is approved.\n\nBest regards"
}
```

### Categories

- `hr` - HR / Leave
- `finance` - Finance / Billing
- `scheduling` - Scheduling
- `general` - General
- `project` - Project Management

### Variable Placeholders

Use `{{variableName}}` syntax in template bodies. Common placeholders:

- `{{name}}` - Recipient name
- `{{date}}`, `{{startDate}}`, `{{endDate}}` - Dates
- `{{subject}}` - Email subject
- `{{amount}}` - Payment amounts
- `{{reason}}` - Explanation text

## Usage

1. Open the app at http://localhost:5173
2. **Compose Tab**: Paste an email into the text area
3. Detected keywords appear as colored chips
4. Matching templates are shown sorted by relevance score
5. Click a template to preview it
6. Fill in any variable placeholders
7. Edit the reply text if needed
8. Use Ctrl+Enter to copy or click the button

## Storage

All data is stored in localStorage:

- `autoreply-templates` - Template data
- `autoreply-favorites` - Favorited template IDs
- `autoreply-recent` - Recently used template IDs
- `autoreply-demo-loaded` - Flag for demo data initialization

## Technology Stack

- React 18
- Vite 5
- Vanilla CSS with CSS Variables
- localStorage for persistence

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires JavaScript enabled.

## License

MIT
