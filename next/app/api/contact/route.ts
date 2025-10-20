import { NextRequest, NextResponse } from 'next/server';

import { getApiMessage } from '@/lib/intl-api';

export async function POST(request: NextRequest) {
  let locale = 'en'; // Default locale

  try {
    const body = await request.json();
    const {
      contact,
      message,
      turnstileToken,
      locale: requestLocale = 'en',
    } = body;
    locale = requestLocale;

    // Validate required fields
    if (!contact || !message || !turnstileToken) {
      const errorMessage = await getApiMessage(
        'contact.apiErrors.requiredFields',
        locale
      );
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }

    // Verify Turnstile token
    const turnstileResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }),
      }
    );

    const turnstileResult = await turnstileResponse.json();

    if (!turnstileResult.success) {
      console.error('Turnstile verification failed:', turnstileResult);
      const errorMessage = await getApiMessage(
        'contact.apiErrors.securityFailed',
        locale
      );
      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
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
