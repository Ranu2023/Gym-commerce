function Page() {
  return (
    <>
      {/* <Navbar /> */}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 text-white py-12 text-center">
        <h1 className="text-4xl font-bold">Terms and Conditions</h1>
        <p className="mt-2 text-lg">Please read our policies before shopping with us</p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8 mt-10 bg-white shadow-xl rounded-2xl border border-gray-200">
        {/* 1. Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-700">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to the Anurag chaturvedi Muscle Decode website. By using this platform to purchase fitness or health-related products, you agree to the following Terms and Conditions. If you do not accept these terms, please refrain from using our services.
          </p>
        </section>

        {/* 2. Use of Website */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-700">2. Use of the Website</h2>
          <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
            <li>You must be at least 18 years old to place an order.</li>
            <li>You agree to provide accurate, up-to-date information during checkout.</li>
            <li>All personal and payment details are processed securely and confidentially.</li>
          </ul>
        </section>

        {/* 3. Orders and Payments */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-700">3. Orders and Payments</h2>
          <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
            <li>All orders are subject to availability and confirmation of payment.</li>
            <li>Prices are listed in INR and are inclusive of applicable taxes unless otherwise stated.</li>
            <li>Payments are processed via secure third-party payment gateways.</li>
          </ul>
        </section>

        {/* 4. Shipping and Delivery */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-700">4. Shipping and Delivery</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            We deliver across India using reliable third-party logistics partners such as <strong>Shiprocket</strong>.
          </p>
          <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
            <li>Orders are typically shipped within 1–2 business days after confirmation.</li>
            <li>Delivery time is estimated between 3–7 business days based on your location.</li>
            <li>Tracking information will be shared via email or SMS.</li>
          </ul>
        </section>

        {/* 5. Returns and Refunds */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-700">5. Returns and Refunds</h2>
          <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
            <li>We do not accept returns on opened or used supplements due to health & safety reasons.</li>
            <li>Returns are only accepted for damaged, defective, or incorrectly shipped products.</li>
            <li>Refunds will be processed to the original payment method within 7 business days of return approval.</li>
          </ul>
        </section>

        {/* 6. Health Disclaimer */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-700">6. Health Disclaimer</h2>
          <p className="text-gray-700 leading-relaxed">
            All supplements sold on this site are intended for adults and should be used under guidance from a certified healthcare provider or fitness professional. Anurag chaturvedi is not responsible for any adverse reactions or misuse of products.
          </p>
        </section>

        {/* 7. Intellectual Property */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-700">7. Intellectual Property</h2>
          <p className="text-gray-700 leading-relaxed">
            All branding, content, product images, and trademarks belong to Anurag chaturvedi and cannot be reused without permission.
          </p>
        </section>

        {/* 8. Legal Jurisdiction */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-700">8. Governing Law</h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms are governed by the laws of India. All disputes shall be subject to the exclusive jurisdiction of courts located in India.
          </p>
        </section>

        {/* 9. Changes to Terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-700">9. Changes to These Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to modify or update these Terms and Conditions at any time without prior notice.
          </p>
        </section>

        {/* 10. Contact Us */}
        <section className="mb-2">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-700">10. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            For any questions regarding these terms, please contact us at{" "}
            <a
              href="mailto:theanuragchaturvedi@gmail.com"
              className="text-indigo-600 underline"
            >
              theanuragchaturvedi@gmail.com
            </a>.
          </p>
        </section>
      </div>

      {/* <MainFooter />
      <div className="h-10 mt-10"></div>
      <Footer /> */}
    </>
  );
}

export default Page;
