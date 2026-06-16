import { NextRequest, NextResponse } from 'next/server';

import { getApiMessage } from '@/lib/intl-api';

// Lead-capture endpoint for the AI Solutions page.
// Mirrors /api/contact (web3forms email) but collects richer lead fields and
// uses a distinct subject + (optionally) a distinct recipient inbox.
export async function POST(request: NextRequest) {
  let locale = 'fa'; // Default locale

  try {
    const body = await request.json();
    const {
      name,
      company,
      contact,
      need,
      locale: requestLocale = 'fa',
    } = body;
    locale = requestLocale;

    // Validate required fields (company is optional)
    if (!name || !contact || !need) {
      const errorMessage = await getApiMessage(
        'contact.apiErrors.requiredFields',
        locale
      );
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }

    // Send email using web3forms (same provider as the contact form)
    const emailPayload = {
      access_key: process.env.CONTACT_EMAIL_ACCESS_KEY,
      subject: `🚀 New AI-Solutions Lead - ${name}`,
      message: `
New AI Solutions lead:

Name:    ${name}
Company: ${company || '—'}
Contact: ${contact}
Need:    ${need}

Sent at: ${new Date().toLocaleString('en-US')}
      `,
      from_name: 'AI Solutions Lead Form',
      to:
        process.env.AI_SOLUTIONS_LEAD_EMAIL ||
        process.env.CONTACT_EMAIL ||
        'your-email@example.com',
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
      console.error('Failed to send AI Solutions lead:', emailResult);
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
    console.error('AI Solutions lead form error:', error);
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
