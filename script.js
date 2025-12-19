// Load data from JSON file and populate the portfolio
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        populatePortfolio(data);
        initializeNavigation();
        initializeScrollAnimations();
    } catch (error) {
        console.error('Error loading data:', error);
    }
});

function populatePortfolio(data) {
    // Hero Section
    document.getElementById('hero-name').textContent = data.personalInfo.name;
    document.getElementById('hero-title').textContent = data.personalInfo.title;
    document.getElementById('hero-summary').textContent = data.summary;
    
    // Social Links
    const socialLinksHTML = generateSocialLinks(data.socialLinks);
    document.getElementById('social-links').innerHTML = socialLinksHTML;
    document.getElementById('contact-social-links').innerHTML = socialLinksHTML;
    
    // Contact Info
    document.getElementById('contact-email').textContent = data.personalInfo.email;
    document.getElementById('contact-phone').textContent = data.personalInfo.phone;
    document.getElementById('contact-location').textContent = data.personalInfo.location;
    
    // Footer
    document.getElementById('footer-name').textContent = data.personalInfo.name;
    
    // Languages
    const languagesContainer = document.getElementById('languages-container');
    languagesContainer.innerHTML = data.languages.map(lang => `
        <div class="language-item">
            <h4>${lang.language}</h4>
            <p>${lang.level}</p>
            <div class="language-rating">
                ${generateRatingDots(lang.rating)}
            </div>
        </div>
    `).join('');
    
    // Experience
    const experienceContainer = document.getElementById('experience-container');
    experienceContainer.innerHTML = data.experience.map(exp => `
        <div class="experience-card">
            <div class="experience-header">
                <div class="experience-title">
                    <h3>${exp.title}</h3>
                    <span>${exp.company}</span>
                </div>
                <div class="experience-links">
                    ${exp.projectRepo ? `<a href="${exp.projectRepo}" target="_blank" class="repo"><i class="fab fa-github"></i> Repository</a>` : ''}
                    ${exp.demo ? `<a href="${exp.demo}" target="_blank" class="demo"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                </div>
            </div>
            <div class="experience-description">
                <ul>
                    ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
    
    // Skills
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = data.skills.map(skill => `
        <span class="skill-tag">${skill}</span>
    `).join('');
    
    // Education
    const educationContainer = document.getElementById('education-container');
    educationContainer.innerHTML = `
        <div class="education-card">
            <i class="fas fa-graduation-cap"></i>
            <h3>${data.education.degree}</h3>
            <h4>${data.education.institution}</h4>
            <p><i class="far fa-calendar-alt"></i> Started ${data.education.startDate}</p>
        </div>
    `;
}

function generateSocialLinks(socialLinks) {
    const icons = {
        github: 'fab fa-github',
        linkedin: 'fab fa-linkedin-in',
        telegram: 'fab fa-telegram-plane'
    };
    
    return Object.entries(socialLinks).map(([platform, url]) => `
        <a href="${url}" target="_blank" title="${platform.charAt(0).toUpperCase() + platform.slice(1)}">
            <i class="${icons[platform]}"></i>
        </a>
    `).join('');
}

function generateRatingDots(rating) {
    const maxRating = 5;
    let dots = '';
    for (let i = 0; i < maxRating; i++) {
        dots += `<span class="${i < rating ? '' : 'empty'}"></span>`;
    }
    return dots;
}

function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    
    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Active link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
    
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
}

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.about-card, .experience-card, .skill-tag, .education-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
