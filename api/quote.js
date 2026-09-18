const nodemailer = require('nodemailer');

const SERVICE_LABELS = {
    'pasajeros': 'Transporte de Pasajeros (CIIU 4921)',
    'carga': 'Transporte de Carga por Carretera (CIIU 4923)',
    'maquinaria': 'Alquiler de Maquinaria y Equipo (CIIU 7730)',
    'otro': 'Otro Servicio'
};

const COMPANY_EMAIL = process.env.EMAIL_USER || 'itransalogistica@gmail.com';
const COMPANY_PHONE = '573136572695';

function generateCorporateEmailHTML(data) {
    const serviceName = SERVICE_LABELS[data.service] || data.service || 'Servicio General';
    const cleanPhone = (data.phone || '').replace(/\D/g, '');
    const waNumber = cleanPhone.length === 10 ? `57${cleanPhone}` : cleanPhone;
    const waChatUrl = cleanPhone 
        ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hola ${data.name}, te contactamos de ITRANSA S.A.S. respecto a tu solicitud de cotización para ${serviceName}.`)}`
        : '#';
    const callUrl = cleanPhone ? `tel:+${cleanPhone}` : '#';
    const mailUrl = `mailto:${data.email}?subject=${encodeURIComponent(`Cotización ITRANSA S.A.S. - ${serviceName}`)}`;

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Cotización ITRANSA</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f3f8; font-family:'Segoe UI', Arial, sans-serif; color:#1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f0f3f8; padding:30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width:620px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 24px rgba(13,27,80,0.08); border:1px solid #e2e8f0;" cellspacing="0" cellpadding="0">
          
          <!-- Top Accent Line -->
          <tr>
            <td height="5" style="background: linear-gradient(90deg, #162A76 0%, #E63422 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background-color:#0D1B50; padding:32px 36px; text-align:center;">
              <h1 style="margin:0; font-size:24px; font-weight:800; color:#ffffff; letter-spacing:0.5px;">ITRANSA</h1>
              <p style="margin:4px 0 0 0; font-size:12px; color:#cbd5e1; text-transform:uppercase; letter-spacing:1px; font-weight:600;">Ingeniería y Transporte Ayacucho S.A.S.</p>
              <div style="display:inline-block; margin-top:16px; background-color:#E63422; color:#ffffff; font-size:12px; font-weight:700; padding:6px 14px; border-radius:20px; text-transform:uppercase; letter-spacing:0.5px;">
                🚚 Nueva Solicitud de Cotización
              </div>
            </td>
          </tr>

          <!-- Notification Banner -->
          <tr>
            <td style="padding:24px 36px 10px 36px;">
              <p style="margin:0; font-size:15px; line-height:1.6; color:#334155;">
                Has recibido una nueva solicitud de cotización comercial enviada desde el sitio web oficial <strong>www.itransa.com.co</strong>.
              </p>
            </td>
          </tr>

          <!-- Section: Datos del Solicitante -->
          <tr>
            <td style="padding:15px 36px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:18px;">
                <tr>
                  <td colspan="2" style="padding-bottom:12px; border-bottom:1px solid #e2e8f0;">
                    <span style="font-size:13px; font-weight:700; color:#162A76; text-transform:uppercase; letter-spacing:0.5px;">
                      👤 Información de la Empresa / Cliente
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0 4px 0; font-size:13px; color:#64748b; width:35%;">Empresa:</td>
                  <td style="padding:10px 0 4px 0; font-size:14px; font-weight:700; color:#0f172a;">${data.company ? data.company.toUpperCase() : 'Particular / No especifica'}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0 4px 0; font-size:13px; color:#64748b;">Contacto:</td>
                  <td style="padding:6px 0 4px 0; font-size:14px; font-weight:600; color:#0f172a;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0 4px 0; font-size:13px; color:#64748b;">Teléfono:</td>
                  <td style="padding:6px 0 4px 0; font-size:14px; font-weight:600; color:#0f172a;">
                    <a href="${callUrl}" style="color:#162A76; text-decoration:none;">${data.phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0 0 0; font-size:13px; color:#64748b;">Correo electrónico:</td>
                  <td style="padding:6px 0 0 0; font-size:14px; font-weight:600; color:#0f172a;">
                    <a href="${mailUrl}" style="color:#162A76; text-decoration:none;">${data.email}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section: Requerimiento Logístico -->
          <tr>
            <td style="padding:10px 36px 15px 36px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:18px;">
                <tr>
                  <td colspan="2" style="padding-bottom:12px; border-bottom:1px solid #e2e8f0;">
                    <span style="font-size:13px; font-weight:700; color:#162A76; text-transform:uppercase; letter-spacing:0.5px;">
                      📦 Requerimiento Logístico
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0 4px 0; font-size:13px; color:#64748b; width:35%;">Servicio:</td>
                  <td style="padding:10px 0 4px 0; font-size:14px; font-weight:700; color:#E63422;">${serviceName}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0 4px 0; font-size:13px; color:#64748b;">Ruta / Trayecto:</td>
                  <td style="padding:6px 0 4px 0; font-size:14px; font-weight:600; color:#0f172a;">
                    ${data.origin || 'No especificado'} ➔ ${data.destination || 'No especificado'}
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0 4px 0; font-size:13px; color:#64748b;">Fecha Estimada:</td>
                  <td style="padding:6px 0 4px 0; font-size:14px; font-weight:600; color:#0f172a;">${data.date || 'No especificada'}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0 0 0; font-size:13px; color:#64748b; vertical-align:top;">Información Adicional:</td>
                  <td style="padding:6px 0 0 0; font-size:14px; line-height:1.5; color:#334155;">
                    ${data.message ? data.message.replace(/\n/g, '<br>') : 'Sin observaciones adicionales'}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Quick Action Buttons -->
          <tr>
            <td style="padding:15px 36px 30px 36px; text-align:center;">
              <p style="margin:0 0 16px 0; font-size:13px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">
                ⚡ Acciones Rápidas de Respuesta
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <!-- WhatsApp Button -->
                  <td style="padding:0 6px;">
                    <a href="${waChatUrl}" target="_blank" style="display:inline-block; background-color:#25D366; color:#ffffff; padding:12px 20px; border-radius:8px; font-size:14px; font-weight:700; text-decoration:none; box-shadow:0 2px 6px rgba(37,211,102,0.3);">
                      💬 Chatear por WhatsApp
                    </a>
                  </td>
                  <!-- Call Button -->
                  <td style="padding:0 6px;">
                    <a href="${callUrl}" style="display:inline-block; background-color:#162A76; color:#ffffff; padding:12px 20px; border-radius:8px; font-size:14px; font-weight:700; text-decoration:none; box-shadow:0 2px 6px rgba(22,42,118,0.25);">
                      📞 Llamar al Cliente
                    </a>
                  </td>
                  <!-- Mail Button -->
                  <td style="padding:0 6px;">
                    <a href="${mailUrl}" style="display:inline-block; background-color:#f1f5f9; color:#1e293b; border:1px solid #cbd5e1; padding:12px 18px; border-radius:8px; font-size:14px; font-weight:600; text-decoration:none;">
                      ✉️ Responder
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc; border-top:1px solid #e2e8f0; padding:20px 36px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#64748b; line-height:1.5;">
                <strong>Ingeniería y Transporte Ayacucho S.A.S. (ITRANSA)</strong><br>
                Aguachica, Cesar, Colombia | Teléfono: +57 3136572695<br>
                Este correo fue generado automáticamente desde <a href="https://www.itransa.com.co" style="color:#162A76; text-decoration:none;">www.itransa.com.co</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
}

module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }

    const data = req.body || {};

    if (!data.name || !data.phone || !data.email) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
    }

    const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

    // If no SMTP password configured, return fallback flag so frontend uses FormSubmit seamlessly
    if (!emailPass) {
        return res.status(200).json({ 
            success: false, 
            fallback: true, 
            message: 'Sin configuración SMTP local/Vercel. Utilizar fallback FormSubmit.' 
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: COMPANY_EMAIL,
                pass: emailPass
            }
        });

        const serviceName = SERVICE_LABELS[data.service] || data.service || 'Servicio';
        const companyTag = data.company ? `[${data.company.toUpperCase()}] ` : '';
        const subject = `🚚 COTIZACIÓN: ${companyTag}${data.name} - ${serviceName}`;

        const mailOptions = {
            from: `"ITRANSA Cotizaciones" <${COMPANY_EMAIL}>`,
            to: COMPANY_EMAIL,
            replyTo: data.email,
            subject: subject,
            html: generateCorporateEmailHTML(data)
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ 
            success: true, 
            message: 'Cotización enviada exitosamente con plantilla corporativa' 
        });
    } catch (error) {
        console.error('Error enviando correo con Nodemailer:', error);
        return res.status(500).json({ 
            success: false, 
            fallback: true, 
            message: error.message 
        });
    }
};
