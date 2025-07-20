// import Footer from "@/components/HomePageComponent/Footer";
// import MainFooter from "@/components/MainFooter";
// import Navbar from "@/components/Navbar";";

function page() {
  return (
    <>
      {/* <Navbar /> */}
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to the RJ Manish website! By accessing or using our website,
            you agree to comply with and be bound by the following terms and
            conditions. Please read them carefully. If you do not agree to these
            terms, please do not use the app.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. Use of the Website</h2>
          <ul className="list-disc ml-6">
            <li>
              <strong>Account Registration:</strong> To access certain features,
              you may be required to create an account. You agree to provide
              accurate, current, and complete information during the
              registration process and to update such information as necessary.
            </li>
            {/* <li>
              <strong>User Content:</strong> You are responsible for any content
              you submit or upload to the app, including but not limited to
              photos, videos, and text. You grant Star Kid a non-exclusive,
              royalty-free, perpetual license to use, reproduce, modify, and
              display such content.
            </li> */}
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            3. Subscription and Payment
          </h2>
          <ul className="list-disc ml-6">
            <li>
              <strong>Subscription Plans:</strong> Our Website offers various
              subscription plans for various courses. By subscribing, you agree
              to pay the applicable subscription fees.
            </li>
            <li>
              <strong>Payment Terms:</strong> Subscription fees are taken once
              when you buy the particular course. All payments are
              non-refundable.
            </li>
            {/* <li>
              <strong>Automatic Renewal:</strong> Your subscription will
              automatically renew at the end of each billing cycle unless you
              cancel it before the renewal date. You may cancel your
              subscription at any time through your account settings.
            </li> */}
            <li>
              <strong>Cancellation:</strong> Once subscribed you cannot cancel
              your subscription.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">4. User Conduct</h2>
          <ul className="list-disc ml-6">
            <li>
              <strong>Prohibited Activities:</strong> You agree not to engage in
              any activities that violate these terms or applicable laws,
              including but not limited to the following:
            </li>
            <ul className="list-disc ml-10">
              <li>
                Hacking, cracking, or circumventing any security features of the
                app.
              </li>
              <li>Harassing, threatening, or defaming other users.</li>
              {/* <li>
                Uploading content that is illegal, obscene, or infringing on
                intellectual property rights.
              </li> */}
            </ul>
            <li>
              <strong>Termination:</strong> We reserve the right to terminate or
              suspend your account if you violate these terms or engage in any
              prohibited activities.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            5. Intellectual Property
          </h2>
          <p>
            <strong>Ownership:</strong> RJ Manish and its content, features, and
            functionality are the exclusive property of RJ Manish or its
            licensors. You agree not to reproduce, duplicate, copy, sell, or
            exploit any portion of the app without express written permission
            from RJ Manish.
          </p>
        </section>

        {/* <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            6. Limitation of Liability
          </h2>
          <ul className="list-disc ml-6">
            <li>
              <strong>No Warranties:</strong> The app is provided on an "as is"
              and "as available" basis. Star Kid makes no warranties, whether
              express or implied, regarding the app's functionality,
              availability, or accuracy.
            </li>
            <li>
              <strong>Limitation of Liability:</strong> In no event shall Star
              Kid be liable for any indirect, incidental, special,
              consequential, or punitive damages arising out of or related to
              your use of the app, even if we have been advised of the
              possibility of such damages.
            </li>
          </ul>
        </section> */}

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">6. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with
            the laws of India, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            7. Changes to These Terms
          </h2>
          <p>
            We may update these terms from time to time. When we do, we will
            revise the "Last Updated" date at the bottom of this page. Your
            continued use of the app after any changes indicates your acceptance
            of the new terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about these terms, please contact us at{" "}
            <a
              href="mailto:theanuragchaturvedi@gmail.com"
              className="text-blue-500 underline"
            >
              theanuragchaturvedi@gmail.com
            </a>
            .
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
