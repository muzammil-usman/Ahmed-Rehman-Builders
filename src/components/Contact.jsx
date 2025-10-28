// components/Contact.jsx
import { useEffect } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import gsap from "gsap";

const Contact = () => {
  useEffect(() => {
    gsap.fromTo(
      ".contact-item",
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, stagger: 0.2, delay: 0.5 }
    );
  }, []);

  return (
    <section id="contact" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#174143] mb-4">
          Get In Touch
        </h2>
        <p className="text-xl text-center text-[#427A76] mb-12 max-w-2xl mx-auto">
          Ready to find your dream home? Contact A & R Builders today!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="contact-item">
              <h3 className="text-2xl font-bold text-[#174143] mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                {[
                  {
                    icon: <Phone className="w-6 h-6" />,
                    text: "+1 (555) 123-4567",
                  },
                  {
                    icon: <Mail className="w-6 h-6" />,
                    text: "hello@ar-builders.com",
                  },
                  {
                    icon: <MapPin className="w-6 h-6" />,
                    text: "123 Construction Ave, City, State 12345",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 text-[#427A76]"
                  >
                    <div className="text-[#427A76]">{item.icon}</div>
                    <span className="text-lg">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Office Hours */}
            <div className="contact-item">
              <h4 className="text-xl font-bold text-[#174143] mb-4">
                Office Hours
              </h4>
              <div className="text-[#427A76] space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-item">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143] focus:border-transparent cursor-text"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143] focus:border-transparent cursor-text"
                />
              </div>

              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143] focus:border-transparent cursor-text"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143] focus:border-transparent cursor-text"
              />

              <textarea
                placeholder="Your Message"
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#174143] focus:border-transparent resize-none cursor-text"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-[#174143] text-white py-4 rounded-lg font-semibold hover:bg-[#427A76] transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                Send Message
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
