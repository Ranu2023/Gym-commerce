"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "What makes your supplements different from others?",
    answer:
      "Our supplements are scientifically formulated with premium ingredients, rigorously tested for purity and potency, and manufactured in certified facilities. We work directly with manufacturers to ensure quality while keeping prices affordable."
  },
  {
    question: "How do I know which supplement is right for me?",
    answer:
      "Our expert team of certified nutritionists and trainers can help you choose the right supplements based on your fitness goals. You can contact us for personalized recommendations or consult with our support team."
  },
  {
    question: "Are your products safe and tested?",
    answer:
      "Yes, all our products undergo rigorous third-party testing for purity, potency, and safety. We follow strict quality control measures and comply with all regulatory standards to ensure you receive safe, effective supplements."
  },
  {
    question: "How should I take the supplements?",
    answer:
      "Each product comes with detailed usage instructions on the label. Generally, protein powders are best taken post-workout, pre-workouts 30 minutes before training, and creatine daily at any time. Always follow the recommended dosage."
  },
  {
    question: "Can I take multiple supplements together?",
    answer:
      "Most of our supplements can be safely combined. However, we recommend consulting with our nutritionists or your healthcare provider before combining multiple products, especially if you have any health conditions."
  },
  {
    question: "Do you offer samples or trial sizes?",
    answer:
      "We offer sample packs for select products. Check our product pages for sample availability, or contact our customer service team to inquire about trial sizes for specific supplements you're interested in."
  },
  {
    question: "What if I'm not satisfied with my purchase?",
    answer: (
      <>
        We offer a 30-day money-back guarantee on all products. If you're not completely satisfied, you can return the product for a full refund. See our{" "}
        <Link href="/returns" className="text-blue-600 underline">
          Returns Policy
        </Link>{" "}
        for more details.
      </>
    )
  },
  {
    question: "How long does shipping take?",
    answer: (
      <>
        Standard shipping takes 3-5 business days. We offer free shipping on orders over ₹50. Express shipping options are available for faster delivery. Check our{" "}
        <Link href="/shipping" className="text-blue-600 underline">
          Shipping Policy
        </Link>{" "}
        for detailed information.
      </>
    )
  }
];

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="min-h-screen bg-white py-20 px-4 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-orange-500">Questions</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
  Find answers to common questions about our products and services.
</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl border transition-all duration-300 shadow-sm ${
                activeIndex === index ? "border-orange-500 bg-orange-50" : "border-gray-300 bg-white"
              }`}
            >
              <div
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center cursor-pointer p-4 hover:bg-orange-100"
              >
                <h3 className="text-lg font-medium">{faq.question}</h3>
                <FaChevronDown
                  className={`transition-transform duration-300 text-orange-500 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                />
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="p-4 text-gray-700 leading-relaxed">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQPage;
