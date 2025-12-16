const BACKEND_URL = 'http://167.99.48.234:8081';

module.exports = async (req, res) => {
  const { method, headers, body } = req;
  
  // Get the path from query parameter or URL
  const url = new URL(req.url, `https://${headers.host}`);
  const pathParam = url.searchParams.get('path');
  const targetPath = pathParam || req.url.replace(/^\/api\/proxy\/?/, '/api/') || '/';
  const targetUrl = `${BACKEND_URL}${targetPath}`;
  
  console.log(`Proxying ${method} ${targetUrl}`);
  
  // Remove headers that shouldn't be forwarded
  const forwardHeaders = { ...headers };
  delete forwardHeaders.host;
  delete forwardHeaders['content-length'];
  
  // Add content-type if body exists
  if (body && !forwardHeaders['content-type']) {
    forwardHeaders['content-type'] = 'application/json';
  }

  try {
    const response = await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(body) : undefined,
    });

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Forward response
    const responseData = await response.text();
    res.status(response.status);
    
    // Forward content-type header
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    return res.send(responseData);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Proxy error', message: error.message });
  }
};
