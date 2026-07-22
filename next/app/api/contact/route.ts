import { NextRequest, NextResponse } from 'next/server';

import { verifyAltchaPayload } from '@/lib/altcha';
import { getApiMessage } from '@/lib/intl-api';
import { getProvider } from '@/lib/notifications/registry';

const ALTCHA_DISABLED = process.env.NEXT_PUBLIC_ALTCHA_DISABLED === 'true';

export async function POST(request: NextRequest) {
  let locale = 'fa';

  try {
    const body = await request.json();
    const {
      contact,
      message,
      altcha: altchaPayload,
      locale: requestLocale = 'fa',
    } = body;
    locale = requestLocale;

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

    if (!ALTCHA_DISABLED) {
      if (!altchaPayload) {
        const errorMessage = await getApiMessage(
          'contact.apiErrors.requiredFields',
          locale
        );
        return NextResponse.json(
          { success: false, message: errorMessage },
          { status: 400 }
        );
      }

      const { error: altchaError } = await verifyAltchaPayload(altchaPayload);

      if (altchaError) {
        console.error('ALTCHA verification failed:', altchaError);
        const errorMessage = await getApiMessage(
          'contact.apiErrors.securityFailed',
          locale
        );
        return NextResponse.json(
          { success: false, message: errorMessage },
          { status: 400 }
        );
      }
    }

    const provider = getProvider();
    const result = await provider.send({ contact, message });

    if (result.success) {
      const successMessage = await getApiMessage(
        'contact.apiErrors.sendSuccess',
        locale
      );
      return NextResponse.json({ success: true, message: successMessage });
    }

    const errorMessage = await getApiMessage(
      'contact.apiErrors.sendFailed',
      locale
    );
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    const errorMessage = await getApiMessage(
      'contact.apiErrors.processError',
      locale
    );
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
