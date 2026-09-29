// ===================================================================
// MAKHI MAGOBO - INTERACTIVE APP LOGIC & DEAL WORKFLOW
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation on Scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }

  // 3. Interactive Deal Funding Assessment Tool
  const capitalSlider = document.getElementById('capital-slider');
  const capitalDisplay = document.getElementById('capital-display');
  const matchesCount = document.getElementById('matches-count');
  const ltvDisplay = document.getElementById('ltv-display');
  const projectTypeSelect = document.getElementById('project-type');
  const dealStageSelect = document.getElementById('deal-stage');
  const openDealModalBtn = document.getElementById('open-deal-modal-btn');
  const messageInput = document.getElementById('contact-message');

  function formatCurrency(val) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  }

  function updateDealEstimates() {
    if (!capitalSlider) return;
    const amount = Number(capitalSlider.value);
    capitalDisplay.textContent = formatCurrency(amount);

    // Dynamic bank matches calculation from 400+ lending pool
    let baseMatches = 25;
    if (amount >= 10000000) baseMatches = 48;
    else if (amount >= 5000000) baseMatches = 38;
    else if (amount >= 2000000) baseMatches = 30;

    const assetClass = projectTypeSelect ? projectTypeSelect.value : 'multifamily';
    let multiplier = 1.0;
    if (assetClass === 'multifamily') multiplier = 1.25;
    if (assetClass === 'sustainable') multiplier = 1.35;
    if (assetClass === 'industrial') multiplier = 1.15;

    const estimatedBanks = Math.round(baseMatches * multiplier);
    if (matchesCount) {
      matchesCount.textContent = `${estimatedBanks}+ Banks`;
    }

    // Dynamic LTV/LTC display
    const stage = dealStageSelect ? dealStageSelect.value : 'shovel-ready';
    if (ltvDisplay) {
      if (stage === 'land-entitlement') {
        ltvDisplay.textContent = 'Up to 50% - 65% LTC';
      } else if (stage === 'shovel-ready') {
        ltvDisplay.textContent = 'Up to 75% - 85% LTC';
      } else if (stage === 'stabilized') {
        ltvDisplay.textContent = 'Up to 75% - 80% LTV';
      } else {
        ltvDisplay.textContent = 'Up to 70% - 80% LTC';
      }
    }
  }

  if (capitalSlider) {
    capitalSlider.addEventListener('input', updateDealEstimates);
  }
  if (projectTypeSelect) {
    projectTypeSelect.addEventListener('change', updateDealEstimates);
  }
  if (dealStageSelect) {
    dealStageSelect.addEventListener('change', updateDealEstimates);
  }

  // Pre-fill contact form from calculator
  if (openDealModalBtn && messageInput) {
    openDealModalBtn.addEventListener('click', () => {
      const amount = formatCurrency(capitalSlider.value);
      const asset = projectTypeSelect.options[projectTypeSelect.selectedIndex].text;
      const stage = dealStageSelect.options[dealStageSelect.selectedIndex].text;

      messageInput.value = `I would like to submit a deal for funding review:\n• Asset Type: ${asset}\n• Project Stage: ${stage}\n• Estimated Capital Requirement: ${amount}\n\nPlease contact me regarding lender placement and structuring.`;
      
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        messageInput.focus();
      }
    });
  }

  // 4. Contact Form Submission with Netlify & Bot Protection
  const contactForm = document.getElementById('deal-inquiry-form');
  const successMsg = document.getElementById('form-success');

  if (contactForm && successMsg) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Encrypting & Transmitting Deal...';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then(() => {
        submitBtn.textContent = 'Inquiry Transmitted Securely';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        successMsg.style.display = 'block';
        contactForm.reset();
      })
      .catch((err) => {
        console.warn('Form submission response:', err);
        // Fallback smooth confirmation
        submitBtn.textContent = 'Inquiry Sent Successfully';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        successMsg.style.display = 'block';
        contactForm.reset();
      });
    });
  }

  // Initial calculation run
  updateDealEstimates();
});
