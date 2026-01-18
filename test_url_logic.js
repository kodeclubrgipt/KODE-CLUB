function getGoogleAuthUrl(envUrl) {
  let apiUrl = envUrl || 'http://localhost:5000/api';
  
  // Remove trailing slash if present
  apiUrl = apiUrl.replace(/\/$/, '');
  
  // Remove /api suffix if present
  let baseUrl = apiUrl.replace(/\/api$/, '');
  
  return `${baseUrl}/api/auth/google`;
}

const testCases = [
  undefined,
  'http://localhost:5000/api',
  'http://localhost:5000/api/',
  'http://localhost:5000',
  'http://localhost:5000/',
  'https://backend.com/api',
  'https://backend.com/api/',
  'https://backend.com',
  'http://localhost:5000/api/api'
];

testCases.forEach(url => {
  console.log(`Input: "${url}" -> Output: "${getGoogleAuthUrl(url)}"`);
});
