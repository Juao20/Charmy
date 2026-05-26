export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: May 24, 2026</p>

      <div className="flex flex-col gap-6 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, including:</p>
          <ul className="list-disc ml-5 mt-2 flex flex-col gap-1">
            <li>Account information (email address, username)</li>
            <li>Relationship data you enter (contact names, goals, conversation context)</li>
            <li>Payment information (processed securely by Paddle — we never store card details)</li>
            <li>Usage data (features used, sessions created)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc ml-5 mt-2 flex flex-col gap-1">
            <li>Provide and improve the Charmy service</li>
            <li>Generate personalized AI suggestions based on your relationship context</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send important service notifications</li>
            <li>Respond to your support requests</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. AI and Conversation Data</h2>
          <p>The conversation text you submit to Charmy is sent to our AI provider (Groq) to generate suggestions. This data is used solely for generating your suggestions and is not used to train AI models or shared with third parties for marketing purposes.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">4. Data Sharing</h2>
          <p>We do not sell your personal data. We share data only with trusted service providers necessary to operate the App:</p>
          <ul className="list-disc ml-5 mt-2 flex flex-col gap-1">
            <li>Groq — AI processing</li>
            <li>Paddle — payment processing</li>
            <li>Railway — server hosting</li>
            <li>Neon — database hosting</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">5. Data Security</h2>
          <p>We implement industry-standard security measures including HTTPS encryption, secure password hashing, and JWT authentication to protect your data. However, no method of transmission over the internet is 100% secure.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">6. Data Retention</h2>
          <p>We retain your data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us at support@charmy.app. We will process deletion requests within 30 days.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc ml-5 mt-2 flex flex-col gap-1">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">8. Cookies</h2>
          <p>Charmy uses local storage to maintain your session and preferences. We do not use third-party tracking cookies or advertising cookies.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">9. Children's Privacy</h2>
          <p>Charmy is not intended for users under the age of 18. We do not knowingly collect personal information from minors.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">10. Contact</h2>
          <p>For privacy-related requests, contact us at <a href="mailto:support@charmy.app" className="text-charmy-500">support@charmy.app</a></p>
        </section>

      </div>
    </div>
  )
}