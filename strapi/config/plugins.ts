export default () => ({
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
      register: {
        allowedFields: ['username', 'email', 'password'],
      },
      email: {
        resetPassword: {
          emailTemplate: {
            subject: 'Reset your password',
            text: 'Click the link below to reset your password:',
            html: '<p>Click the link below to reset your password:</p>',
          },
        },
      },
    },
  },
  upload: {
    config: {
      sizeLimit: 250 * 1024 * 1024, // 256mb in bytes
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64,
      },
      // Windows-specific configuration
      providerOptions: {
        local: {
          // Ensure proper file handling on Windows
          maxFileSize: 250 * 1024 * 1024, // 256mb
        },
      },
    },
  },
});
