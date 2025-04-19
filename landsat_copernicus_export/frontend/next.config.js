module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'earth.googleapis.com',
        pathname: '**',
      },
    ],
  },
};