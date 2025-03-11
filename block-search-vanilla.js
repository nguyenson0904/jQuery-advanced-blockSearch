class BlockSearch {
    constructor(inputSelector, options = {}) {
        // Default settings
        this.defaults = {
            listSelector: '',             // Selector for list items (required)
            searchFields: ['text'],       // Fields to search. Use 'text' for visible text and e.g., 'data-keywords' for attributes.
            caseSensitive: false,         // Whether the search is case sensitive
            delay: 0,                     // Debounce delay (ms)
            highlightClass: 'search-highlight', // CSS class applied to highlighted text
            tokenized: false,             // When true, if exact match fails, search using individual tokens (all must exist)
            animation: null,              // Optional animation settings
            onSearchStart: null,          // Callback before search starts
            onSearchComplete: null        // Callback after search completes
        };

        // Merge settings
        this.settings = Object.assign({}, this.defaults, options);
        
        // Initialize elements
        this.input = document.querySelector(inputSelector);
        if (!this.input) throw new Error('Input element not found');
        
        this.listItems = Array.from(document.querySelectorAll(this.settings.listSelector));
        if (!this.listItems.length) throw new Error('No list items found');

        // Store original HTML content
        this.listItems.forEach(item => {
            item.dataset.originalHTML = item.innerHTML;
        });

        // Bind events
        this.boundSearch = this.debounce(this.doSearch.bind(this), this.settings.delay);
        this.input.addEventListener('input', this.boundSearch);
        if (this.input.type === 'search') {
            this.input.addEventListener('search', this.boundSearch);
        }
    }

    // Debounce utility
    debounce(func, delay) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Escape regex special characters
    escapeRegex(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // Create regex for search
    createRegex(query, flags = 'g') {
        return new RegExp(this.escapeRegex(query), flags);
    }

    // Highlight text in a node
    highlightTextInNode(node, regex, className) {
        if (node.nodeType === 3) { // Text node
            const text = node.nodeValue;
            if (regex.test(text)) {
                regex.lastIndex = 0;
                const span = document.createElement('span');
                span.className = className;
                span.textContent = text.match(regex)[0];
                const parts = text.split(regex);
                node.nodeValue = parts[0];
                node.parentNode.insertBefore(span, node.nextSibling);
                if (parts[1]) {
                    const remainingText = document.createTextNode(parts[1]);
                    node.parentNode.insertBefore(remainingText, span.nextSibling);
                }
            }
        } else if (node.nodeType === 1) { // Element node
            Array.from(node.childNodes).forEach(child => {
                this.highlightTextInNode(child, regex, className);
            });
        }
    }

    // Process tokenized search
    processTokenizedSearch(text, tokens, flags) {
        return tokens.every(token => {
            const tokenRegex = this.createRegex(token, flags);
            return tokenRegex.test(text);
        });
    }

    // Handle animations
    animate(element, type) {
        if (!this.settings.animation) return;
        const { show, hide, duration = 300 } = this.settings.animation;
        
        if (type === 'show' && show) {
            element.style.animation = `${show} ${duration}ms`;
            element.style.display = '';
        } else if (type === 'hide' && hide) {
            element.style.animation = `${hide} ${duration}ms`;
            setTimeout(() => {
                element.style.display = 'none';
            }, duration);
        } else {
            element.style.display = type === 'show' ? '' : 'none';
        }
    }

    // Main search function
    doSearch() {
        const query = this.input.value;
        const matches = [];

        // Handle empty query
        if (!query) {
            this.listItems.forEach(item => {
                item.innerHTML = item.dataset.originalHTML;
                this.animate(item, 'show');
            });
            if (typeof this.settings.onSearchComplete === 'function') {
                this.settings.onSearchComplete([]);
            }
            return;
        }

        // Trigger search start callback
        if (typeof this.settings.onSearchStart === 'function') {
            this.settings.onSearchStart(query);
        }

        // Prepare regex
        const flags = this.settings.caseSensitive ? 'g' : 'gi';
        const exactRegex = this.createRegex(query, flags);

        this.listItems.forEach(item => {
            const originalHTML = item.dataset.originalHTML;
            let matchFound = false;
            let newHTML = originalHTML;

            // Search through each field
            this.settings.searchFields.forEach(field => {
                if (field === 'text') {
                    const textContent = item.textContent;
                    
                    // Try exact match first
                    if (exactRegex.test(textContent)) {
                        matchFound = true;
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = originalHTML;
                        Array.from(tempDiv.childNodes).forEach(node => {
                            this.highlightTextInNode(node, exactRegex, this.settings.highlightClass);
                        });
                        newHTML = tempDiv.innerHTML;
                    }
                    // Try tokenized search if enabled
                    else if (this.settings.tokenized) {
                        const tokens = query.split(/\s+/).filter(token => token.length > 0);
                        if (this.processTokenizedSearch(textContent, tokens, flags)) {
                            matchFound = true;
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = originalHTML;
                            tokens.forEach(token => {
                                const tokenRegex = this.createRegex(token, flags);
                                Array.from(tempDiv.childNodes).forEach(node => {
                                    this.highlightTextInNode(node, tokenRegex, this.settings.highlightClass);
                                });
                            });
                            newHTML = tempDiv.innerHTML;
                        }
                    }
                }
                // Handle data attributes
                else if (field.startsWith('data-')) {
                    const attrValue = item.getAttribute(field) || '';
                    if (exactRegex.test(attrValue)) {
                        matchFound = true;
                    }
                    else if (this.settings.tokenized) {
                        const tokens = query.split(/\s+/).filter(token => token.length > 0);
                        if (this.processTokenizedSearch(attrValue, tokens, flags)) {
                            matchFound = true;
                        }
                    }
                }
            });

            // Update item based on match status
            if (matchFound) {
                matches.push(item);
                item.innerHTML = newHTML;
                this.animate(item, 'show');
            } else {
                item.innerHTML = originalHTML;
                this.animate(item, 'hide');
            }
        });

        // Trigger search complete callback
        if (typeof this.settings.onSearchComplete === 'function') {
            this.settings.onSearchComplete(matches);
        }
    }

    // Cleanup method
    destroy() {
        this.input.removeEventListener('input', this.boundSearch);
        this.input.removeEventListener('search', this.boundSearch);
        this.listItems.forEach(item => {
            item.innerHTML = item.dataset.originalHTML;
            delete item.dataset.originalHTML;
        });
    }
}