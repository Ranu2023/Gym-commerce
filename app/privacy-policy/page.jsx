// import Footer from "@/components/HomePageComponent/Footer";
// import MainFooter from "@/components/MainFooter";
// import Navbar from "@/components/Navbar";
import React from "react";
function page() {
  return (
    <>
      {/* //<Navbar /> */}

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to the RJ Manish website! We are committed to protecting
            your personal data and privacy. This Privacy Policy explains how we
            collect, use, and safeguard your information when you use our app.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            2. Information We Collect
          </h2>
          <ul className="list-disc ml-6">
            <li>
              <strong>Personal Information:</strong> When you register on our
              webiste, we may collect personal information such as your name,
              email address, phone number, and other contact details.
            </li>
            {/* <li>
              <strong>Usage Data:</strong> We collect information about your
              interactions with the app, including pages visited, features used,
              and the time spent on the app.
            </li>
            <li>
              <strong>Content Submissions:</strong> If you submit content (e.g.,
              photos, videos) to participate in competitions, we collect and
              store that content.
            </li> */}
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc ml-6">
            <li>
              <strong>Personalization:</strong> To personalize your experience
              and provide content tailored to your interests.
            </li>
            <li>
              <strong>Service Improvement:</strong> To improve our website
              functionality, usability, and user experience.
            </li>
            <li>
              <strong>Communication:</strong> To send you notifications,
              updates, and information about your account and our services.
            </li>
            {/* <li>
              <strong>Competition Management:</strong> To manage and evaluate
              entries in competitions and to provide feedback.
            </li> */}
            <li>
              <strong>Security:</strong> To ensure the security and integrity of
              our webiste and user data.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            4. Sharing Your Information
          </h2>
          <ul className="list-disc ml-6">
            <li>
              <strong>Third-Party Services:</strong> We may share your
              information with third-party service providers who assist us in
              operating our website, conducting our business, or serving our
              users.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your
              information if required to do so by law or in response to valid
              requests by public authorities.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p>
            We take reasonable measures to protect your personal information
            from unauthorized access, alteration, disclosure, or destruction.
            However, no method of transmission over the internet or method of
            electronic storage is 100% secure.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <p>
            <strong>Access and Correction:</strong> You have the right to
            access, correct, or delete your personal information stored in our
            webiste.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            7. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy,
            please contact us at{" "}
            <a
              href="mailto:theanuragchaturvedi@gmail.com"
              className="text-blue-500 underline"
            >
              support@demo.com
            </a>
            .
          </p>
        </section>

        <h1 className="text-3xl font-bold mb-6">Account Deletion</h1>
        <p>
          If you wish to delete your account, you can email us at
          theanuragchaturvedi@gmail.com and mention your registration details.
        </p>
      </div>

      {/* <MainFooter />
      <div className="h-10 my-5"></div>
      <Footer /> */}
    </>
  );
}

export default page;
