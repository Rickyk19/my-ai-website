import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ahvxqultshujqtmbkjpy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ';

// CORS-friendly Supabase client configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  },
  global: {
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
      });
    }
  }
});

// Direct fetch helper for CORS-friendly requests
const corsRequest = async (endpoint: string, options: any = {}) => {
  const url = `${supabaseUrl}/rest/v1/${endpoint}`;
  
  return fetch(url, {
    method: 'GET',
    ...options,
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {})
    },
    mode: 'cors',
    credentials: 'omit'
  });
};

// Members Login Functions using direct fetch to avoid CORS issues

export const authenticateMember = async (email: string, password: string) => {
  try {
    console.log('🔐 Authenticating member:', email);
    
    // Check if user exists in users table
    const userResponse = await corsRequest(`users?select=*&email=eq.${encodeURIComponent(email)}&limit=1`);
    
    if (!userResponse.ok) {
      throw new Error(`User lookup failed: ${userResponse.status}`);
    }
    
    const users = await userResponse.json();
    
    if (users.length === 0) {
      throw new Error('User not found. Please check your email address.');
    }
    
    const user = users[0];
    console.log('✅ User found:', user.name);
    
    // Check if user has completed purchases
    const ordersResponse = await corsRequest(`orders?select=*&customer_email=eq.${encodeURIComponent(email)}&status=eq.completed`);
    
    if (!ordersResponse.ok) {
      throw new Error(`Orders lookup failed: ${ordersResponse.status}`);
    }
    
    const orders = await ordersResponse.json();
    
    if (orders.length === 0) {
      throw new Error('No completed purchases found for this email.');
    }
    
    console.log(`✅ Found ${orders.length} completed purchases`);
    
    // For demo purposes, we're not actually validating the password
    // In a real app, you'd hash and compare passwords
    
    return {
      success: true,
      user: user,
      purchases: orders
    };
    
  } catch (error: any) {
    console.error('❌ Authentication failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const getMemberPurchases = async (email: string) => {
  try {
    console.log('📚 Getting purchases for:', email);
    
    const ordersResponse = await corsRequest(`orders?select=*&customer_email=eq.${encodeURIComponent(email)}&status=eq.completed`);
    
    if (!ordersResponse.ok) {
      throw new Error(`Failed to fetch purchases: ${ordersResponse.status}`);
    }
    
    const orders = await ordersResponse.json();
    
    // Get course details for each purchase
    const coursesWithDetails = await Promise.all(
      orders.map(async (order: any) => {
        try {
          const courseResponse = await corsRequest(`courses?select=*&name=eq.${encodeURIComponent(order.course_name)}&limit=1`);
          
          if (courseResponse.ok) {
            const courses = await courseResponse.json();
            if (courses.length > 0) {
              return {
                ...order,
                course_details: courses[0]
              };
            }
          }
        } catch (error) {
          console.warn('Could not fetch course details for:', order.course_name);
        }
        
        return order;
      })
    );
    
    return {
      success: true,
      purchases: coursesWithDetails
    };
    
  } catch (error: any) {
    console.error('❌ Failed to get purchases:', error);
    return {
      success: false,
      error: error.message,
      purchases: []
    };
  }
};

export default supabase; 