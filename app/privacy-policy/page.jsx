import React from "react";

function page() {
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-12 text-center">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-lg">Your data safety matters at Muscle Decode</p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8 mt-10 bg-white shadow-xl rounded-2xl border border-gray-200">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to <strong>Muscle Decode</strong>! We are committed to protecting your
            personal information and ensuring a secure online shopping experience. This
            Privacy Policy explains how we collect, use, and protect your data when you use
            our website to explore and purchase fitness supplements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">2. Information We Collect</h2>
          <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
            <li>
              <strong>Personal Information:</strong> Name, email, address, contact number, and payment info.
            </li>
            {/* <li>
              <strong>Usage Data:</strong> Pages visited, search history, and clicks for personalization.
            </li> */}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">3. How We Use Your Information</h2>
          <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
            <li><strong>Order Processing:</strong> Managing purchases and delivery.</li>
            <li><strong>Personalization:</strong> Displaying relevant products and offers.</li>
            <li><strong>Communication:</strong> Order updates, promotional emails, and alerts.</li>
            <li><strong>Security:</strong> Safeguarding your information and preventing fraud.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">4. Sharing Your Information</h2>
          <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
            <li><strong>Third-Party Services:</strong> Delivery partners, payment processors.</li>
            <li><strong>Legal Compliance:</strong> When required by law or regulatory bodies.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">5. Data Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement encryption, secure servers, and monitoring to protect your data.
            However, no method of digital storage is completely secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">6. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed">
            You may view, update, or delete your data by contacting us or via your account
            settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">7. Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update our Privacy Policy and will notify you by updating the “Last
            Updated” date and posting it on our site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">8. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            For questions or concerns, reach out to us at{" "}
            <a
              href="mailto:support@muscledecode.com"
              className="text-blue-600 underline font-medium"
            >
              support@muscledecode.com
            </a>
            .
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">Account Deletion</h2>
          <p className="text-gray-700 leading-relaxed">
            If you would like to permanently delete your Muscle Decode account and associated
            data, please email us at{" "}
            <strong className="text-blue-700">support@muscledecode.com</strong> with your
            registered email and order information.
          </p>
        </section>
      </div>

      {/* Optional Footer */}
      {/* <MainFooter />
      <div className="h-10 my-5"></div>
      <Footer /> */}
    </>
  );
}

export default page;
