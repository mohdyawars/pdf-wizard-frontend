const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg my-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-4">
        Welcome to **PDF Wizard**! This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or use our services.
      </p>

      {/* 1. Information Collection */}
      <h2 className="text-xl font-semibold text-gray-700 mt-6">1. Information We Collect</h2>
      <p className="text-gray-600">
        We may collect different types of personal information, including but not limited to:
      </p>
      <ul className="list-disc pl-6 text-gray-600 mt-2">
        <li>**Personal Data:** Name, email address, contact information.</li>
        <li>**Usage Data:** Pages visited, actions taken, time spent on the site.</li>
        <li>**Cookies & Tracking Data:** IP address, browser type, device information.</li>
      </ul>

      {/* 2. Use of Information */}
      <h2 className="text-xl font-semibold text-gray-700 mt-6">2. How We Use Your Information</h2>
      <p className="text-gray-600">
        The information we collect is used to:
      </p>
      <ul className="list-disc pl-6 text-gray-600 mt-2">
        <li>Improve and personalize your experience.</li>
        <li>Provide customer support.</li>
        <li>Analyze usage trends and enhance our services.</li>
        <li>Ensure security and prevent fraud.</li>
      </ul>

      {/* 3. Data Protection */}
      <h2 className="text-xl font-semibold text-gray-700 mt-6">3. Data Security</h2>
      <p className="text-gray-600">
        We take appropriate security measures to protect your data. However, no method of transmission over the internet is 100% secure.
      </p>

      {/* 4. Cookies & Tracking */}
      <h2 className="text-xl font-semibold text-gray-700 mt-6">4. Cookies and Tracking Technologies</h2>
      <p className="text-gray-600">
        We use cookies and tracking technologies to enhance your experience. You can manage your cookie preferences in your browser settings.
      </p>

      {/* 5. Third-Party Sharing */}
      <h2 className="text-xl font-semibold text-gray-700 mt-6">5. Third-Party Services</h2>
      <p className="text-gray-600">
        We do not sell or rent your personal data. However, we may share data with:
      </p>
      <ul className="list-disc pl-6 text-gray-600 mt-2">
        <li>**Service Providers:** To improve our platform.</li>
        <li>**Legal Authorities:** When required by law.</li>
      </ul>

      {/* 6. Your Rights */}
      <h2 className="text-xl font-semibold text-gray-700 mt-6">6. Your Rights</h2>
      <p className="text-gray-600">
        You have the right to:
      </p>
      <ul className="list-disc pl-6 text-gray-600 mt-2">
        <li>Access, modify, or delete your personal data.</li>
        <li>Opt-out of marketing emails.</li>
        <li>Request a copy of your data.</li>
      </ul>

      {/* 7. Changes to Policy */}
      <h2 className="text-xl font-semibold text-gray-700 mt-6">7. Changes to This Privacy Policy</h2>
      <p className="text-gray-600">
        We may update this Privacy Policy periodically. Please review this page for the latest version.
      </p>

      {/* 8. Contact */}
      <h2 className="text-xl font-semibold text-gray-700 mt-6">8. Contact Us</h2>
      <p className="text-gray-600">
        If you have any questions, contact us at <span className="font-semibold text-blue-500">support@pdfwizard.com</span>.
      </p>

      <p className="text-gray-500 text-sm mt-6">Last Updated: March 2025</p>
    </div>
  )
}

export default PrivacyPolicy;
