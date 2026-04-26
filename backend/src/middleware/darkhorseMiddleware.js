const DarkHorse = require('../services/darkhorse');

exports.darkhorseProtect = async (req, res, next) => {
  // Assume protect middleware has already run and attached req.user
  if (!req.user) {
    return next();
  }

  const enforcement = await DarkHorse.autoEnforce(req.user._id);

  if (!enforcement.allowed) {
    const ip = req.ip || req.connection.remoteAddress;
    await DarkHorse.logEvent(
      'enforcement',
      req.user._id,
      ip,
      `Blocked request to ${req.originalUrl}`,
      { reason: enforcement.message },
      4
    );

    return res.status(403).json({
      success: false,
      darkhorse: true,
      message: enforcement.message,
    });
  }

  // If flagged, we might append a warning header, but still let them through
  if (enforcement.warning) {
    res.setHeader('X-DarkHorse-Warning', 'true');
  }

  next();
};

exports.darkhorseLogActivity = async (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userId = req.user ? req.user._id : null;
  
  // Log all POST/PUT/DELETE actions that modify state
  if (req.method !== 'GET') {
    DarkHorse.logEvent(
      'info',
      userId,
      ip,
      `${req.method} ${req.originalUrl}`,
      { body: req.body },
      1
    );
  }

  next();
};
