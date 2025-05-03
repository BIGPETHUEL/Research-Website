// Content loader for research sections
document.addEventListener('DOMContentLoaded', () => {
    // Section content data
    const sectionContent = {
        fundamentals: {
            title: 'Research Fundamentals',
            content: `
                <h2>Energy Regeneration Basics</h2>
                <div class="Box">
                    <div class="Box-row">
                        <h3>Core Concepts</h3>
                        <ul>
                            <li>Regenerative Braking Systems</li>
                            <li>Kinetic Energy Recovery Systems (KERS)</li>
                            <li>Solar Energy Integration</li>
                        </ul>
                    </div>
                    <div class="Box-row">
                        <h3>Physics Principles</h3>
                        <ul>
                            <li>Conservation of Energy</li>
                            <li>Round-trip Efficiency</li>
                            <li>Energy Conversion Principles</li>
                        </ul>
                    </div>
                </div>
            `
        },
        methodology: {
            title: 'Research Methodology',
            content: `
                <h2>Research Approach</h2>
                <div class="Box">
                    <div class="Box-row">
                        <h3>Literature Review</h3>
                        <ul>
                            <li>Academic Databases</li>
                            <li>Industry Publications</li>
                            <li>Patent Analysis</li>
                        </ul>
                    </div>
                    <div class="Box-row">
                        <h3>Experimental Design</h3>
                        <ul>
                            <li>Variable Identification</li>
                            <li>Testing Protocols</li>
                            <li>Data Collection Methods</li>
                        </ul>
                    </div>
                </div>
            `
        },
        'case-studies': {
            title: 'Case Studies',
            content: `
                <h2>Industry Examples</h2>
                <div class="Box">
                    <div class="Box-row">
                        <h3>Commercial EVs</h3>
                        <ul>
                            <li>Tesla Regenerative Braking</li>
                            <li>Nissan e-Pedal Technology</li>
                            <li>BYD Energy Recovery</li>
                        </ul>
                    </div>
                </div>
            `
        },
        technical: {
            title: 'Technical Details',
            content: `
                <h2>Technical Deep Dive</h2>
                <div class="Box">
                    <div class="Box-row">
                        <h3>System Components</h3>
                        <ul>
                            <li>Motor Types and Controllers</li>
                            <li>Battery Management Systems</li>
                            <li>Power Electronics</li>
                        </ul>
                    </div>
                </div>
            `
        },
        future: {
            title: 'Future Directions',
            content: `
                <h2>Future Research Areas</h2>
                <div class="Box">
                    <div class="Box-row">
                        <h3>Emerging Technologies</h3>
                        <ul>
                            <li>AI Integration</li>
                            <li>Advanced Materials</li>
                            <li>Smart Grid Integration</li>
                        </ul>
                    </div>
                </div>
            `
        }
    };

    // Load content into sections
    Object.keys(sectionContent).forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.innerHTML = sectionContent[sectionId].content;
        }
    });

    // Navigation handling
    document.querySelectorAll('.UnderlineNav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            document.getElementById(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile navigation toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');

    // Toggle sidebar on mobile
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside on mobile
    content.addEventListener('click', () => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
                
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add active state to current section in navigation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentActive = document.querySelector('.sidebar a.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }
                
                const newActive = document.querySelector(`.sidebar a[href="#${entry.target.id}"]`);
                if (newActive) {
                    newActive.classList.add('active');
                }

                // Add animation class to visible sections
                entry.target.classList.add('section-visible');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach((section) => {
        observer.observe(section);
    });

    // Content box hover effects
    document.querySelectorAll('.content-box').forEach(box => {
        box.addEventListener('mouseenter', () => {
            box.classList.add('content-box-hover');
        });
        
        box.addEventListener('mouseleave', () => {
            box.classList.remove('content-box-hover');
        });
    });

    // Back to top button functionality
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    document.body.appendChild(backToTopBtn);

    // Show/hide back to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Smooth scroll to top
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Paper abstract toggle functionality
    document.querySelectorAll('.abstract-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const abstractContent = button.nextElementSibling;
            button.classList.toggle('active');
            abstractContent.classList.toggle('visible');
            button.textContent = button.classList.contains('active') ? 'Hide Abstract' : 'Show Abstract';
        });
    });

    // Citation copy functionality
    document.querySelectorAll('.copy-citation').forEach(button => {
        button.addEventListener('click', async () => {
            const citation = button.nextElementSibling.textContent;
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
        });
    });

    // Download tracking
    document.querySelectorAll('.download-button').forEach(button => {
        button.addEventListener('click', () => {
            const paperTitle = button.closest('.paper-item').querySelector('h3').textContent;
            const category = button.closest('section').id;
            
            // You would typically send this to a backend server
            console.log(`Downloaded: ${paperTitle} from ${category}`);
            
            // Update download count animation
            const countElement = button.querySelector('.download-count');
            if (countElement) {
                const currentCount = parseInt(countElement.textContent);
                countElement.textContent = currentCount + 1;
                countElement.classList.add('download-animation');
                setTimeout(() => countElement.classList.remove('download-animation'), 1000);
            }
        });
    });
});