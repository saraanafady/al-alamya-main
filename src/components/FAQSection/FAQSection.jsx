import { useState } from 'react';
import './FAQSection.css';

const faqs = [
  {
    question: 'What payment methods are accepted at your store?',
    answer: 'We accept credit cards, PayPal, and other secure payment methods.'
  },
  {
    question: 'How long does it take to process and ship my order?',
    answer: 'Orders are processed within 1-2 business days and shipped promptly.'
  },
  {
    question: "Can I return or exchange an item I've purchased from your online store?",
    answer: 'Yes, we offer a 30-day return and exchange policy for all products.'
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = idx => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="faq-section">
      <h2>FAQ</h2>
      <div className="faq-list">
        {faqs.map((faq, idx) => (
          <div className="faq-item" key={idx}>
            <button className="faq-question" onClick={() => toggle(idx)}>
              {faq.question}
              <span>{openIndex === idx ? '-' : '+'}</span>
            </button>
            {openIndex === idx && <div className="faq-answer">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection; 