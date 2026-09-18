document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       Header & Navigation
       ========================================================================== */
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Header
    const scrollHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', scrollHeader);
    // Initial check
    scrollHeader();

    // Mobile Menu Toggle
    const openMenu = () => {
        navMenu.classList.add('active');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeMenu = () => {
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (navToggle) navToggle.addEventListener('click', openMenu);
    if (navClose) navClose.addEventListener('click', closeMenu);
    if (navOverlay) navOverlay.addEventListener('click', closeMenu);

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    /* ==========================================================================
       Scroll Spy (Active Nav Link)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    const scrollActive = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if(navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    };
    window.addEventListener('scroll', scrollActive);

    /* ==========================================================================
       Intersection Observer for Animations (Fade Up)
       ========================================================================== */
    const fadeElements = document.querySelectorAll('.fade-up');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animating to only animate once
                // fadeObserver.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));

    /* ==========================================================================
       Lightbox for Gallery and Fleet Items
       ========================================================================== */
    const lightboxItems = document.querySelectorAll('.gallery-item, .fleet-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxContent = lightbox ? lightbox.querySelector('.lightbox-content') : null;

    if (lightboxItems.length > 0 && lightbox && lightboxContent) {
        let currentIndex = 0;
        const itemsArray = Array.from(lightboxItems);

        const showLightboxImage = (index) => {
            currentIndex = index;
            const item = itemsArray[currentIndex];
            const imgSrc = item.getAttribute('data-img') || item.querySelector('img')?.src;
            const title = item.getAttribute('data-title') || item.querySelector('.fleet-name')?.textContent || 'ITRANSA Operaciones';

            if (imgSrc) {
                lightboxContent.innerHTML = `
                    <div class="lightbox-img-wrapper">
                        <img src="${imgSrc}" alt="${title}" class="lightbox-img">
                        <div class="lightbox-caption-text">${title}</div>
                    </div>
                `;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };

        itemsArray.forEach((item, idx) => {
            item.addEventListener('click', () => showLightboxImage(idx));
            item.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') showLightboxImage(idx);
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        const nextImage = () => {
            const nextIdx = (currentIndex + 1) % itemsArray.length;
            showLightboxImage(nextIdx);
        };

        const prevImage = () => {
            const prevIdx = (currentIndex - 1 + itemsArray.length) % itemsArray.length;
            showLightboxImage(prevIdx);
        };

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
        if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });
    }

    /* ==========================================================================
       Form Validation & Email Dispatch
       ========================================================================== */
    const form = document.getElementById('quote-form');
    const formStatus = document.getElementById('form-status');

    if (form) {
        const COMPANY_EMAIL = 'itransalogistica@gmail.com';

        // Bloquear fechas pasadas en el campo de fecha estimada
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm   = String(today.getMonth() + 1).padStart(2, '0');
            const dd   = String(today.getDate()).padStart(2, '0');
            dateInput.min = `${yyyy}-${mm}-${dd}`;
        }

        // Extract form data as object
        const getFormData = () => {
            return {
                name: document.getElementById('name')?.value.trim() || '',
                company: document.getElementById('company')?.value.trim() || '',
                phone: document.getElementById('phone')?.value.trim() || '',
                email: document.getElementById('email')?.value.trim() || '',
                service: document.getElementById('service')?.value || '',
                origin: document.getElementById('origin')?.value.trim() || '',
                destination: document.getElementById('destination')?.value.trim() || '',
                date: document.getElementById('date')?.value.trim() || '',
                message: document.getElementById('message')?.value.trim() || ''
            };
        };

        // Validate form input fields
        const validateForm = () => {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                const group = field.closest('.form-group');

                if (!field.value.trim()) {
                    isValid = false;
                    group.classList.add('error');
                } else if (field.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        isValid = false;
                        group.classList.add('error');
                    } else {
                        group.classList.remove('error');
                    }
                } else if (field.type === 'tel') {
                    const phoneRegex = /^[0-9+\s-]{7,15}$/;
                    if (!phoneRegex.test(field.value)) {
                        isValid = false;
                        group.classList.add('error');
                    } else {
                        group.classList.remove('error');
                    }
                } else {
                    group.classList.remove('error');
                }

                field.addEventListener('input', () => {
                    group.classList.remove('error');
                }, { once: true });
            });

            return isValid;
        };

        // ── Envío de correo: primero API corporativa, fallback FormSubmit ──
        const sendEmail = async (data) => {
            const SERVICE_LABELS = {
                'pasajeros': 'Transporte de Pasajeros (CIIU 4921)',
                'carga':     'Transporte de Carga por Carretera (CIIU 4923)',
                'maquinaria':'Alquiler de Maquinaria y Equipo (CIIU 7730)',
                'otro':      'Otro Servicio'
            };

            // 1. Intentar API propia (Vercel serverless / local)
            try {
                const apiRes = await fetch('/api/quote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (apiRes.ok) {
                    const apiData = await apiRes.json();
                    if (apiData.success) return { success: true };
                    if (!apiData.fallback) throw new Error(apiData.message || 'Error en API');
                    // Si fallback === true, sigue al paso 2
                }
            } catch (_) {
                // Red / 404 local → continuar al fallback
            }

            // 2. Fallback: FormSubmit AJAX
            const serviceName    = SERVICE_LABELS[data.service] || data.service || 'Servicio General';
            const companyDisplay = data.company ? ` [${data.company.toUpperCase()}]` : '';
            const cleanPhone     = data.phone.replace(/\D/g, '');
            const waLink         = cleanPhone ? `https://wa.me/${cleanPhone.length === 10 ? '57' + cleanPhone : cleanPhone}` : 'No disponible';

            const payload = {
                _subject:    `🚚 COTIZACIÓN${companyDisplay}: ${data.name} — ${serviceName}`,
                _template:   'box',
                _replyto:    data.email,
                _autorespond:`¡Gracias por comunicarte con ITRANSA (Ingeniería y Transporte Ayacucho S.A.S.)!\n\nHemos recibido tu solicitud de cotización y nuestro equipo comercial se pondrá en contacto contigo a la brevedad.\n\nAtentamente,\nEquipo Comercial - ITRANSA S.A.S.`,
                '🏢 Empresa':              data.company || 'Particular / No especifica',
                '👤 Solicitante':          data.name,
                '📞 Teléfono':             data.phone,
                '💬 WhatsApp del Cliente': waLink,
                '✉️ Correo':               data.email,
                '🛠️ Servicio':             serviceName,
                '📍 Origen':               data.origin  || 'No especificado',
                '🏁 Destino':              data.destination || 'No especificado',
                '📅 Fecha Estimada':       data.date    || 'No especificada',
                '📝 Observaciones':        data.message || 'Sin observaciones adicionales'
            };

            const resp = await fetch(`https://formsubmit.co/ajax/${COMPANY_EMAIL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!resp.ok) return { success: false, message: 'Error del servidor' };

            const resData = await resp.json();
            const ok      = resData.success === true || resData.success === 'true';
            return { success: ok, message: resData.message || '' };
        };

        // ── Enviar formulario (solo correo) ──
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!validateForm()) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Por favor completa todos los campos obligatorios (*) marcados en rojo.';
                return;
            }

            const data       = getFormData();
            const submitBtn  = form.querySelector('button[type="submit"]');
            const origText   = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i data-lucide="loader" class="icon-small spin"></i> Enviando cotización...';
            if (window.lucide) lucide.createIcons();

            try {
                const result = await sendEmail(data);

                if (result.success) {
                    formStatus.className = 'form-status success';
                    formStatus.innerHTML = `
                        <div class="form-status-msg">✅ ¡Cotización enviada exitosamente!</div>
                        <div class="form-status-submsg">
                            Hemos recibido tu solicitud. Nuestro equipo comercial se pondrá en contacto contigo a la brevedad.<br>
                            Para atención inmediata llámanos al <strong>313 657 2695</strong> o <strong>321 218 5773</strong>.
                        </div>
                    `;
                    form.reset();
                    // Auto-cerrar el mensaje luego de 4 segundos
                    setTimeout(() => {
                        formStatus.style.transition = 'opacity 0.6s ease';
                        formStatus.style.opacity = '0';
                        setTimeout(() => {
                            formStatus.className = 'form-status';
                            formStatus.innerHTML = '';
                            formStatus.style.opacity = '';
                            formStatus.style.transition = '';
                        }, 650);
                    }, 4000);
                } else if (result.message && (result.message.includes('Activation') || result.message.includes('actived'))) {
                    formStatus.className = 'form-status error';
                    formStatus.textContent = '⚠️ Debes activar el formulario: revisa el correo itransalogistica@gmail.com y haz clic en "Activate Form".';
                } else {
                    throw new Error(result.message || 'No se pudo enviar la cotización');
                }
            } catch (err) {
                console.error('Error enviando formulario:', err);
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Ocurrió un inconveniente al enviar. Por favor inténtalo de nuevo o contáctanos directamente al 313 657 2695.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = origText;
                if (window.lucide) lucide.createIcons();
            }
        });
    }
});
