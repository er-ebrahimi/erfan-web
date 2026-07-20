export default {
  routes: [
    {
      method: 'GET',
      path: '/pages/populated',
      handler: 'page.populated',
      config: { auth: false },
    },
  ],
};
