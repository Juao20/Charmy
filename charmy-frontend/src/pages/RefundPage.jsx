export default function RefundPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Refund Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: September 21, 2026</p>

      <div className="flex flex-col gap-6 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Charmy is free</h2>
          <p>Charmy does not charge for any feature and does not process payments of any kind. Since no purchases are made within the App, there is nothing to refund.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Questions</h2>
          <p>If you have any questions about this policy, contact us at <a href="mailto:support@charmy.app" className="text-charmy-500">support@charmy.app</a></p>
        </section>

      </div>
    </div>
  )
}
