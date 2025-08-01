// import Footer from "@/components/HomePageComponent/Footer";
// import MainFooter from "@/components/MainFooter";
// import Navbar from "@/components/Navbar";

function page() {
  return (
    <>
      {/* <Navbar /> */}
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-12 text-center">
        <h1 className="text-4xl font-bold">Refund & Cancellation Policy</h1>
        <p className="mt-2 text-lg">Customer Satisfaction Is Our Priority</p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8 mt-10 bg-white shadow-xl rounded-2xl border border-gray-200">
        {/* 1. Order Cancellation */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">1. Order Cancellation</h2>
          <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
            <li>
              <strong>Pre-Shipment Cancellation:</strong> If your order has not yet been
              shipped, you may request cancellation by contacting our support team as soon
              as possible.
            </li>
            <li>
              <strong>Post-Shipment Cancellation:</strong> Once your order has been shipped,
              it cannot be cancelled. You may, however, initiate a return after delivery
              (subject to our return policy).
            </li>
          </ul>
        </section>

        {/* 2. Refund Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">2. Refund Policy</h2>
          <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
            <li>
              <strong>Eligibility:</strong> Refunds are applicable only for orders that are
              cancelled before shipment or returned as per our return policy.
            </li>
            <li>
              <strong>Damaged or Wrong Products:</strong> If you receive a damaged or
              incorrect product, please notify us within 48 hours of delivery with photo
              evidence.
            </li>
            <li>
              <strong>Refund Process:</strong> Once approved, refunds will be processed to
              your original payment method within 5–7 business days.
            </li>
            <li>
              <strong>Ineligibility:</strong> Used products, opened supplement containers,
              and items returned after 7 days of delivery are not eligible for refunds.
            </li>
          </ul>
        </section>

        {/* 3. How to Request Cancellation/Refund */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            3. How to Request a Cancellation or Refund
          </h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            You can initiate a refund or cancellation request by contacting our support team
            at:
          </p>
          <ul className="ml-6 text-gray-700">
            <li>
              📧 Email:{" "}
              <a
                href="mailto: muscledecode7@gmail.com 
"
                className="text-blue-600 underline font-medium"
              >
                 muscledecode7@gmail.com 
              </a>
            </li>
            <li>📞 Phone: +91-8626055399 (Customer Support)</li>
          </ul>
        </section>

        {/* 4. Policy Changes */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            4. Changes to This Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Muscle Decode reserves the right to revise this Refund & Cancellation Policy at
            any time. Updates will be posted on this page, and your continued use of the
            site constitutes acceptance of the changes.
          </p>
        </section>
      </div>

      {/* <MainFooter />
      <div className="h-10 mt-10"></div>
      <Footer /> */}
    </>
  );
}

export default page;
