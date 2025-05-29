import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaLinkedin, FaTwitter, FaFacebook, FaPaperPlane, FaUser, FaRegBuilding, FaInstagram } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { RiCustomerService2Fill, RiMedicineBottleLine } from 'react-icons/ri';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#5f6FFF] text-white pt-24 pb-32 px-4 dark:bg-blue-900">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/medical-cross.png')]"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <RiMedicineBottleLine className="text-5xl mx-auto mb-6 text-blue-200" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact <span className="text-blue-100">CarePulse</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Your health is our priority. Reach out anytime.
          </p>
        </div>
      </div>

      {/* Floating Contact Cards */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Support Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:-translate-y-2 transition duration-300 border-t-4 border-[#5f6FFF] hover:shadow-lg dark:bg-gray-800">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <RiCustomerService2Fill className="text-[#5f6FFF] text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 dark:text-white">Patient Support</h3>
            <p className="text-gray-600 mb-4 dark:text-white">24/7 assistance for all your healthcare needs</p>
            <a href="tel:4155550132" className="text-[#5f6FFF] font-medium flex items-center hover:text-blue-700 dark:text-blue-400">
              <FaPhone className="mr-2" /> (415) 555‑0132
            </a>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:-translate-y-2 transition duration-300 border-t-4 border-[#5f6FFF] hover:shadow-lg dark:bg-gray-800">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <FaRegBuilding className="text-[#5f6FFF] text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 dark:text-white">Our Facility</h3>
            <p className="text-gray-600 mb-4 dark:text-white">54709 Willms Station, Suite 350</p>
            <a href="#map" className="text-[#5f6FFF] font-medium flex items-center hover:text-blue-700 dark:text-blue-400">
              View on map →
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:-translate-y-2 transition duration-300 border-t-4 border-[#5f6FFF] hover:shadow-lg dark:bg-gray-800">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <FaPaperPlane className="text-[#5f6FFF] text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 dark:text-white">Email Us</h3>
            <p className="text-gray-600 mb-4 dark:text-white">We respond within 2 business hours</p>
            <a href="mailto:greatstackdev@gmail.com" className="text-[#5f6FFF] font-medium flex items-center hover:text-blue-700 dark:text-blue-400">
              <FaEnvelope className="mr-2" /> Send a message
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Form */}
          <div className="lg:w-2/3 bg-white rounded-2xl shadow-xl overflow-hidden dark:bg-gray-800">
            <div className="bg-[#5f6FFF] p-6 text-white dark:bg-blue-900">
              <h2 className="text-2xl font-bold">Get in touch</h2>
              <p>Fill out the form and our team will respond promptly</p>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {submitSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative dark:bg-green-900 dark:border-green-700 dark:text-green-200">
                  Thank you! Your message has been sent successfully.
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5f6FFF] focus:border-[#5f6FFF] transition duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5f6FFF] focus:border-[#5f6FFF] transition duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5f6FFF] focus:border-[#5f6FFF] transition duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="appointment">Appointment Request</option>
                  <option value="prescription">Prescription Inquiry</option>
                  <option value="billing">Billing Question</option>
                  <option value="feedback">Feedback/Suggestion</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5f6FFF] focus:border-[#5f6FFF] transition duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="How can we assist you today?"
                  required
                ></textarea>
              </div>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="consent"
                  className="mt-1 w-4 h-4 text-[#5f6FFF] rounded focus:ring-[#5f6FFF] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
                <label htmlFor="consent" className="ml-2 text-sm text-gray-600 dark:text-white">
                  I agree to CarePulse's privacy policy and terms of service. Your information will be handled securely in compliance with HIPAA regulations.
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#5f6FFF] hover:bg-[#4a5ae8] text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''} dark:bg-blue-900 dark:hover:bg-blue-800`}
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <IoMdSend className="mr-2" /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="lg:w-1/3 space-y-8">
            {/* Office Hours */}
            <div className="bg-white rounded-2xl shadow-xl p-8 dark:bg-gray-800">
              <h3 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100 flex items-center dark:text-white">
                <FaClock className="text-[#5f6FFF] mr-3 text-xl dark:text-blue-400" />
                Office Hours
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-white">Monday - Friday</span>
                  <span className="font-medium">8:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-white">Saturday</span>
                  <span className="font-medium">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between text-gray-400 dark:text-white">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 rounded-2xl shadow-xl p-8 border-l-4 border-red-500 dark:bg-red-900 dark:border-red-700">
              <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">Urgent Medical Care</h3>
              <p className="text-gray-600 mb-6 dark:text-white">
                For urgent medical matters outside office hours, please call our 24/7 emergency line.
              </p>
              <a href="tel:911" className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center dark:bg-red-800 dark:hover:bg-red-700">
                <FaPhone className="mr-2" /> Emergency: 911
              </a>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-xl p-8 dark:bg-gray-800">
              <h3 className="text-xl font-bold text-gray-800 mb-6 dark:text-white">Connect With Us</h3>
              <div className="flex space-x-4 justify-center">
                <a href="#" className="bg-[#5f6FFF] text-white p-3 rounded-full hover:bg-[#4a5ae8] transition duration-300 transform hover:scale-110 dark:bg-blue-900 dark:hover:bg-blue-800">
                  <FaFacebook className="text-xl" />
                </a>
                <a href="#" className="bg-[#5f6FFF] text-white p-3 rounded-full hover:bg-[#4a5ae8] transition duration-300 transform hover:scale-110 dark:bg-blue-900 dark:hover:bg-blue-800">
                  <FaTwitter className="text-xl" />
                </a>
                <a href="#" className="bg-[#5f6FFF] text-white p-3 rounded-full hover:bg-[#4a5ae8] transition duration-300 transform hover:scale-110 dark:bg-blue-900 dark:hover:bg-blue-800">
                  <FaLinkedin className="text-xl" />
                </a>
                <a href="#" className="bg-[#5f6FFF] text-white p-3 rounded-full hover:bg-[#4a5ae8] transition duration-300 transform hover:scale-110 dark:bg-blue-900 dark:hover:bg-blue-800">
                  <FaInstagram className="text-xl" />
                </a>
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm dark:text-white">
                  Follow us for health tips and updates
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Map Section */}
        <div id="map" className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden dark:bg-gray-800">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 flex items-center dark:text-white">
              <FaMapMarkerAlt className="text-[#5f6FFF] mr-2 dark:text-blue-400" />
              Our Healthcare Facility
            </h3>
          </div>
          <div className="relative h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573291245!2d-73.98784492416472!3d40.74844097138961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1690832558801!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location"
            ></iframe>
            <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-md max-w-xs dark:bg-gray-800">
              <p className="font-bold text-[#5f6FFF] mb-1 dark:text-blue-400">CarePulse Medical Center</p>
              <p className="text-sm text-gray-600 dark:text-white">54709 Willms Station, Suite 350</p>
              <p className="text-sm text-gray-600 mt-2 dark:text-white">Free parking available</p>
              <p className="text-sm text-gray-600 dark:text-white">Wheelchair accessible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;