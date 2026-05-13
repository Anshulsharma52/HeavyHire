import React from 'react';
import { Truck, Shield, Users, Clock } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            About <span className="text-primary">HeavyHire</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Connecting construction professionals with premium heavy machinery.
            We make equipment rental seamless, transparent, and efficient.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-10 md:p-16 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At HeavyHire, we believe that access to high-quality construction equipment shouldn't be a bottleneck for your projects. Our platform bridges the gap between equipment owners and contractors, ensuring maximum utilization of idle machinery and providing affordable rentals for those who need them.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Whether you need a JCB for a day or a fleet of heavy-duty trucks for a month, HeavyHire delivers reliability right to your site.
              </p>
            </div>
            <div className="bg-dark-light text-white p-10 md:p-16 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-primary/20 p-2 rounded text-primary mt-1">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Verified Owners</h3>
                    <p className="text-gray-400">Every machine listed on our platform comes from a thoroughly vetted and verified owner.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-primary/20 p-2 rounded text-primary mt-1">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Real-Time Booking</h3>
                    <p className="text-gray-400">Experience instant booking requests and real-time status updates right from your dashboard.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-primary/20 p-2 rounded text-primary mt-1">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Dedicated Support</h3>
                    <p className="text-gray-400">Our customer success team is always ready to assist you with any rental issues.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
