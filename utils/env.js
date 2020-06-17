// tiny wrapper with default env vars
module.exports = {
  NODE_ENV: (process.env.NODE_ENV || 'production'),
  PORT: (process.env.PORT || '3001'),
  IP: (process.env.IP || '127.0.0.1')
};
