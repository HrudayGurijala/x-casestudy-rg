import { aj } from "../config/arcjet.js";

// Arcjet middleware for rate limiting, bot protection, and security

export const arcjetMiddleware = (req, res, next) => {
  // Skip Arcjet for essential endpoints
  const skipPaths = [
    '/api/users/sync',
    '/api/posts',         // Allow post creation
    '/api/posts/'         // Allow other post operations
  ];

  if (skipPaths.some(path => req.path.startsWith(path))) {
    return next();
  }

  // Your existing Arcjet middleware code
  aj.protect(req, {
    requested: 1, // each request consumes 1 token
  }).then(decision => {
    // handle denied requests
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please try again later.",
        });
      } 
      else if (decision.reason.isBot()) {
        return res.status(403).json({
          error: "Bot access denied",
          message: "Automated requests are not allowed.",
        });
      } 
      else {
        return res.status(403).json({
          error: "Forbidden",
          message: "Access denied by security policy.",
        });
      }
    }

    // check for spoofed bots
    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      });
    }

    next();
  }).catch(error => {
    console.error("Arcjet middleware error:", error);
    // allow request to continue if Arcjet fails
    next();
  });
};