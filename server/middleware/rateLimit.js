import rateLimit from 'express-rate-limit';

export const signupRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many signup attempts. Please try again after an hour.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Max 10 login attempts per IP
    message: {
        success: false,
        message: "Too many login attempts. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
export const verifyOTPRateLimiter = rateLimit({
    windowMs: 1 * 60 * 60 * 1000, // 1 hour
    max: 10, // Max 10 attempts per IP
    message: {
        success: false,
        message: "Too many attempts. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
  

export const forgotPasswordLimiter = rateLimit({
    windowMs: 1 * 60 * 60 * 1000, // 1 hour
    max: 5,
    message: {
      success: false,
      message: 'Too many password reset requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minute
    max: 5,
    message: {
      success: false,
      message: 'Too many OTP resend requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,

});