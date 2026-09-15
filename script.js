/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // Initialize Lucide Icons for dynamic rendering (if lucide object exists)
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ---------------------------------------------------------
     CONTACT FORM ROUTING CONFIGURATION
     Uses mailto: to open the visitor's default email client
     with a pre-filled message addressed to the owner.
     --------------------------------------------------------- */
  const RECIPIENT_EMAIL = 'dhanushharidoss47@gmail.com';

  /* ==========================================================================
     IOS SAFE AREA & VIEWPORT FIX
     ========================================================================== */
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setVH();
  window.addEventListener('resize', setVH);

  /* ==========================================================================
     MOBILE DRAWER TOGGLE
     ========================================================================== */
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const menuOpenIcon = document.querySelector('.menu-open-icon');
  const menuCloseIcon = document.querySelector('.menu-close-icon');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = () => {
    const isOpen = mobileDrawer.classList.toggle('open');
    if (isOpen) {
      menuOpenIcon.style.display = 'none';
      menuCloseIcon.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Lock background scrolling
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      menuOpenIcon.style.display = 'block';
      menuCloseIcon.style.display = 'none';
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  // Close drawer when clicking links
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // Close drawer on escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      toggleMobileMenu();
    }
  });

  /* ==========================================================================
     STICKY NAVIGATION & SCROLL TRACKING
     ========================================================================== */
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  const handleScroll = () => {
    // Add shadow/shrink styling to header on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Tracking (Scrollspy) - adjust offset for mobile
    const isMobile = window.innerWidth <= 768;
    const scrollOffset = isMobile ? 80 : 120;
    let currentSectionId = '';
    const scrollPosition = window.scrollY + scrollOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Run once on load to establish current scroll position
  handleScroll();
  
  // Re-run scroll spy on resize for accurate offset
  window.addEventListener('resize', handleScroll);

  /* ==========================================================================
     SCROLL REVEAL ANIMATIONS (Intersection Observer)
     ========================================================================== */
  // Dynamically add 'reveal-item' classes to section elements for smooth transition entry
  const animatableElements = [
    ...document.querySelectorAll('.about-text-column'),
    ...document.querySelectorAll('.stats-glass-card'),
    ...document.querySelectorAll('.project-card'),
    ...document.querySelectorAll('.timeline-item'),
    ...document.querySelectorAll('.cert-card')
  ].filter(el => !el.closest('.skills-section'));

  animatableElements.forEach(el => {
    el.classList.add('reveal-item');
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once revealed to keep layout light
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // trigger when 15% is visible
    rootMargin: '0px 0px -50px 0px' // offset bottom triggers slightly
  });

  animatableElements.forEach(el => {
    revealObserver.observe(el);
  });
});
