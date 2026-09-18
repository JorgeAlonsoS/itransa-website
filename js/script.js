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
        const COMPANY_EMAIL = 'itransalogistica@gmail.com';

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

        // Send Email: Try Serverless API first (Corporate HTML), fallback to FormSubmit
        const sendEmailAJAX = async (data) => {
            const serviceLabels = {
                'pasajeros': 'Transporte de Pasajeros (CIIU 4921)',
                'carga': 'Transporte de Carga por Carretera (CIIU 4923)',
                'maquinaria': 'Alquiler de Maquinaria y Equipo (CIIU 7730)',
                'otro': 'Otro Servicio'
            };

            // 1. Try local/Vercel Corporate API endpoint
            try {
                const apiRes = await fetch('/api/quote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (apiRes.ok) {
                    const apiData = await apiRes.json();
                    if (apiData.success) {
                        return { success: true, via: 'corporate-api' };
                    }
                }
            } catch (err) {
                // Ignore and proceed to FormSubmit fallback
            }

            // 2. High-reliability fallback via FormSubmit
            const cleanPhone = data.phone.replace(/\D/g, '');
            const waNumber = cleanPhone.length === 10 ? `57${cleanPhone}` : cleanPhone;
            const waLink = cleanPhone ? `https://wa.me/${waNumber}` : 'No disponible';
            const serviceName = serviceLabels[data.service] || data.service || 'Servicio General';
            const companyDisplay = data.company ? ` [${data.company.toUpperCase()}]` : '';

            const payload = {
                _subject: `🚚 COTIZACIÓN${companyDisplay}: ${data.name} - ${serviceName}`,
                _template: 'box',
                _replyto: data.email,
                _autorespond: `¡Gracias por comunicarte con ITRANSA (Ingeniería y Transporte Ayacucho S.A.S.)!\n\nHemos recibido tu solicitud de cotización exitosamente y nuestro equipo comercial revisará tus requerimientos para ponerse en contacto contigo a la brevedad.\n\nSi requieres atención inmediata, puedes comunicarte directamente a la línea de atención +57 3136572695.\n\nAtentamente,\nEquipo Comercial - ITRANSA S.A.S.`,
                '🏢 Empresa': data.company || 'Particular / No especifica',
                '👤 Solicitante': data.name,
                '📞 Teléfono': data.phone,
                '💬 WhatsApp Directo del Cliente': waLink,
                '✉️ Correo Electrónico': data.email,
                '🛠️ Servicio Solicitado': serviceName,
                '📍 Origen': data.origin || 'No especificado',
                '🏁 Destino': data.destination || 'No especificado',
                '📅 Fecha Estimada': data.date || 'No especificada',
                '📝 Detalles del Requerimiento': data.message || 'Sin observaciones adicionales'
            };

            const response = await fetch(`https://formsubmit.co/ajax/${COMPANY_EMAIL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                return { success: false, message: 'Error en la respuesta del servidor' };
            }

            try {
                const resData = await response.json();
                const isSuccess = resData.success === true || resData.success === 'true';
                return {
                    success: isSuccess,
                    via: 'formsubmit',
                    message: resData.message || ''
                };
            } catch (err) {
                return { success: false, message: 'Error parseando respuesta' };
            }
        };

        // Main Submit Action: Dual Dispatch (Email + WhatsApp Immediate Notification)
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
            submitBtn.innerHTML = '<i data-lucide="loader" class="icon-small spin"></i> Procesando cotización...';
            if (window.lucide) lucide.createIcons();

            try {
                const result = await sendEmailAJAX(data);
                if (result.success) {
                    // Open WhatsApp automatically for instant dual reception
                    const waUrl = `https://wa.me/${COMPANY_WHATSAPP}?text=${buildWhatsAppMessage(data)}`;
                    try {
                        window.open(waUrl, '_blank');
                    } catch (waErr) {
                        console.warn('Popup blocked, WhatsApp link provided in status card');
                    }

                    formStatus.className = 'form-status success';
                    formStatus.innerHTML = `
                        <div class="form-status-msg">✅ ¡Solicitud de cotización enviada con éxito!</div>
                        <div class="form-status-submsg">Hemos recibido tus datos por correo electrónico. Para recibir atención comercial inmediata, continúa en WhatsApp:</div>
                        <a href="${waUrl}" target="_blank" class="form-status-wa-btn">
                            <i data-lucide="message-circle" class="icon-small"></i> Abrir Chat en WhatsApp con un Asesor
                        </a>
                    `;
                    form.reset();
                    if (window.lucide) lucide.createIcons();
                } else if (result.message && (result.message.includes('Activation') || result.message.includes('actived'))) {
                    formStatus.className = 'form-status error';
                    formStatus.textContent = '⚠️ Se envió un correo de activación a itransalogistica@gmail.com. Por favor revisa tu correo y haz clic en "Activate Form" para comenzar a recibir las cotizaciones.';
                } else {
                    throw new Error(result.message || 'Servidor no respondió OK');
                }
            } catch (err) {
                console.error('Error enviando formulario:', err);
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Ocurrió un inconveniente al enviar la cotización por correo. Por favor inténtalo de nuevo o contáctanos directamente por teléfono o WhatsApp.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                if (window.lucide) lucide.createIcons();
            }
        });
    }
});
