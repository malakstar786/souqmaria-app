/**
 * Utility for detecting device IP address
 * Uses multiple fallback services for reliability
 */

/**
 * Get the device's public IP address
 * Uses multiple fallback services for reliability
 */
export const getDeviceIP = async (): Promise<string> => {
  const fallbackIP = '127.0.0.1'; // Fallback if all services fail
  
  // List of reliable IP detection services
  const ipServices = [
    'https://api.ipify.org?format=json',
    'https://ipapi.co/json',
    'https://httpbin.org/ip',
  ];
  
  for (const service of ipServices) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(service, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        
        // Extract IP from different response formats
        let ip = null;
        if (data.ip) {
          ip = data.ip;
        } else if (data.origin) {
          ip = data.origin; // httpbin format
        } else if (typeof data === 'string') {
          ip = data;
        }
        
        // Validate IP format (basic IPv4 validation)
        if (ip && /^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
          console.log(`✅ Got IP address from ${service}:`, ip);
          return ip;
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`❌ Failed to get IP from ${service}:`, errorMessage);
      continue; // Try next service
    }
  }
  
  console.log('⚠️ All IP services failed, using fallback IP:', fallbackIP);
  return fallbackIP;
}; 