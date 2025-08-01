export default function Support() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white text-gray-800 py-16 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-center text-blue-800">
          Customer Support
        </h1>
        <p className="text-lg mb-8 text-center text-gray-700">
          Our support team is here to help! Whether it’s an order issue or
          supplement consultation, we’re just a message away.
        </p>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">📞 Contact Us</h2>
            <p className="text-gray-700">
              Reach us via phone for quick help:
              <br />
              <strong>+91 86260-55399</strong>
              <br />
              Mon - Sat | 11 AM - 6 PM
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">💬 Live Chat</h2>
            <p className="text-gray-700">
              Use our live chat for instant replies during working hours. Look
              for the chat icon at the bottom-right of your screen.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">📧 Email Support</h2>
            <p className="text-gray-700">
              For detailed queries or issues, email us at:
              <br />
              <strong>muscledecode7@gmail.com</strong>
              <br />
              We usually respond within 24 hours.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">❓ FAQs</h2>
            <p className="text-gray-700">
              Check out our <a href="/faq" className="text-blue-600 underline">FAQ section</a> to find answers to
              commonly asked questions.
            </p>
          </div>
        </div>

        {/* Feedback */}
        <div className="mt-12 bg-blue-100 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold mb-2 text-blue-900">Feedback</h3>
          <p className="text-gray-700 mb-4">
            We value your opinion. Share your experience or suggestions to help us improve!
          </p>
          <button className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
            Give Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
