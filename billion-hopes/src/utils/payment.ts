declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentOptions {
  courseId: number;
  amount: number;
  courseName: string;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Save purchase to database and localStorage
const savePurchase = async (courseId: number, amount: number, courseName: string, paymentId: string) => {
  try {
    // Save to Supabase orders table
    const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/orders', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        course_id: courseId,
        course_name: courseName,
        amount: amount,
        payment_id: paymentId,
        status: 'completed',
        created_at: new Date().toISOString()
      })
    });

    if (!response.ok) {
      console.error('Failed to save order to database');
    }
  } catch (error) {
    console.error('Error saving order:', error);
  }

  // Also save to localStorage as backup
  const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
  purchases.push({
    courseId,
    purchaseDate: new Date().toISOString(),
    amount,
    paymentId
  });
  localStorage.setItem('purchases', JSON.stringify(purchases));
};

// Check if a course is purchased
export const isPurchased = (courseId: number): boolean => {
  const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
  return purchases.some((p: { courseId: number }) => p.courseId === courseId);
};

export const initializePayment = async ({ courseId, amount, courseName }: PaymentOptions): Promise<void> => {
  const isScriptLoaded = await loadRazorpayScript();
  
  if (!isScriptLoaded) {
    alert('Failed to load payment gateway. Please try again later.');
    return;
  }

  const options = {
    key: 'rzp_test_YOUR_KEY_HERE', // Replace with your Razorpay key
    amount: amount * 100, // Amount in paise
    currency: 'INR',
    name: 'Billion Hopes',
    description: `Purchase ${courseName}`,
    handler: async function (response: any) {
      // Handle successful payment
      await savePurchase(courseId, amount, courseName, response.razorpay_payment_id);
      alert('Payment successful! You now have access to the course.');
      window.location.href = `/course/${courseId}`;
    },
    prefill: {
      name: 'Student Name',
      email: 'student@example.com',
    },
    theme: {
      color: '#2563eb', // blue-600
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
}; 