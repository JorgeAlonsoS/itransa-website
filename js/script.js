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
       Form Validation & Dual Dispatch (Email + WhatsApp)
       ========================================================================== */
    const form = document.getElementById('quote-form');
    const formStatus = document.getElementById('form-status');

    if (form) {
        const COMPANY_WHATSAPP = '573136572695';
        const COMPANY_EMAIL = 'itransa.ayacucho@gmail.com';

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

        // Build structured WhatsApp message with Markdown formatting
        const buildWhatsAppMessage = (data) => {
            const serviceLabels = {
                'pasajeros': 'Transporte de Pasajeros',
                'carga': 'Transporte de Carga por Carretera',
                'maquinaria': 'Alquiler de Maquinaria y Equipo',
                'otro': 'Otro Servicio'
            };

            const serviceName = serviceLabels[data.service] || data.service || 'No especificado';

            let waText = `🚚 *NUEVA SOLICITUD DE COTIZACIÓN - ITRANSA*\n\n`;
            waText += `👤 *Nombre:* ${data.name}\n`;
            if (data.company) waText += `🏢 *Empresa:* ${data.company}\n`;
            waText += `📞 *Teléfono:* ${data.phone}\n`;
            waText += `✉️ *Correo:* ${data.email}\n`;
            waText += `🛠️ *Servicio:* ${serviceName}\n`;
            if (data.origin) waText += `📍 *Origen:* ${data.origin}\n`;
            if (data.destination) waText += `🏁 *Destino:* ${data.destination}\n`;
            if (data.date) waText += `📅 *Fecha Estimada:* ${data.date}\n`;
            if (data.message) waText += `📝 *Detalles:* ${data.message}\n`;
            waText += `\n_Solicitado desde la web www.itransa.com.co_`;

            return encodeURIComponent(waText);
        };

        // Open WhatsApp chat in new tab
        const openWhatsApp = (data) => {
            const encodedText = buildWhatsAppMessage(data);
            const waUrl = `https://wa.me/${COMPANY_WHATSAPP}?text=${encodedText}`;
            window.open(waUrl, '_blank');
        };

        // Send Email asynchronously via FormSubmit AJAX endpoint
        const sendEmailAJAX = async (data) => {
            const serviceLabels = {
                'pasajeros': 'Transporte de Pasajeros (CIIU 4921)',
                'carga': 'Transporte de Carga por Carretera (CIIU 4923)',
                'maquinaria': 'Alquiler de Maquinaria y Equipo (CIIU 7730)',
                'otro': 'Otro Servicio'
            };

            const payload = {
                _subject: `Nueva Cotización de ${data.name} - ITRANSA Web`,
                _replyto: data.email,
                _autorespond: `¡Gracias por comunicarte con ITRANSA (Ingeniería y Transporte Ayacucho S.A.S.)!\n\nHemos recibido tu solicitud de cotización exitosamente y nuestro equipo comercial revisará tus requerimientos para ponerse en contacto contigo a la brevedad.\n\nSi requieres atención inmediata, puedes comunicarte directamente a la línea de atención +57 3136572695.\n\nAtentamente,\nEquipo Comercial - ITRANSA S.A.S.`,
                Nombre: data.name,
                Empresa: data.company || 'N/A',
                Telefono: data.phone,
                Correo: data.email,
                Servicio: serviceLabels[data.service] || data.service,
                Origen: data.origin || 'N/A',
                Destino: data.destination || 'N/A',
                FechaEstimada: data.date || 'N/A',
                InformacionAdicional: data.message || 'N/A'
            };

            const response = await fetch(`https://formsubmit.co/ajax/${COMPANY_EMAIL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            return response.ok;
        };

        // Main Submit Action (Direct Email Dispatch)
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!validateForm()) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Por favor completa todos los campos obligatorios (*) marcados en rojo.';
                return;
            }

            const data = getFormData();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i data-lucide="loader" class="icon-small spin"></i> Enviando solicitud...';
            if (window.lucide) lucide.createIcons();

            try {
                const ok = await sendEmailAJAX(data);
                if (ok) {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = '✅ ¡Solicitud de cotización enviada exitosamente! Nos pondremos en contacto contigo a la brevedad.';
                    form.reset();

                    setTimeout(() => {
                        formStatus.textContent = '';
                        formStatus.className = 'form-status';
                    }, 2000);
                } else {
                    throw new Error('Servidor no respondió OK');
                }
            } catch (err) {
                console.error('Error enviando formulario:', err);
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Ocurrió un inconveniente al enviar la cotización por correo. Por favor inténtalo de nuevo o contáctanos directamente.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                if (window.lucide) lucide.createIcons();
            }
        });
    }
});
