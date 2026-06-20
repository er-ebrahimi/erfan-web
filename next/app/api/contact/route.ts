import { NextRequest, NextResponse } from 'next/server';

import { getApiMessage } from '@/lib/intl-api';

export async function POST(request: NextRequest) {
  let locale = 'fa'; // Default locale

  try {
    const body = await request.json();
    const {
      contact,
      message,
      locale: requestLocale = 'fa',
    } = body;
    locale = requestLocale;

    // Validate required fields. (Turnstile is disabled on the client — see
    // contact-us.tsx — so we no longer require/verify a turnstileToken; the
    // server still demanding one made every submission fail with a 400.)
    if (!contact || !message) {
      const errorMessage = await getApiMessage(
        'contact.apiErrors.requiredFields',
        locale
      );
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }

    // Send email using web3forms
    const emailPayload = {
      access_key: process.env.CONTACT_EMAIL_ACCESS_KEY,
      subject: `📧 New Message from Contact Form - ${contact}`,
      message: `
New message from the contact form:

Contact Info: ${contact}
Message: ${message}

Sent at: ${new Date().toLocaleString('en-US')}
      `,
      from_name: 'Website Contact Form',
      to: process.env.CONTACT_EMAIL || 'your-email@example.com',
      reply_to: contact,
    };

    const emailResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    const emailResult = await emailResponse.json();

    if (emailResponse.ok && emailResult.success) {
      const successMessage = await getApiMessage(
        'contact.apiErrors.sendSuccess',
        locale
      );
      return NextResponse.json({
        success: true,
        message: successMessage,
      });
    } else {
      console.error('Failed to send email:', emailResult);
      const errorMessage = await getApiMessage(
        'contact.apiErrors.sendFailed',
        locale
      );
      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    const errorMessage = await getApiMessage(
      'contact.apiErrors.processError',
      locale
    );
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
