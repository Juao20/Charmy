export default function RefundPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Refund Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: May 24, 2026</p>

      <div className="flex flex-col gap-6 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Subscriptions</h2>
          <p>We offer a <strong className="text-gray-900 dark:text-white">7-day money-back guarantee</strong> on all new subscriptions (monthly and yearly). If you are not satisfied with Charmy Premium within the first 7 days of your subscription, contact us for a full refund — no questions asked.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. How to Request a Refund</h2>
          <p>To request a refund, send an email to <a href="mailto:support@charmy.app" className="text-charmy-500">support@charmy.app</a> with:</p>
          <ul className="list-disc ml-5 mt-2 flex flex-col gap-1">
            <li>Your account email address</li>
            <li>Your order number (found in your Paddle receipt)</li>
            <li>The reason for your refund request (optional but appreciated)</li>
          </ul>
          <p className="mt-2">We will process your refund within 5-10 business days.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. Situations Pack (One-time Purchase)</h2>
          <p>One-time credit pack purchases are non-refundable once credits have been used. If you have not used any credits, you may request a refund within 48 hours of purchase.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">4. Renewals</h2>
          <p>If you forgot to cancel your subscription before renewal, contact us within 48 hours of the renewal charge for a full refund of the renewal amount.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">5. Cancellation vs Refund</h2>
          <p>Cancelling your subscription stops future charges but does not automatically trigger a refund for the current period. To receive a refund, you must explicitly request one as described above.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">6. Exceptions</h2>
          <p>We reserve the right to deny refund requests in cases of abuse, fraud, or violation of our Terms of Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">7. Contact</h2>
          <p>For refund requests or questions, contact us at <a href="mailto:support@charmy.app" className="text-charmy-500">support@charmy.app</a></p>
        </section>

      </div>
    </div>
  )
}