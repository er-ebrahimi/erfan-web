export const CONTACT_FORM = {
  valid: {
    contact: 'test@example.com',
    message: 'این یک پیام تست است. لطفا با من تماس بگیرید.',
  },
  phoneOnly: {
    contact: '09121234567',
    message: 'در مورد طراحی داخلی میخواستم اطلاعات بیشتری داشته باشم.',
  },
  invalid: {
    contact: '',
    message: '',
  },
  altchaError: {
    contact: 'user@test.com',
    message: 'Testing captcha error state.',
  },
} as const;

export const BLOG_SEARCH = {
  existingTerm: 'blog',
  nonExistingTerm: 'این‌عنوان‌وجودنداردxxxxx',
} as const;
