export const getWsUrl = () =>
  process.env.BURGER_API_URL?.replace('https://', 'wss://').replace(
    '/api',
    ''
  ) ?? '';
