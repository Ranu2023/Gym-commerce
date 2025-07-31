export default function Contact() {
  return (
    <div className="p-8 max-w-6xl mx-auto bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-5xl font-extrabold text-center text-blue-900 mb-6">Contact Us</h1>
      <p className="text-lg text-center text-gray-700 mb-8">
        Have questions about our products or need support? Reach out to us anytime. Our team is always happy to help.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Details */}
        <div>
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Get in Touch</h2>
          <ul className="text-gray-700 space-y-3">
            <li><strong>Email:</strong> support@muscledecode.com</li>
            <li><strong>Phone:</strong> +91-99999-99999</li>
            <li><strong>Customer Support:</strong> Mon - Sat (9AM - 6PM)</li>
            <li><strong>Address:</strong> 123 Muscle Street, Fit City, India - 400001</li>
          </ul>

          <h2 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">Follow Us</h2>
          <div className="flex space-x-4 text-blue-600">
            <a href="#" className="hover:underline">Instagram</a>
            <a href="#" className="hover:underline">Facebook</a>
            <a href="#" className="hover:underline">Twitter</a>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Send Us a Message</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              rows={5}
              placeholder="Your Message"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
