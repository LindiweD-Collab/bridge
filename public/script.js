document.addEventListener('DOMContentLoaded', () => {
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const currentYearSpan = document.getElementById('current-year');

    const setActiveLink = () => {
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            link.classList.remove('active');
            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        });
    };
    setActiveLink();

    if (mobileNavToggle && mobileNav && mobileNavClose) {
        const closeMobileNav = () => mobileNav.classList.remove('open');
        mobileNavToggle.addEventListener('click', () => mobileNav.classList.add('open'));
        mobileNavClose.addEventListener('click', closeMobileNav);
        document.querySelectorAll('#mobile-nav .mobile-nav-link').forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });
    }

    const animatedElements = document.querySelectorAll('.fade-in-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formStatus.textContent = 'Sending...';
            formStatus.style.color = 'var(--slate-gray)';

            setTimeout(() => {
                formStatus.textContent = "Thank you! Your message has been sent.";
                formStatus.style.color = 'var(--accent-green)';
                contactForm.reset();
                setTimeout(() => { formStatus.textContent = ''; }, 5000);
            }, 1000);
        });
    }

    if(currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});

const monthlyRadio = document.getElementById('monthly');
const adhocRadio = document.getElementById('adhoc');
const monthlyPlans = document.getElementById('monthly-plans');
const adhocServices = document.getElementById('adhoc-services');

if (monthlyRadio && adhocRadio && monthlyPlans && adhocServices) {
    monthlyRadio.addEventListener('change', () => {
        if (monthlyRadio.checked) {
            monthlyPlans.style.display = 'block';
            adhocServices.style.display = 'none';
        }
    });
    adhocRadio.addEventListener('change', () => {
        if (adhocRadio.checked) {
            monthlyPlans.style.display = 'none';
            adhocServices.style.display = 'block';
        }
    });
}