import { Request } from 'express';

export const detectBot = async (req: Request): Promise<boolean> => {
  // Get user agent
  const userAgent = req.headers['user-agent']?.toLowerCase() || '';
  
  // List of known bot user agents
  const botUserAgents = [
    'bot',
    'crawler',
    'spider',
    'slurp',
    'baidu',
    'yandex',
    'bingbot',
    'googlebot',
    'duckduckbot',
    'curl',
    'wget',
    'python',
    'node',
    'axios',
    'postman',
    'selenium',
    'puppeteer',
    'playwright',
    'phantomjs',
    'headless'
  ];

  // Check if user agent contains any bot indicators
  const isBotUserAgent = botUserAgents.some(bot => userAgent.includes(bot));

  // Check for missing or suspicious headers
  const hasAcceptHeader = !!req.headers.accept;
  const hasAcceptLanguageHeader = !!req.headers['accept-language'];
  const hasAcceptEncodingHeader = !!req.headers['accept-encoding'];
  
  // Check for suspicious IP patterns
  const ip = req.ip || req.connection.remoteAddress;
  const isLocalhost = ip === '127.0.0.1' || ip === '::1';
  
  // Check for rapid requests (implement rate limiting separately)
  const requestTimestamp = Date.now();
  const lastRequestTimestamp = (req as any).lastRequestTimestamp || 0;
  const timeBetweenRequests = requestTimestamp - lastRequestTimestamp;
  
  // Store timestamp for next request
  (req as any).lastRequestTimestamp = requestTimestamp;

  // Bot detection criteria
  const isBot = 
    isBotUserAgent || // Known bot user agent
    (!hasAcceptHeader && !hasAcceptLanguageHeader && !hasAcceptEncodingHeader) || // Missing common headers
    (isLocalhost && timeBetweenRequests < 100); // Rapid requests from localhost

  return isBot;
}; 