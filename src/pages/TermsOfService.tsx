import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h1 className="text-3xl font-bold text-text-primary mb-8 text-center">
            Terms of Service
          </h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="text-sm text-text-secondary mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </div>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">1. Acceptance of Terms</h2>
              <p className="text-text-secondary mb-4">
                By accessing or using Ruminster ("the Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you do not agree to these Terms, you may not use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">2. Age Requirements</h2>
              <p className="text-text-secondary mb-4">
                You must be at least 13 years of age to use this Service. If you are between 13 and 18 years of age, 
                you may only use the Service with the consent and supervision of a parent or legal guardian who agrees 
                to be bound by these Terms. Users under 13 years of age are prohibited from using the Service. 
                By using the Service, you represent and warrant that you meet these age requirements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">3. Description of Service</h2>
              <p className="text-text-secondary mb-4">
                Ruminster is a platform that allows users to create, organize, and share their thoughts and ideas through 
                ruminations. The Service includes web-based tools and features to help users manage their personal reflections.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">4. User Accounts</h2>
              <p className="text-text-secondary mb-4">
                To use certain features of the Service, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-text-secondary mb-4 ml-4">
                <li>Providing accurate and complete registration information</li>
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">5. Acceptable Use</h2>
              <p className="text-text-secondary mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-text-secondary mb-4 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Upload malicious code or engage in harmful activities</li>
                <li>Spam, harass, or abuse other users</li>
                <li>Attempt to gain unauthorized access to the Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">6. Privacy and Data</h2>
              <p className="text-text-secondary mb-4">
                Your privacy is important to us. Our collection and use of your information is governed by our Privacy Policy, 
                which is incorporated into these Terms by reference.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">7. Content Ownership</h2>
              <p className="text-text-secondary mb-4">
                You retain ownership of the content you create using the Service. By using the Service, you grant us a 
                limited license to store, process, and display your content as necessary to provide the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">8. Service Availability</h2>
              <p className="text-text-secondary mb-4">
                We strive to maintain the availability of the Service, but we do not guarantee uninterrupted access. 
                We may modify, suspend, or discontinue the Service at any time with appropriate notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">9. Limitation of Liability</h2>
              <p className="text-text-secondary mb-4">
                The Service is provided "as is" without warranties of any kind. We shall not be liable for any indirect, 
                incidental, special, or consequential damages arising from your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">10. Changes to Terms</h2>
              <p className="text-text-secondary mb-4">
                We may update these Terms from time to time. When we do, we will notify existing users and require 
                acceptance of the updated Terms before continued use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-text-primary mb-4">11. Contact Information</h2>
              <p className="text-text-secondary mb-4">
                If you have any questions about these Terms, please contact us at support@ruminster.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
