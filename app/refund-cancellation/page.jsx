// import Footer from "@/components/HomePageComponent/Footer";
// import MainFooter from "@/components/MainFooter";
// import Navbar from "@/components/Navbar";

function page() {
  return (
    <>
      {/* <Navbar /> */}
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">
          Refund and Cancellation Policy
        </h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            1. Subscription Cancellation
          </h2>
          <ul className="list-disc ml-6">
            <li>
              <strong>Course Subscription Cancellation:</strong> We doesnt
              provide the features to cancel the course subscription once buyed.
            </li>
            <li>
              <strong>Immediate Cancellation:</strong> If you Immediatily want
              to cancel the subscription after payment you can contact us on
              support number and email for that.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. Refund Policy</h2>
          <ul className="list-disc ml-6">
            <li>
              <strong>Eligibility for Refund:</strong> Refunds are generally not
              provided for subscription fees. However, if you believe there has
              been an error in billing or if you experience technical issues
              that prevent you from using the app's features, please contact our
              support team at{" "}
              <a
                href="mailto:theanuragchaturvedi@gmail.com"
                className="text-blue-500 underline"
              >
                theanuragchaturvedi@gmail.com
              </a>{" "}
              within 7 days of the charge.
            </li>
            {/* <li>
              <strong>Pro-Rated Refunds:</strong> In rare cases where a refund
              is approved, Star Kid may issue a pro-rated refund based on the
              unused portion of your subscription. This will be determined at
              our sole discretion.
            </li> */}
            <li>
              <strong>Ineligibility for Refunds:</strong> No refunds will be
              issued for subscriptions that have been used or partially used.
            </li>
          </ul>
        </section>

        {/* <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            3. How to Cancel Your Subscription
          </h2>
          <ul className="list-disc ml-6">
            <li>
              <strong>Account Settings:</strong> You can cancel your
              subscription by logging into your Star Kid account and navigating
              to the subscription management section under account settings.
            </li>
            <li>
              <strong>Contacting Support:</strong> If you encounter any issues
              while canceling your subscription, please contact our customer
              support at{" "}
              <a
                href="mailto:contact@eduexplore.in"
                className="text-blue-500 underline"
              >
                contact@eduexplore.in
              </a>{" "}
              for assistance.
            </li>
          </ul>
        </section> */}

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            4. Changes to This Policy
          </h2>
          <p>
            We reserves the right to modify this refund and cancellation policy
            at any time. Any changes will be posted on this page, and your
            continued use of the app after such changes indicates your
            acceptance of the updated policy.
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
