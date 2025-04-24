import { Contact } from '@/interface/interface';
import React from 'react';

interface ContactCardProps {
  contact: Contact;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="w-full border border-white rounded-xl shadow-md overflow-hidden mb-6 hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-100">{contact.name}</h2>
            <p className={`mt-1 ${isValidEmail(contact.email) ? 'text-[#1CC0D3]' : 'text-red-300'}`}>
              {isValidEmail(contact.email) ? (
                <a href={`mailto:${contact.email}`} className="hover:underline">
                  {contact.email}
                </a>
              ) : (
                <span className="italic">Invalid email format</span>
              )}
            </p>
          </div>
          <span className="text-sm text-gray-500">
            {formatDate(contact.created_at)}
          </span>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">MESSAGE</h3>
          <p className="text-gray-700 whitespace-pre-line">{contact.message}</p>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>ID: {contact.id}</span>
          <span>Last updated: {formatDate(contact.updated_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;