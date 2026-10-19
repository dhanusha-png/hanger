import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, html, text }) {
  const from = process.env.SMTP_FROM || 'HangerHome <no-reply@hangerhome.com>';
  const t = getTransporter();

  if (!t) {
    console.log(`[SMTP Offline / Dev Log] Mail to: ${to} | Subject: "${subject}"`);
    if (text) console.log(`[Body]: ${text}`);
    return { ok: true, devMode: true };
  }

  try {
    const info = await t.sendMail({ from, to, subject, html, text });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    console.error('Failed to send email:', err.message);
    return { ok: false, error: err.message };
  }
}

export async function sendOrderConfirmationEmail(order) {
  const to = order.customer?.email;
  if (!to) return;

  const subject = `Order Confirmed: #${order.orderNumber || String(order._id).slice(-6).toUpperCase()}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #04120e; color: #f7f3ec; border-radius: 12px; border: 1px solid #e8c070;">
      <h2 style="color: #e8c070;">Thank you for your order!</h2>
      <p>Hello ${order.customer?.name || 'Valued Customer'},</p>
      <p>Your order <strong>#${order.orderNumber || String(order._id).slice(-6).toUpperCase()}</strong> has been recorded and will be prepared shortly.</p>
      <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin: 0 0 10px; color: #fff;">Order Summary</h4>
        ${order.items.map(i => `<p style="margin: 4px 0; font-size: 14px;">${i.name} × ${i.qty} — ₹${(i.price * i.qty).toLocaleString('en-IN')}</p>`).join('')}
        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 10px 0;" />
        <p style="margin: 4px 0; font-size: 16px; font-weight: bold; color: #e8c070;">Total: ₹${Number(order.total).toLocaleString('en-IN')}</p>
      </div>
      <p style="font-size: 12px; color: #95a8a0;">Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Razorpay)'}</p>
      <p style="font-size: 12px; color: #95a8a0;">HangerHome · Smart Space. Smarter Living.</p>
    </div>
  `;

  return sendMail({
    to,
    subject,
    html,
    text: `Your order #${order.orderNumber} for ₹${order.total} has been placed.`,
  });
}

export async function sendAdminNotification(type, data) {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const subject = `[HangerHome Alert] New ${type.toUpperCase()}: ${data.title || data.name || 'Submission'}`;
  const text = `New ${type} received:\n\n${JSON.stringify(data, null, 2)}`;

  return sendMail({ to: adminEmail, subject, text });
}
