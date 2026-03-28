import React from 'react'

const Privacy = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="space-y-16">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-black text-gray-900 uppercase tracking-tight">Your Data, Your Control</h2>
          <p className="text-xl text-gray-500 leading-relaxed">At SmartCampus, we believe privacy is a fundamental right. We've built our platform with privacy-by-design principles.</p>
        </div>
        <div className="space-y-12">
          <div className="p-16 bg-gray-900 text-white rounded-[4rem] space-y-8 shadow-2xl">
            <h4 className="text-3xl font-black text-blue-400 uppercase tracking-tight">The Privacy Promise</h4>
            <ul className="space-y-8 text-lg text-gray-300">
              <li className="flex gap-6">
                <span className="text-blue-400 text-2xl">✓</span>
                <span><strong>No Third-Party Selling:</strong> We never sell your personal data or behavioral patterns to advertisers.</span>
              </li>
              <li className="flex gap-6">
                <span className="text-blue-400 text-2xl">✓</span>
                <span><strong>Transparent AI:</strong> Our recommendation algorithms are open to audit and focus solely on your academic and social growth.</span>
              </li>
              <li className="flex gap-6">
                <span className="text-blue-400 text-2xl">✓</span>
                <span><strong>Right to be Forgotten:</strong> Delete your account and all associated data with a single click at any time.</span>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 border border-gray-100 rounded-[3rem] bg-gray-50">
              <h5 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Encryption</h5>
              <p className="text-gray-500 leading-relaxed">All data is encrypted at rest and in transit using industry-standard AES-256 protocols, ensuring your information remains private.</p>
            </div>
            <div className="p-10 border border-gray-100 rounded-[3rem] bg-gray-50">
              <h5 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Compliance</h5>
              <p className="text-gray-500 leading-relaxed">Fully compliant with GDPR, FERPA, and university-specific data governance policies to protect our academic community.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy