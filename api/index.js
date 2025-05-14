
export default function handler(req, res) {
  // Set proper headers to avoid MIME type issues
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // This is a catch-all function that will be handled by our SPA
  res.status(200).json({ message: 'API route functioning' });
}
