document.addEventListener('DOMContentLoaded', () => {
    // Progress tracking for timeline
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('timeline-active');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });

    // Resource links tracking
    document.querySelectorAll('.resource-card a').forEach(link => {
        link.addEventListener('click', () => {
            // Could be expanded to track resource usage
            console.log(`Resource accessed: ${link.textContent}`);
        });
    });

    // Handle resource downloads
    document.querySelectorAll('.resource-button').forEach(button => {
        button.addEventListener('click', (e) => {
            // Add downloading animation
            button.classList.add('downloading');
            
            // Track download in analytics
            const resourceName = button.textContent.trim();
            const resourceType = button.getAttribute('href').split('.').pop();
            console.log(`Downloading ${resourceName} (${resourceType})`);
            
            // Remove animation after download starts
            setTimeout(() => {
                button.classList.remove('downloading');
            }, 1000);
        });
    });

    // Resource availability check
    function checkResourceAvailability() {
        document.querySelectorAll('.resource-button').forEach(button => {
            const resourcePath = button.getAttribute('href');
            fetch(resourcePath, { method: 'HEAD' })
                .then(response => {
                    if (!response.ok) {
                        button.classList.add('resource-unavailable');
                        button.setAttribute('title', 'Resource temporarily unavailable');
                    }
                })
                .catch(() => {
                    button.classList.add('resource-unavailable');
                    button.setAttribute('title', 'Resource temporarily unavailable');
                });
        });
    }

    // Check resource availability on page load
    checkResourceAvailability();

    // Add resource previews
    document.querySelectorAll('.resource-button[href$=".pdf"]').forEach(button => {
        button.addEventListener('mouseenter', () => {
            const preview = document.createElement('div');
            preview.className = 'resource-preview';
            preview.innerHTML = `
                <div class="preview-header">
                    <span class="preview-icon">📄</span>
                    <span class="preview-title">${button.textContent.trim()}</span>
                </div>
                <div class="preview-content">
                    <p>Preview the contents of this resource</p>
                </div>
            `;
            
            const rect = button.getBoundingClientRect();
            preview.style.top = `${rect.bottom + window.scrollY + 10}px`;
            preview.style.left = `${rect.left}px`;
            
            document.body.appendChild(preview);
        });
        
        button.addEventListener('mouseleave', () => {
            const preview = document.querySelector('.resource-preview');
            if (preview) {
                preview.remove();
            }
        });
    });

    // Method card interaction
    document.querySelectorAll('.method-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.method-card').forEach(c => 
                c.classList.remove('method-active'));
            card.classList.add('method-active');
        });
    });

    // Keyword tag filtering
    document.querySelectorAll('.keyword').forEach(tag => {
        tag.addEventListener('click', () => {
            const keyword = tag.textContent.toLowerCase();
            // Could be expanded to filter related content
            console.log(`Selected keyword: ${keyword}`);
        });
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - 
                      document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Add research area expandable details
    document.querySelectorAll('.area-card').forEach(card => {
        const heading = card.querySelector('h4');
        const content = card.querySelector('ul');
        
        if (heading && content) {
            content.style.maxHeight = '0';
            content.style.overflow = 'hidden';
            content.style.transition = 'max-height 0.3s ease-out';
            
            heading.addEventListener('click', () => {
                if (content.style.maxHeight === '0px') {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    card.classList.add('expanded');
                } else {
                    content.style.maxHeight = '0';
                    card.classList.remove('expanded');
                }
            });
        }
    });
});