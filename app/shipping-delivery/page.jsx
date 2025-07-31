function Page() {
  return (
    <>
      {/* <Navbar /> */}
      <div className="max-w-4xl mx-auto px-6 py-10 bg-white shadow-md rounded-md">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 border-b pb-2">
          Shipping and Delivery Policy
        </h1>

        <section className="mb-8 text-gray-700 leading-relaxed">
          <p className="mb-4">
            Thank you for choosing our platform. We strive to ensure your products are delivered promptly and securely.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">Third-Party Delivery Partner</h2>
          <p className="mb-4">
            We partner with trusted third-party logistics providers such as <strong>Shiprocket</strong> to handle all shipping and delivery services.
            Once your order is confirmed, it will be processed and dispatched through our delivery partners.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">Shipping Timelines</h2>
          <p className="mb-4">
            - Orders are usually dispatched within 1–2 business days.<br />
            - Estimated delivery time ranges between 3–7 business days depending on your location.<br />
            - Tracking details will be shared via email/SMS once the order is shipped.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">Delivery Charges</h2>
          <p className="mb-4">
            - Shipping charges may vary based on the product weight, location, and promotional offers.<br />
            - Final shipping cost will be displayed at checkout before placing the order.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">Delivery Coverage</h2>
          <p className="mb-4">
            - We deliver across India through our logistics partners.<br />
            - If your location is not serviceable, our support team will inform you during order processing.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">Need Assistance?</h2>
          <p>
            For any shipping-related queries, please contact our customer support at <a href="mailto:support@example.com" className="text-blue-600 hover:underline">support@example.com</a>.
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
