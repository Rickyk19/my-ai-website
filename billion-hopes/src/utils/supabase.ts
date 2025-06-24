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

// Quiz Management Functions

export default supabase; 
// Quiz Management Functions

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id?: number;
  course_id: number;
  class_number: number;
  title: string;
  description: string;
  time_limit: number;
  questions: QuizQuestion[];
  created_at?: string;
  updated_at?: string;
}

export const createQuiz = async (quiz: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log('📝 Creating quiz:', quiz.title);
    
    // First, check if a quiz already exists for this course/class combination
    console.log('🔍 Checking if quiz already exists for course', quiz.course_id, 'class', quiz.class_number);
    
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/class_quizzes?select=id&course_id=eq.${quiz.course_id}&class_number=eq.${quiz.class_number}&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (checkResponse.ok) {
      const existingQuizzes = await checkResponse.json();
      
      if (existingQuizzes.length > 0) {
        // Quiz exists, update it instead
        const existingQuizId = existingQuizzes[0].id;
        console.log('📝 Quiz already exists with ID', existingQuizId, '- updating instead of creating');
        
        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/class_quizzes?id=eq.${existingQuizId}`, {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Prefer': 'return=representation'
          },
          mode: 'cors',
          credentials: 'omit',
          body: JSON.stringify({
            title: quiz.title,
            description: quiz.description,
            time_limit: quiz.time_limit,
            questions: JSON.stringify(quiz.questions),
            updated_at: new Date().toISOString()
          })
        });
        
        if (!updateResponse.ok) {
          throw new Error(`Failed to update quiz: ${updateResponse.status}`);
        }
        
        const result = await updateResponse.json();
        console.log('✅ Quiz updated successfully');
        
        return {
          success: true,
          quiz: result[0],
          action: 'updated'
        };
      }
    }
    
    // No existing quiz found, create a new one
    console.log('📝 No existing quiz found, creating new quiz');
    
    const response = await fetch(`${supabaseUrl}/rest/v1/class_quizzes`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Prefer': 'return=representation'
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify({
        course_id: quiz.course_id,
        class_number: quiz.class_number,
        title: quiz.title,
        description: quiz.description,
        time_limit: quiz.time_limit,
        questions: JSON.stringify(quiz.questions),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create quiz: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Quiz created successfully');
    
    return {
      success: true,
      quiz: result[0],
      action: 'created'
    };
    
  } catch (error: any) {
    console.error('❌ Failed to create quiz:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const getQuiz = async (courseId: number, classNumber: number) => {
  try {
    console.log(`📚 Getting quiz for course ${courseId}, class ${classNumber}`);
    
    const response = await corsRequest(`class_quizzes?select=*&course_id=eq.${courseId}&class_number=eq.${classNumber}&limit=1`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch quiz: ${response.status}`);
    }
    
    const quizzes = await response.json();
    
    if (quizzes.length === 0) {
      return {
        success: false,
        error: 'No quiz found for this class'
      };
    }
    
    const quiz = quizzes[0];
    
    // Parse the questions JSON
    const parsedQuiz = {
      ...quiz,
      questions: typeof quiz.questions === 'string' ? JSON.parse(quiz.questions) : quiz.questions
    };
    
    return {
      success: true,
      quiz: parsedQuiz
    };
    
  } catch (error: any) {
    console.error('❌ Failed to get quiz:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const updateQuiz = async (quizId: number, updates: Partial<Quiz>) => {
  try {
    console.log('✏️ Updating quiz:', quizId);
    
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // Stringify questions if provided
    if (updates.questions) {
      updateData.questions = JSON.stringify(updates.questions);
    }
    
    const response = await fetch(`${supabaseUrl}/rest/v1/class_quizzes?id=eq.${quizId}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Prefer': 'return=representation'
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update quiz: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Quiz updated successfully');
    
    return {
      success: true,
      quiz: result[0]
    };
    
  } catch (error: any) {
    console.error('❌ Failed to update quiz:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const deleteQuiz = async (quizId: number) => {
  try {
    console.log('🗑️ Deleting quiz:', quizId);
    
    const response = await fetch(`${supabaseUrl}/rest/v1/class_quizzes?id=eq.${quizId}`, {
      method: 'DELETE',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete quiz: ${response.status}`);
    }
    
    console.log('✅ Quiz deleted successfully');
    
    return {
      success: true
    };
    
  } catch (error: any) {
    console.error('❌ Failed to delete quiz:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const getAllQuizzes = async () => {
  try {
    console.log('📚 Getting all quizzes');
    
    const response = await corsRequest(`class_quizzes?select=*&order=course_id,class_number`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch quizzes: ${response.status}`);
    }
    
    const quizzes = await response.json();
    
    // Parse questions for each quiz
    const parsedQuizzes = quizzes.map((quiz: any) => ({
      ...quiz,
      questions: typeof quiz.questions === 'string' ? JSON.parse(quiz.questions) : quiz.questions
    }));
    
    return {
      success: true,
      quizzes: parsedQuizzes
    };
    
  } catch (error: any) {
    console.error('❌ Failed to get quizzes:', error);
    return {
      success: false,
      error: error.message,
      quizzes: []
    };
  }
};

