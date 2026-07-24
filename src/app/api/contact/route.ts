import { NextResponse } from 'next/server';

const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, character => htmlEntities[character] || character);

const getString = (value: unknown) => typeof value === 'string' ? value.trim() : '';

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.RESEND_TO_EMAIL || 'Gopal@iscf.global';

  if (!apiKey || !from) {
    return NextResponse.json(
      { error: 'Email delivery has not been configured' },
      { status: 503 }
    );
  }

  try {
    const submission = await request.json();
    const firstName = getString(submission.firstName);
    const lastName = getString(submission.lastName);
    const email = getString(submission.email);
    const phone = getString(submission.phone);
    const subject = getString(submission.subject);
    const message = getString(submission.message);
    const newsletter = submission.newsletter === true;

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please complete all required fields' },
        { status: 400 }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    const senderName = `${firstName} ${lastName}`;
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Website contact: ${subject}`,
        text: [
          `Name: ${senderName}`,
          `Email: ${email}`,
          `Phone: ${phone || 'Not provided'}`,
          `Subject: ${subject}`,
          `Newsletter signup: ${newsletter ? 'Yes' : 'No'}`,
          '',
          'Message:',
          message,
        ].join('\n'),
        html: `<h2>Website contact submission</h2><p><strong>Name:</strong> ${escapeHtml(senderName)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><p><strong>Newsletter signup:</strong> ${newsletter ? 'Yes' : 'No'}</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>`,
      }),
    });

    if (!emailResponse.ok) {
      console.error('Resend email error:', await emailResponse.text());
      return NextResponse.json(
        { error: 'Unable to send your message at this time' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Unable to send your message at this time' },
      { status: 500 }
    );
  }
}
