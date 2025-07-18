import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/feedback')
      .then(res => setFeedbacks(res.data))
      .catch(err => console.error("Error fetching feedbacks:", err));
  }, []);

  return (
    <section className="p-10 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-violet-700">User Feedback</h2>
      <div className="max-w-4xl mx-auto space-y-4">
        {feedbacks.length === 0 ? (
          <p className="text-center text-gray-500">No feedback submitted yet.</p>
        ) : (
          feedbacks.map(feedback => (
            <div key={feedback.id} className="p-4 bg-white shadow-md rounded-md border border-gray-200">
              <h4 className="font-semibold text-lg">{feedback.name}</h4>
              <p className="text-sm text-gray-500 mb-2">{feedback.email}</p>
              <p className="text-gray-700">{feedback.message}</p>
              <p className="text-right text-xs text-gray-400 mt-2">{feedback.created_at}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
