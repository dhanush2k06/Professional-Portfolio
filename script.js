/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // Initialize Lucide Icons for dynamic rendering (if lucide object exists)
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ---------------------------------------------------------
     EMAILJS CONFIGURATION
     Configure your EmailJS account details here to receive mail.
     Learn more at: https://www.emailjs.com/
     --------------------------------------------------------- */
  const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY', // e.g. 'user_xxxxxxxxxxxxxx'
    SERVICE_ID: 'YOUR_EMAILJS_SERVICE_ID', // e.g. 'service_xxxxxxx'
    TEMPLATE_ID: 'YOUR_EMAILJS_TEMPLATE_ID', // e.g. 'template_xxxxxxx'
    RECIPIENT_EMAIL: 'dhanushharidoss47@gmail.com'
  };

  // Initialize EmailJS if public key is configured
  const isEmailJSConfigured = EMAILJS_CONFIG.PUBLIC_KEY && 
                              EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY' &&
                              EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_EMAILJS_SERVICE_ID' &&
                              EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_EMAILJS_TEMPLATE_ID';

  if (isEmailJSConfigured && typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    console.log("EmailJS successfully initialized.");
  } else {
    console.log("EmailJS details not configured. Operating in mailto fallback mode.");
  }

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
    } else {
      menuOpenIcon.style.display = 'block';
      menuCloseIcon.style.display = 'none';
      document.body.style.overflow = '';
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

    // Active Section Tracking (Scrollspy)
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120; // offset navigation height

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

  window.addEventListener('scroll', handleScroll);
  // Run once on load to establish current scroll position
  handleScroll();

  /* ==========================================================================
     SCROLL REVEAL ANIMATIONS (Intersection Observer)
     ========================================================================== */
  // Dynamically add 'reveal-item' classes to section elements for smooth transition entry
  const animatableElements = [
    ...document.querySelectorAll('.about-text-column'),
    ...document.querySelectorAll('.stats-glass-card'),
    ...document.querySelectorAll('.skills-card'),
    ...document.querySelectorAll('.project-card'),
    ...document.querySelectorAll('.timeline-item'),
    ...document.querySelectorAll('.cert-card'),
    ...document.querySelectorAll('.contact-info-column'),
    ...document.querySelectorAll('.contact-form-column')
  ];

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

  /* ==========================================================================
     CONTACT FORM & EMAIL DELIVERY
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const alertBox = document.getElementById('contact-alert');
  const alertMsg = document.getElementById('alert-message');
  const alertClose = document.getElementById('alert-close');
  const submitBtn = document.getElementById('form-submit');
  const spinner = submitBtn.querySelector('.spinner');
  const btnText = submitBtn.querySelector('span');
  const btnIcon = submitBtn.querySelector('.btn-icon');

  const showAlert = (type, message) => {
    alertBox.style.display = 'flex';
    alertBox.className = `alert-box ${type}`;
    alertMsg.textContent = message;
    
    // Auto scroll to alert
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const hideAlert = () => {
    alertBox.style.display = 'none';
  };

  if (alertClose) {
    alertClose.addEventListener('click', hideAlert);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      // Reset state
      hideAlert();
      submitBtn.disabled = true;
      spinner.style.display = 'block';
      btnText.textContent = 'Sending...';
      if (btnIcon) btnIcon.style.display = 'none';

      // Gather form inputs
      const formName = document.getElementById('form-name').value.trim();
      const formEmail = document.getElementById('form-email').value.trim();
      const formSubject = document.getElementById('form-subject').value.trim() || 'No Subject';
      const formMessage = document.getElementById('form-message').value.trim();

      // Form validation check
      if (!formName || !formEmail || !formMessage) {
        showAlert('error', 'Please fill in all required fields marked with an asterisk (*).');
        resetSubmitButton();
        return;
      }

      if (isEmailJSConfigured) {
        // Send email via EmailJS API
        const emailParams = {
          from_name: formName,
          from_email: formEmail,
          subject: formSubject,
          message: formMessage,
          to_email: EMAILJS_CONFIG.RECIPIENT_EMAIL
        };

        emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, emailParams)
          .then(() => {
            showAlert('success', 'Thank you! Your message was delivered successfully. I will get back to you shortly.');
            contactForm.reset();
            resetSubmitButton();
          })
          .catch((error) => {
            console.error('EmailJS Error:', error);
            showAlert('error', 'Failed to dispatch email automatically via EmailJS. Redirecting to your local email client.');
            setTimeout(() => {
              triggerMailtoFallback(formName, formEmail, formSubject, formMessage);
              resetSubmitButton();
            }, 2000);
          });
      } else {
        // Fallback: Using prefilled mailto draft
        showAlert('success', 'Launching your local mail client to dispatch your message...');
        setTimeout(() => {
          triggerMailtoFallback(formName, formEmail, formSubject, formMessage);
          contactForm.reset();
          resetSubmitButton();
        }, 1200);
      }
    });
  }

  // Restore submit button view
  function resetSubmitButton() {
    submitBtn.disabled = false;
    spinner.style.display = 'none';
    btnText.textContent = 'Send Message';
    if (btnIcon) btnIcon.style.display = 'block';
  }

  // Construct mailto link
  function triggerMailtoFallback(name, email, subject, message) {
    const formattedSubject = encodeURIComponent(`Portfolio Connect: ${subject}`);
    const emailBody = encodeURIComponent(
      `Hello Dhanush,\n\n` +
      `${message}\n\n` +
      `-----------------------------------------\n` +
      `Sender: ${name}\n` +
      `Contact Email: ${email}`
    );
    
    const mailtoUrl = `mailto:${EMAILJS_CONFIG.RECIPIENT_EMAIL}?subject=${formattedSubject}&body=${emailBody}`;
    
    // Create hidden anchor element to trigger browser default mail action without resetting page view
    const tempLink = document.createElement('a');
    tempLink.href = mailtoUrl;
    tempLink.target = '_blank';
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  }
});
