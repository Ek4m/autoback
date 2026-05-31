const { REASON_OPTIONS } = require("../../../modules/contact/constants");

module.exports = function (body) {
  const reason = REASON_OPTIONS.find((e) => e.value === body.reason)?.label;
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>AvtoFix Contact Request</title>
  </head>

  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

      <div style="padding:20px;background:orangered;color:#fff;">
        <h2 style="margin:0;font-size:20px;">Yeni əlaqə müraciəti</h2>
      </div>

      <div style="padding:24px;color:#111827;">

        <p style="margin-top:0;color:#6b7280;">
          AvtoFix platformasından yeni bir istifadəçi mesaj göndərdi.
        </p>

        <div style="margin-top:20px;">

          <p><strong>Ad və soyad:</strong> ${body.fullName}</p>

          <p><strong>E-poçt:</strong> ${body.email}</p>

          <p><strong>Telefon:</strong> ${body.phoneNumber}</p>

          <p><strong>Müraciət səbəbi:</strong> ${reason}</p>

          <p><strong>Mövzu:</strong> ${body.subject}</p>

        </div>

        <div style="margin-top:20px;">
          <p style="margin-bottom:8px;"><strong>Mesaj:</strong></p>
          <div style="padding:12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;white-space:pre-wrap;">
            ${body.message}
          </div>
        </div>

        <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />

        <p style="font-size:12px;color:#6b7280;">
          Bu mesaj AvtoFix contact form vasitəsilə göndərilmişdir.
        </p>

      </div>
    </div>
  </body>
</html>`;
};
