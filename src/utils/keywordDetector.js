/**
 * Keyword detection and template matching utilities
 */

// Common words to ignore when detecting keywords
const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as',
    'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between',
    'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
    'why', 'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
    'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your',
    'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her',
    'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs',
    'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
    'am', 'if', 'because', 'until', 'while', 'about', 'against', 'also', 'any',
    'both', 'dont', 'get', 'got', 'hi', 'hello', 'hey', 'dear', 'regards', 'thanks',
    'thank', 'please', 'let', 'know', 'like', 'want', 'see', 'look', 'looking'
]);

/**
 * Tokenize text into normalized words
 */
export function tokenize(text) {
    if (!text) return [];

    return text
        .toLowerCase()
        .replace(/[^\w\s'-]/g, ' ')  // Remove special chars except apostrophes and hyphens
        .split(/\s+/)
        .filter(word => word.length > 1 && !STOP_WORDS.has(word));
}

/**
 * Extract n-grams (word sequences) from token list
 */
export function extractNgrams(tokens, n = 2) {
    const ngrams = [];
    for (let i = 0; i <= tokens.length - n; i++) {
        ngrams.push(tokens.slice(i, i + n).join(' '));
    }
    return ngrams;
}

/**
 * Detect keywords from email text and match against trigger phrases
 */
export function detectKeywords(emailText, templates) {
    const tokens = tokenize(emailText);
    const bigrams = extractNgrams(tokens, 2);
    const trigrams = extractNgrams(tokens, 3);

    // Combine all potential matches
    const allPhrases = [...tokens, ...bigrams, ...trigrams];

    // Track matched keywords
    const matchedKeywords = new Set();

    // Check each template's triggers
    templates.forEach(template => {
        template.triggers.forEach(trigger => {
            const normalizedTrigger = trigger.toLowerCase().trim();

            // Direct match in tokens or ngrams
            if (allPhrases.includes(normalizedTrigger)) {
                matchedKeywords.add(normalizedTrigger);
            }

            // Partial match - trigger words contained in email
            const triggerWords = normalizedTrigger.split(/\s+/);
            if (triggerWords.every(tw => tokens.includes(tw))) {
                matchedKeywords.add(normalizedTrigger);
            }

            // Check if email contains trigger phrase
            if (emailText.toLowerCase().includes(normalizedTrigger)) {
                matchedKeywords.add(normalizedTrigger);
            }
        });
    });

    return Array.from(matchedKeywords);
}

/**
 * Calculate match score for a template against detected keywords
 */
export function calculateMatchScore(template, detectedKeywords) {
    if (!detectedKeywords.length) return 0;

    let matchCount = 0;

    template.triggers.forEach(trigger => {
        const normalizedTrigger = trigger.toLowerCase().trim();
        if (detectedKeywords.includes(normalizedTrigger)) {
            matchCount++;
        }
    });

    // Score is ratio of matched triggers
    return matchCount / template.triggers.length;
}

/**
 * Find templates that match detected keywords, sorted by relevance
 */
export function findMatchingTemplates(emailText, templates) {
    const detectedKeywords = detectKeywords(emailText, templates);

    if (!detectedKeywords.length) {
        return { matches: [], keywords: [] };
    }

    const matches = templates
        .map(template => ({
            template,
            score: calculateMatchScore(template, detectedKeywords),
            matchedTriggers: template.triggers.filter(t =>
                detectedKeywords.includes(t.toLowerCase().trim())
            ),
        }))
        .filter(m => m.score > 0)
        .sort((a, b) => b.score - a.score);

    return {
        matches,
        keywords: detectedKeywords,
    };
}

/**
 * Extract variable placeholders from template body
 */
export function extractVariables(templateBody) {
    const regex = /\{\{(\w+)\}\}/g;
    const variables = [];
    let match;

    while ((match = regex.exec(templateBody)) !== null) {
        if (!variables.includes(match[1])) {
            variables.push(match[1]);
        }
    }

    return variables;
}

/**
 * Replace variables in template body with provided values
 */
export function fillTemplate(templateBody, variables) {
    let result = templateBody;

    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        result = result.replace(regex, value || `{{${key}}}`);
    });

    return result;
}

/**
 * Convert variable name to display label
 */
export function variableToLabel(variable) {
    return variable
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/([0-9]+)/g, ' $1')
        .trim();
}
