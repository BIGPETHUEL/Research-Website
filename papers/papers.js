document.addEventListener('DOMContentLoaded', () => {
    // Paper search functionality
    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.placeholder = 'Search papers by title, author, or keywords...';
    searchInput.className = 'paper-search';
    document.querySelector('#papers-intro').appendChild(searchInput);

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.paper-item').forEach(paper => {
            const title = paper.querySelector('h3').textContent.toLowerCase();
            const authors = paper.querySelector('.authors').textContent.toLowerCase();
            const tags = Array.from(paper.querySelectorAll('.paper-tag'))
                .map(tag => tag.textContent.toLowerCase());
            
            const isMatch = title.includes(searchTerm) || 
                           authors.includes(searchTerm) ||
                           tags.some(tag => tag.includes(searchTerm));
            
            paper.style.display = isMatch ? 'block' : 'none';
        });
    });

    // Filter papers by year
    const years = ['2025', '2024', '2023', '2022', '2021'];
    const yearFilter = document.createElement('select');
    yearFilter.className = 'year-filter';
    yearFilter.innerHTML = '<option value="">Filter by Year</option>' +
        years.map(year => `<option value="${year}">${year}</option>`).join('');
    document.querySelector('#papers-intro').appendChild(yearFilter);

    yearFilter.addEventListener('change', (e) => {
        const selectedYear = e.target.value;
        document.querySelectorAll('.paper-item').forEach(paper => {
            if (!selectedYear) {
                paper.style.display = 'block';
                return;
            }
            const year = paper.querySelector('.journal').textContent.match(/\((\d{4})\)/)[1];
            paper.style.display = year === selectedYear ? 'block' : 'none';
        });
    });

    // Paper statistics
    function updateStats() {
        document.querySelectorAll('.stat-card').forEach(card => {
            const category = card.querySelector('h4').textContent;
            const sectionId = category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
            const paperCount = document.querySelector(`#${sectionId} .papers-box`).querySelectorAll('.paper-item').length;
            card.querySelector('.stat-number').textContent = paperCount;
        });
    }

    // Initialize statistics
    updateStats();

    // Add download progress animation
    document.querySelectorAll('.download-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const progressBar = document.createElement('div');
            progressBar.className = 'download-progress';
            button.appendChild(progressBar);
            
            // Simulate download progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        progressBar.remove();
                    }, 300);
                }
                progressBar.style.width = `${progress}%`;
            }, 200);
        });
    });

    // Add paper preview on hover
    const preview = document.createElement('div');
    preview.className = 'paper-preview';
    document.body.appendChild(preview);

    document.querySelectorAll('.paper-item h3').forEach(title => {
        title.addEventListener('mouseenter', (e) => {
            const paper = e.target.closest('.paper-item');
            const abstract = paper.querySelector('.abstract')?.textContent;
            const tags = Array.from(paper.querySelectorAll('.paper-tag'))
                .map(tag => tag.textContent);
            const downloads = paper.querySelector('.download-count')?.textContent || '0';
            
            preview.innerHTML = `
                <h4>${title.textContent}</h4>
                <div class="preview-metadata">
                    <p><strong>Tags:</strong> ${tags.join(', ')}</p>
                    <p><strong>Downloads:</strong> ${downloads}</p>
                    <p><strong>Abstract:</strong></p>
                    <p class="preview-abstract">${abstract || 'No abstract available'}</p>
                </div>
            `;
            
            const rect = title.getBoundingClientRect();
            preview.style.top = `${rect.bottom + window.scrollY + 10}px`;
            preview.style.left = `${rect.left}px`;
            preview.style.display = 'block';
        });

        title.addEventListener('mouseleave', () => {
            preview.style.display = 'none';
        });
    });

    // Add citation management system
    const citationManager = {
        citations: new Set(),
        
        add(citation) {
            this.citations.add(citation);
            this.updateUI();
            this.saveToBrowser();
        },
        
        remove(citation) {
            this.citations.delete(citation);
            this.updateUI();
            this.saveToBrowser();
        },
        
        updateUI() {
            const citationList = document.querySelector('.saved-citations') || this.createCitationList();
            citationList.innerHTML = '';
            
            if (this.citations.size === 0) {
                citationList.innerHTML = '<p>No citations saved</p>';
                return;
            }
            
            this.citations.forEach(citation => {
                const item = document.createElement('div');
                item.className = 'citation-item';
                item.innerHTML = `
                    <p>${citation}</p>
                    <button class="remove-citation">Remove</button>
                `;
                item.querySelector('.remove-citation').onclick = () => this.remove(citation);
                citationList.appendChild(item);
            });
        },
        
        createCitationList() {
            const container = document.createElement('div');
            container.className = 'saved-citations-container';
            container.innerHTML = `
                <h3>Saved Citations</h3>
                <div class="saved-citations"></div>
                <button class="export-citations">Export to BibTeX</button>
            `;
            
            container.querySelector('.export-citations').onclick = () => this.exportBibTeX();
            document.querySelector('#papers-intro').appendChild(container);
            return container.querySelector('.saved-citations');
        },
        
        saveToBrowser() {
            localStorage.setItem('savedCitations', JSON.stringify([...this.citations]));
        },
        
        loadFromBrowser() {
            const saved = localStorage.getItem('savedCitations');
            if (saved) {
                this.citations = new Set(JSON.parse(saved));
                this.updateUI();
            }
        },
        
        exportBibTeX() {
            const bibtex = [...this.citations].map(citation => {
                // Convert citation to BibTeX format
                const match = citation.match(/(.*?)\((.*?)\)\.(.*?)\..*?doi:(.*)/);
                if (!match) return '';
                
                const [_, authors, year, title, doi] = match;
                const key = `${authors.split(',')[0].trim().split(' ').pop()}${year}`;
                
                return `@article{${key},
    author = {${authors}},
    year = {${year}},
    title = {${title.trim()}},
    doi = {${doi.trim()}}
}`;
            }).join('\n\n');
            
            const blob = new Blob([bibtex], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'citations.bib';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    // Initialize citation manager
    citationManager.loadFromBrowser();

    // Add citation buttons functionality
    document.querySelectorAll('.copy-citation').forEach(button => {
        button.onclick = async (e) => {
            const citation = e.target.nextElementSibling.textContent;
            citationManager.add(citation);
            
            try {
                await navigator.clipboard.writeText(citation);
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.style.color = '#56d364';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.color = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy citation:', err);
            }
        };
    });

    // Add category filter functionality
    const categoryFilter = document.createElement('select');
    categoryFilter.className = 'category-filter';
    categoryFilter.innerHTML = `
        <option value="">All Categories</option>
        <option value="regenerative-braking">Regenerative Braking</option>
        <option value="energy-storage">Energy Storage</option>
        <option value="solar-integration">Solar Integration</option>
        <option value="ai-ml">AI & Machine Learning</option>
        <option value="theses">Theses & Dissertations</option>
    `;
    document.querySelector('#papers-intro').insertBefore(categoryFilter, yearFilter.nextSibling);

    categoryFilter.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            if (!selectedCategory || section.id === selectedCategory) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
        
        // Update stats to reflect filtered view
        updateStats();
    });
});