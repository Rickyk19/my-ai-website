import React, { useState } from 'react';
import { supabase } from '../utils/supabase';

interface FeedbackForm {
  Name: string;
  Email: string;
  Message: string;
}

const initialFormState: FeedbackForm = {
  Name: '',
  Email: '',
  Message: ''
};

const Feedback: React.FC = () => {
  const [formData, setFormData] = useState<FeedbackForm>(initialFormState);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const testConnection = async () => {
    try {
      console.log('Testing connection to Supabase...');
      
      // Try direct fetch to Supabase REST API
      const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/feedback?select=id&limit=1', {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Direct fetch successful:', data);
      
      setStatus({
        type: 'success',
        message: 'Direct API connection successful! You can now try submitting feedback.'
      });
    } catch (err: any) {
      console.error('Direct fetch failed:', err);
      setStatus({
        type: 'error',
        message: `Direct API test failed: ${err.message}`
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      console.log('Attempting to submit feedback via direct fetch:', formData);

      // Use direct fetch instead of Supabase client
      const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/feedback', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          Name: formData.Name,
          Email: formData.Email,
          Message: formData.Message,
          created_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Feedback submitted successfully via direct fetch:', data);
      
      setStatus({
        type: 'success',
        message: 'Thank you for your feedback! (Submitted via direct API)'
      });
      setFormData(initialFormState);
    } catch (error: any) {
      console.error('Error submitting feedback via direct fetch:', error);
      
      setStatus({
        type: 'error',
        message: `Failed to submit: ${error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Share Your Feedback</h1>

      {/* Test Connection Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          onClick={testConnection}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Connection
        </button>
        <small style={{ color: '#666' }}>
          Click this button first to test if the connection to Supabase is working
        </small>
      </div>

      {status.type && (
        <div
          style={{
            padding: '10px',
            marginBottom: '20px',
            backgroundColor: status.type === 'success' ? '#e6ffe6' : '#ffe6e6',
            border: `1px solid ${status.type === 'success' ? '#00cc00' : '#ff0000'}`,
            borderRadius: '4px'
          }}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label htmlFor="Name" style={{ display: 'block', marginBottom: '5px' }}>
            Name *
          </label>
          <input
            type="text"
            id="Name"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div>
          <label htmlFor="Email" style={{ display: 'block', marginBottom: '5px' }}>
            Email *
          </label>
          <input
            type="email"
            id="Email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div>
          <label htmlFor="Message" style={{ display: 'block', marginBottom: '5px' }}>
            Message *
          </label>
          <textarea
            id="Message"
            name="Message"
            value={formData.Message}
            onChange={handleChange}
            required
            rows={5}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default Feedback; 