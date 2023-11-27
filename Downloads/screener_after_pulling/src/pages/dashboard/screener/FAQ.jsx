// FAQPage.js
import React, { useState, useEffect } from 'react';


const FAQPage = () => {
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    fetch('/faqData.json')
      .then((response) => response.json())
      .then((data) => setFaqData(data))
      .catch((error) => console.error('Error fetching FAQ data:', error));
  }, []);

  return (
    <div className=" flex items-center justify-center bg-gray-100">
      <div className="max-w-3xl bg-white p-8 rounded-md shadow-md w-full">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Frequently Asked Questions</h2>
        <div className="max-h-[400px] overflow-y-auto">
          {faqData.map((item) => (
            <details key={item.id} className="mb-6 border-b border-gray-300">
              <summary className="text-xl font-semibold cursor-pointer">{item.question}</summary>
              <div className="mt-4">
                <p className="text-gray-700">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
