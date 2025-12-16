const BACKEND_URL = 'http://167.99.48.234:8081';

module.exports = async (req, res) => {
  const { method, headers, body } = req;
  
  // Handle preflight FIRST before anything else
  if (method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }
  
  // Get the path from query parameter or URL
  const url = new URL(req.url, `https://${headers.host}`);
  const pathParam = url.searchParams.get('path');
  const targetPath = pathParam || req.url.replace(/^\/api\/proxy\/?/, '/api/') || '/';
  const targetUrl = `${BACKEND_URL}${targetPath}`;
  
  console.log(`Proxying ${method} ${targetUrl}`);
  console.log('Request body:', JSON.stringify(body));
  
  // Build clean headers for the backend
  const forwardHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Forward Authorization header if present
  if (headers.authorization) {
    forwardHeaders['Authorization'] = headers.authorization;
  }

  try {
    // Prepare body - Vercel already parses JSON body, so we need to re-stringify
    let requestBody = undefined;
    if (method !== 'GET' && method !== 'HEAD' && body) {
      requestBody = typeof body === 'string' ? body : JSON.stringify(body);
    }
    
    console.log('Sending to backend:', { method, url: targetUrl, headers: forwardHeaders, body: requestBody });
    
    const response = await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body: requestBody,
    });

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Forward response
    const responseData = await response.text();
    
    console.log('Backend response status:', response.status);
    console.log('Backend response body:', responseData);
    
    res.status(response.status);
    
    // Forward content-type header
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    return res.send(responseData);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Proxy error', message: error.message, stack: error.stack });
  }
};
