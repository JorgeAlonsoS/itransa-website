const fs = require('fs');
const b64 = fs.readFileSync('./api/_logo_b64.txt', 'utf8').trim();
const LOGO_SRC = 'data:image/png;base64,' + b64;

const SERVICE_LABELS = {
    'pasajeros': 'Transporte de Pasajeros (CIIU 4921)',
    'carga': 'Transporte de Carga por Carretera (CIIU 4923)',
    'maquinaria': 'Alquiler de Maquinaria y Equipo (CIIU 7730)',
    'otro': 'Otro Servicio'
};

function generateCorporateEmailHTML(data) {
    const serviceName = SERVICE_LABELS[data.service] || data.service || 'Servicio General';
    const cleanPhone = (data.phone || '').replace(/\D/g, '');
    const waChatUrl = cleanPhone ? `https://wa.me/57${cleanPhone}` : '#';
    const callUrl = cleanPhone ? `tel:+${cleanPhone}` : '#';
    const mailUrl = `mailto:${data.email}?subject=${encodeURIComponent('Cotizacion ITRANSA S.A.S. - ' + serviceName)}`;
    const ruta = `${data.origin || 'No especificado'} → ${data.destination || 'No especificado'}`;
    const empresa = data.company ? data.company.toUpperCase() : 'Particular / No especifica';
    const detalle = data.message || 'Sin observaciones adicionales';

    return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Nueva Cotización ITRANSA</title>
</head>
<body style="margin:0;padding:0;background-color:#e8edf5;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#e8edf5;padding:32px 12px;">
  <tr><td align="center">
  <table role="presentation" width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #dde3ef;" cellspacing="0" cellpadding="0">

    <!-- Top accent stripe -->
    <tr><td height="5" style="background:linear-gradient(90deg,#162A76 0%,#E63422 100%);"></td></tr>

    <!-- Header with logo -->
    <tr>
      <td style="background-color:#0D1B50;padding:30px 36px 24px 36px;text-align:center;">
        <img src="${LOGO_SRC}" alt="ITRANSA" width="200" height="auto" style="display:block;margin:0 auto 14px auto;">
        <div style="display:inline-block;background-color:#E63422;color:#ffffff;font-size:11px;font-weight:700;padding:6px 18px;border-radius:20px;text-transform:uppercase;letter-spacing:1.2px;">
          🚚 Nueva Solicitud de Cotización
        </div>
      </td>
    </tr>

    <!-- Intro text -->
    <tr>
      <td style="padding:26px 36px 10px 36px;">
        <p style="margin:0;font-size:14px;line-height:1.65;color:#475569;">
          Has recibido una nueva solicitud de cotización comercial desde
          <a href="https://www.itransa.com.co" style="color:#162A76;text-decoration:none;font-weight:700;">www.itransa.com.co</a>.
          A continuación los detalles de la solicitud:
        </p>
      </td>
    </tr>

    <!-- Section: Datos del Solicitante -->
    <tr>
      <td style="padding:10px 36px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td colspan="2" style="background-color:#162A76;padding:10px 16px;">
              <span style="font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:1px;">👤 Datos del Solicitante</span>
            </td>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:11px 16px;font-size:12px;color:#64748b;width:36%;border-bottom:1px solid #f1f5f9;">Empresa / Organización</td>
            <td style="padding:11px 16px;font-size:14px;font-weight:700;color:#0f172a;border-bottom:1px solid #f1f5f9;">${empresa}</td>
          </tr>
          <tr style="background-color:#ffffff;">
            <td style="padding:11px 16px;font-size:12px;color:#64748b;border-bottom:1px solid #f1f5f9;">Nombre del Contacto</td>
            <td style="padding:11px 16px;font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;">${data.name}</td>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:11px 16px;font-size:12px;color:#64748b;border-bottom:1px solid #f1f5f9;">Teléfono</td>
            <td style="padding:11px 16px;font-size:14px;font-weight:600;border-bottom:1px solid #f1f5f9;">
              <a href="${callUrl}" style="color:#162A76;text-decoration:none;">${data.phone}</a>
            </td>
          </tr>
          <tr style="background-color:#ffffff;">
            <td style="padding:11px 16px;font-size:12px;color:#64748b;">Correo Electrónico</td>
            <td style="padding:11px 16px;font-size:14px;font-weight:600;">
              <a href="${mailUrl}" style="color:#162A76;text-decoration:none;">${data.email}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Section: Requerimiento -->
    <tr>
      <td style="padding:12px 36px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td colspan="2" style="background-color:#162A76;padding:10px 16px;">
              <span style="font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:1px;">📦 Requerimiento Logístico</span>
            </td>
          </tr>
          <tr style="background-color:#fff8f7;">
            <td style="padding:11px 16px;font-size:12px;color:#64748b;width:36%;border-bottom:1px solid #f1f5f9;">Servicio Solicitado</td>
            <td style="padding:11px 16px;font-size:14px;font-weight:700;color:#E63422;border-bottom:1px solid #f1f5f9;">${serviceName}</td>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:11px 16px;font-size:12px;color:#64748b;border-bottom:1px solid #f1f5f9;">Ruta</td>
            <td style="padding:11px 16px;font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;">${ruta}</td>
          </tr>
          <tr style="background-color:#ffffff;">
            <td style="padding:11px 16px;font-size:12px;color:#64748b;border-bottom:1px solid #f1f5f9;">Fecha Estimada</td>
            <td style="padding:11px 16px;font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;">${data.date || 'No especificada'}</td>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:11px 16px;font-size:12px;color:#64748b;vertical-align:top;">Observaciones</td>
            <td style="padding:11px 16px;font-size:14px;line-height:1.55;color:#334155;">${detalle.replace(/\n/g, '<br>')}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Action Buttons -->
    <tr>
      <td style="padding:16px 36px 32px 36px;text-align:center;">
        <p style="margin:0 0 14px 0;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Responder al cliente</p>
        <table role="presentation" cellspacing="0" cellpadding="0" align="center">
          <tr>
            <td style="padding:0 5px;">
              <a href="${waChatUrl}" target="_blank" style="display:inline-block;background-color:#25D366;color:#ffffff;padding:11px 20px;border-radius:7px;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:0.3px;">
                💬 WhatsApp
              </a>
            </td>
            <td style="padding:0 5px;">
              <a href="${callUrl}" style="display:inline-block;background-color:#162A76;color:#ffffff;padding:11px 20px;border-radius:7px;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:0.3px;">
                📞 Llamar
              </a>
            </td>
            <td style="padding:0 5px;">
              <a href="${mailUrl}" style="display:inline-block;background-color:#f1f5f9;color:#1e293b;border:1px solid #cbd5e1;padding:11px 18px;border-radius:7px;font-size:13px;font-weight:600;text-decoration:none;">
                ✉️ Responder
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color:#0D1B50;padding:20px 36px;text-align:center;">
        <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.7;">
          <strong style="color:#e2e8f0;">ITRANSA · Ingeniería y Transporte Ayacucho S.A.S.</strong><br>
          Aguachica, Cesar, Colombia &nbsp;·&nbsp; +57 313 657 2695<br>
          Correo generado automáticamente desde
          <a href="https://www.itransa.com.co" style="color:#60a5fa;text-decoration:none;">www.itransa.com.co</a>
        </p>
      </td>
    </tr>
    <!-- Bottom accent stripe -->
    <tr><td height="4" style="background:linear-gradient(90deg,#E63422 0%,#162A76 100%);"></td></tr>

  </table>
  </td></tr>
</table>
</body>
</html>
`;
}

const html = generateCorporateEmailHTML({
    name: 'Jorge Alonso',
    company: 'Empresa Test',
    phone: '3136572695',
    email: 'test@gmail.com',
    service: 'carga',
    origin: 'Bogota',
    destination: 'Barranquilla',
    date: '2026-10-01',
    message: 'Necesito transportar maquinaria pesada.'
});

fs.writeFileSync('./api/_test_email.html', html);
console.log('HTML generado OK, longitud:', html.length);
