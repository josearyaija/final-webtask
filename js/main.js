/**
 * Forma Woodworks - Main JavaScript
 * Handles navigation, animations, interactive configurator, lightbox, and form flows.
 */

document.addEventListener('DOMContentLoaded', () => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => document.querySelectorAll(selector);

  // -------------------------------------------------------------------------
  // 1. Mobile Navigation Toggle & Auto-Close
  // -------------------------------------------------------------------------
  const menuBtn = $('.menu');
  const navMenu = $('nav');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', navMenu.classList.contains('open'));
    });

    // Close mobile nav when clicking any nav link
    $$('nav a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        navMenu.classList.remove('open');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 2. Scroll Progress Bar, Scrolled Header, and Back-to-Top Button
  // -------------------------------------------------------------------------
  const header = $('header');
  const progressBar = $('.bar');
  const topBtn = $('.top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Header styling on scroll
    if (header && !header.classList.contains('header-light')) {
      header.classList.toggle('scrolled', scrollY > 40);
    }

    // Scroll reading progress
    if (progressBar && docHeight > 0) {
      const scrollPercent = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      progressBar.style.width = scrollPercent + '%';
    }

    // Back to top visibility
    if (topBtn) {
      topBtn.classList.toggle('show', scrollY > 450);
    }
  }, { passive: true });

  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -------------------------------------------------------------------------
  // 3. Scroll Reveal Entrance Animations
  // -------------------------------------------------------------------------
  const revealElements = $$(
    '.about-copy, .about-photo, .headrow, .service, .project, .step, .config, .service-detail-card, .timeline-item'
  );

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // -------------------------------------------------------------------------
  // 4. Custom Follower Cursor & 3D Tilt Card Effects
  // -------------------------------------------------------------------------
  const cursor = $('.cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    $$('a, button, .project, .service, .wood').forEach(interactiveEl => {
      interactiveEl.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.6)';
        cursor.style.borderColor = 'var(--walnut)';
      });
      interactiveEl.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.borderColor = 'var(--oak)';
      });
    });
  }

  // Subtle 3D perspective tilt on interactive cards
  $$('.service, .project, .wood').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // -------------------------------------------------------------------------
  // 5. Portfolio Category Filter & Lightbox Modal
  // -------------------------------------------------------------------------
  const filterBtns = $$('.filter');
  const projectCards = $$('.project');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      $('.filter.active')?.classList.remove('active');
      btn.classList.add('active');

      const category = btn.dataset.cat;
      projectCards.forEach(card => {
        if (category === 'all' || card.dataset.cat === category) {
          card.style.display = 'block';
          card.classList.add('visible');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Modal
  const modal = $('#modal');
  const modalImg = $('#modal img');
  const modalClose = $('#modal button');

  if (modal && modalImg) {
    $$('.project img, .gallery-item img').forEach(img => {
      img.addEventListener('click', () => {
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Expanded project photograph';
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 6. Showroom Room Tabs
  // -------------------------------------------------------------------------
  const showroomTabs = $$('.tab');
  const roomTitle = $('#room-title');
  const roomImg = $('#room-img');

  const roomData = {
    'Living room': {
      title: 'The Rowan Living Room',
      img: 'images/showroom-living.jpg',
      material: 'MATERIAL · SOLID WALNUT & NATURAL OAK<br>FINISH · HARDWAX OIL / SATIN',
      desc: 'Quietly sculptural, made for modern living. Low-profile credenzas, floating oak shelves, and soft-cornered walnut cocktail tables.'
    },
    'Bedroom': {
      title: 'The Still Bedroom Suite',
      img: 'images/showroom-bedroom.jpg',
      material: 'MATERIAL · ENGLISH ASH & RIFT OAK<br>FINISH · MATTE ORGANIC OIL',
      desc: 'Minimalist platform bed frame with integrated floating side tables and floor-to-ceiling recessed wardrobes.'
    },
    'Kitchen': {
      title: 'The Alder Kitchen & Pantry',
      img: 'images/showroom-kitchen.jpg',
      material: 'MATERIAL · QUARTERSAWN WHITE OAK & BRASS<br>FINISH · WATER-RESISTANT SATIN HARDWAX',
      desc: 'Solid dovetailed drawer boxes, concealed soft-close runners, and hand-selected continuous grain cabinet fronts.'
    },
    'Dining': {
      title: 'The Gather Dining Room',
      img: 'images/showroom-dining.jpg',
      material: 'MATERIAL · HERITAGE MAHOGANY & SMOKED OAK<br>FINISH · POLISHED BEESWAX & NATURAL OIL',
      desc: 'Substantial ten-seater dining table with through-tenon trestle base and ergonomic sculpted armchairs.'
    }
  };

  showroomTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      $('.tab.active')?.classList.remove('active');
      tab.classList.add('active');

      const roomKey = tab.dataset.room;
      const data = roomData[roomKey];
      if (data && roomTitle && roomImg) {
        roomTitle.textContent = data.title;
        roomImg.src = data.img;
        roomImg.alt = roomKey + ' showcase';

        const materialEl = tab.closest('.showroom')?.querySelector('.material');
        if (materialEl && data.material) materialEl.innerHTML = data.material;

        const descEl = tab.closest('.showroom')?.querySelector('.show-info p');
        if (descEl && data.desc) descEl.textContent = data.desc;
      }
    });
  });

  // -------------------------------------------------------------------------
  // 7. 3D Furniture Configurator & Materials Picker
  // -------------------------------------------------------------------------
  const furniture = $('#furniture');
  const woodSelect = $('#woodsel');
  const finishSelect = $('#finish');
  const pieceSelect = $('#piece');
  const woodSwatches = $$('.wood');

  const updateFurniturePreview = () => {
    if (!furniture) return;
    if (woodSelect) {
      furniture.style.setProperty('--wood', woodSelect.value);
    }
    if (finishSelect) {
      furniture.style.filter = `brightness(${finishSelect.value})`;
    }
  };

  if (woodSelect) woodSelect.addEventListener('change', updateFurniturePreview);
  if (finishSelect) finishSelect.addEventListener('change', updateFurniturePreview);

  if (pieceSelect && furniture) {
    pieceSelect.addEventListener('change', (e) => {
      const piece = e.target.value;
      if (piece === 'Dining table') {
        furniture.style.width = '220px';
        furniture.style.height = '110px';
      } else if (piece === 'Sideboard') {
        furniture.style.width = '195px';
        furniture.style.height = '120px';
      } else if (piece === 'Desk') {
        furniture.style.width = '180px';
        furniture.style.height = '95px';
      } else {
        furniture.style.width = '170px';
        furniture.style.height = '100px';
      }
      updateFurniturePreview();
    });
  }

  woodSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      $('.wood.active')?.classList.remove('active');
      swatch.classList.add('active');
      const color = swatch.dataset.wood;
      if (woodSelect) {
        woodSelect.value = color;
      }
      updateFurniturePreview();
    });
  });

  updateFurniturePreview();

  // -------------------------------------------------------------------------
  // 8. Testimonials Carousel
  // -------------------------------------------------------------------------
  const reviewText = $('#review');
  const reviewAuthor = $('#reviewby');
  const prevReviewBtn = $('#prev');
  const nextReviewBtn = $('#next');

  const reviews = [
    {
      quote: '“The care in every detail is clear. The finished piece feels like it has always belonged in our home.”',
      author: 'ELEANOR V. · CUSTOM DINING TABLE, OXFORDSHIRE'
    },
    {
      quote: '“From the first sketch to the final fitting, the whole experience felt thoughtful and personal. Our kitchen is now the centerpiece of our home.”',
      author: 'MARCUS & HELENA T. · KITCHEN CABINETRY, KENSINGTON'
    },
    {
      quote: '“Exceptional craftsmanship. The architectural wall panelling transformed our studio completely with subtle warmth and acoustic balance.”',
      author: 'DAVID K. · ARCHITECTURAL MILLWORK, CLERKENWELL'
    },
    {
      quote: '“Beautifully made, and exactly right for our space. The solid walnut desk is an heirloom our children will one day cherish.”',
      author: 'SOPHIE L. · EXECUTIVE OFFICE FURNITURE, BATH'
    }
  ];

  let currentReviewIdx = 0;

  const renderReview = (dir) => {
    if (!reviewText || !reviewAuthor) return;
    currentReviewIdx = (currentReviewIdx + dir + reviews.length) % reviews.length;

    reviewText.style.opacity = '0';
    reviewAuthor.style.opacity = '0';

    setTimeout(() => {
      reviewText.textContent = reviews[currentReviewIdx].quote;
      reviewAuthor.textContent = reviews[currentReviewIdx].author;
      reviewText.style.opacity = '1';
      reviewAuthor.style.opacity = '1';
    }, 200);
  };

  if (prevReviewBtn) prevReviewBtn.addEventListener('click', () => renderReview(-1));
  if (nextReviewBtn) nextReviewBtn.addEventListener('click', () => renderReview(1));

  // -------------------------------------------------------------------------
  // 9. Forms: Contact & WhatsApp Message Builder, Newsletter
  // -------------------------------------------------------------------------
  const contactForm = $('#contactform');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const phone = formData.get('phone') || 'Not provided';
      const category = formData.get('category') || contactForm.querySelector('select[name=category]')?.value || 'Custom Project';
      const material = formData.get('material') || contactForm.querySelector('select[name=material]')?.value || 'To discuss';
      const budget = formData.get('budget') || 'Flexible';
      const details = contactForm.querySelector('textarea')?.value || '';

      const msg = `Hello Forma Woodworks,\n\nI would like to discuss a custom woodworking commission:\n• Name: ${name}\n• Email: ${email}\n• Phone: ${phone}\n• Project Type: ${category}\n• Material Preference: ${material}\n• Estimated Budget: ${budget}\n• Project Notes: ${details}`;

      const msgBox = $('.form-msg');
      if (msgBox) {
        msgBox.textContent = 'Redirecting to WhatsApp to start your project consultation...';
      }

      window.open('https://wa.me/256789864290?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }

  // -------------------------------------------------------------------------
  // 10. Online Store Filtering, Sorting & Instant WhatsApp Order Flow
  // -------------------------------------------------------------------------
  const storeFilterBtns = $$('.store-filter-btn');
  const storeCards = $$('.store-card');
  const storeSortSelect = $('#store-sort');
  const storeGrid = $('#store-grid');

  if (storeFilterBtns.length > 0 && storeCards.length > 0) {
    storeFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        $('.store-filter-btn.active')?.classList.remove('active');
        btn.classList.add('active');
        const cat = btn.dataset.category;

        storeCards.forEach(card => {
          if (cat === 'all' || card.dataset.category === cat) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  if (storeSortSelect && storeGrid) {
    storeSortSelect.addEventListener('change', (e) => {
      const mode = e.target.value;
      const cardsArr = Array.from(storeCards);

      cardsArr.sort((a, b) => {
        const priceA = parseInt(a.dataset.price || '0', 10);
        const priceB = parseInt(b.dataset.price || '0', 10);
        if (mode === 'low-high') return priceA - priceB;
        if (mode === 'high-low') return priceB - priceA;
        return 0; // default featured
      });

      cardsArr.forEach(card => storeGrid.appendChild(card));
    });
  }

  // Handle direct WhatsApp order button clicks on store items
  $$('.store-buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.dataset.title || 'Bespoke Furniture Piece';
      const price = btn.dataset.price || '';
      const specs = btn.dataset.specs || '';

      const msg = `Hello Forma Woodworks,\n\nI would like to purchase / commission the following piece from your Online Store:\n• Item: ${title}\n• Listed Price: ${price}\n• Specification: ${specs}\n\nPlease confirm availability, lead time, and payment details.`;

      window.open('https://wa.me/256789864290?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  });

  // Allow clicking store item image to preview in lightbox modal
  $$('.store-card-img img').forEach(img => {
    img.addEventListener('click', () => {
      if (modal && modalImg) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Store piece';
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const newsletterForm = $('#newsletter');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = newsletterForm.querySelector('button');
      const input = newsletterForm.querySelector('input');
      if (btn) btn.textContent = 'SUBSCRIBED';
      if (input) {
        input.value = '';
        input.placeholder = 'Thank you for joining';
      }
    });
  }
});
