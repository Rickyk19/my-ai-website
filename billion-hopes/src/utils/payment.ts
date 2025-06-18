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

// Mock function to save purchase in localStorage
const savePurchase = (courseId: number) => {
  const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
  purchases.push({
    courseId,
    purchaseDate: new Date().toISOString(),
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
    handler: function (response: any) {
      // Handle successful payment
      savePurchase(courseId);
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