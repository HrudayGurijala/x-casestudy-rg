import { Arcjet, protect } from "@arcjet/next";

const arcjet = new Arcjet({
  rules: {
    posts: {
      rateLimit: {
        window: "1m",
        max: 5,
      },
      botProtection: {
        level: "low",
        excludeAuthenticated: true
      }
    }
  }
});

// Arcjet middleware for rate limiting, bot protection, and security

export const arcjetMiddleware = (req, res, next) => {
  // Skip Arcjet for file uploads and form data
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return next();
  }

  // Apply specific rules for posts
  if (req.path.startsWith('/api/posts')) {
    return protect(req, res, next, arcjet.rules.posts);
  }

  // Default protection
  return protect(req, res, next);
};