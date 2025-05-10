document.addEventListener('DOMContentLoaded', () => {
    // Citation management
    const citationHandler = {
        citations: new Set(),

        addCitation(citation) {
            this.citations.add(citation);
            this.saveCitations();
            this.updateUI();
        },

        removeCitation(citation) {
            this.citations.delete(citation);
            this.saveCitations();
            this.updateUI();
        },

        saveCitations() {
            localStorage.setItem('savedCitations', JSON.stringify([...this.citations]));
        },

        loadCitations() {
            const saved = localStorage.getItem('savedCitations');
            if (saved) {
                this.citations = new Set(JSON.parse(saved));
                this.updateUI();
            }
        },

        updateUI() {
            const container = document.getElementById('citations-container') || this.createCitationsContainer();
            const list = container.querySelector('.citations-list');
            list.innerHTML = '';

            if (this.citations.size === 0) {
                list.innerHTML = '<p class="no-citations">No saved citations</p>';
                return;
            }

            this.citations.forEach(citation => {
                const item = document.createElement('div');
                item.className = 'citation-item';
                item.innerHTML = `
                    <p>${citation}</p>
                    <div class="citation-actions">
                        <button class="copy-btn">Copy</button>
                        <button class="remove-btn">Remove</button>
                    </div>
                `;

                item.querySelector('.copy-btn').onclick = () => this.copyCitation(citation);
                item.querySelector('.remove-btn').onclick = () => this.removeCitation(citation);
                list.appendChild(item);
            });
        },

        createCitationsContainer() {
            const container = document.createElement('div');
            container.id = 'citations-container';
            container.innerHTML = `
                <h3>Saved Citations</h3>
                <div class="citations-list"></div>
                <div class="citation-controls">
                    <button id="export-bibtex">Export BibTeX</button>
                    <button id="export-apa">Export APA</button>
                </div>
            `;

            document.querySelector('.content').appendChild(container);
            
            container.querySelector('#export-bibtex').onclick = () => this.exportCitations('bibtex');
            container.querySelector('#export-apa').onclick = () => this.exportCitations('apa');
            
            return container;
        },

        async copyCitation(citation) {
            try {
                await navigator.clipboard.writeText(citation);
                this.showNotification('Citation copied!');
            } catch (err) {
                this.showNotification('Failed to copy citation', 'error');
            }
        },

        exportCitations(format) {
            let content = '';
            this.citations.forEach(citation => {
                content += format === 'bibtex' ? 
                    this.convertToBibTeX(citation) : 
                    citation + '\n\n';
            });

            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `citations.${format === 'bibtex' ? 'bib' : 'txt'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },

        convertToBibTeX(citation) {
            // Simple conversion - could be enhanced for better parsing
            const year = citation.match(/\((\d{4})\)/)?.[1] || '';
            const authors = citation.split('(')[0].trim();
            const title = citation.split('.')[1]?.trim() || '';
            
            const key = authors.split(',')[0].replace(/\s+/g, '') + year;
            
            return `@article{${key},
    author = {${authors}},
    year = {${year}},
    title = {${title}}
}\n\n`;
        },

        showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => document.body.removeChild(notification), 300);
                }, 2000);
            }, 100);
        }
    };

    // Download tracking
    const downloadHandler = {
        downloadCounts: {},

        init() {
            this.loadDownloadCounts();
            this.attachDownloadListeners();
        },

        loadDownloadCounts() {
            const saved = localStorage.getItem('downloadCounts');
            if (saved) {
                this.downloadCounts = JSON.parse(saved);
                this.updateDownloadCounters();
            }
        },

        saveDownloadCounts() {
            localStorage.setItem('downloadCounts', JSON.stringify(this.downloadCounts));
        },

        trackDownload(paperTitle) {
            this.downloadCounts[paperTitle] = (this.downloadCounts[paperTitle] || 0) + 1;
            this.saveDownloadCounts();
            this.updateDownloadCounters();
        },

        updateDownloadCounters() {
            document.querySelectorAll('.paper-item').forEach(paper => {
                const title = paper.querySelector('h3').textContent;
                const count = this.downloadCounts[title] || 0;
                
                let counter = paper.querySelector('.download-count');
                if (!counter) {
                    counter = document.createElement('span');
                    counter.className = 'download-count';
                    paper.querySelector('.paper-links').appendChild(counter);
                }
                counter.textContent = `${count} downloads`;
            });
        },

        attachDownloadListeners() {
            document.querySelectorAll('.download-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    const paperTitle = e.target.closest('.paper-item').querySelector('h3').textContent;
                    this.trackDownload(paperTitle);
                });
            });
        }
    };

    // Initialize handlers
    citationHandler.loadCitations();
    downloadHandler.init();

    // Add citation buttons functionality
    document.querySelectorAll('.paper-item').forEach(paper => {
        const citation = paper.querySelector('.paper-citation')?.textContent;
        if (citation) {
            const addCitationBtn = document.createElement('button');
            addCitationBtn.className = 'add-citation-btn';
            addCitationBtn.textContent = 'Save Citation';
            addCitationBtn.onclick = () => citationHandler.addCitation(citation);
            paper.querySelector('.paper-links').appendChild(addCitationBtn);
        }
    });
});