'use client'
import ContactCard from '@/component/contact/Contactcards';
import ContactcardSkeleton from '@/component/contact/ContactcardSkeleton';

import useContact from '@/hook/useContact';
import { Contact } from '@/interface/interface';

import React from 'react';

const AllContacts: React.FC = () => {
  const {data:contacts,isLoading} = useContact()

  return (
    <div className="min-h-screen  p-4">
      <h1 className="text-3xl font-bold  mb-8 text-center">
        Contact Messages
      </h1>
      <div className="space-y-6">
        {isLoading ?<>{[...Array(4)]?.map((_,idx)=><ContactcardSkeleton key={idx} />)} </> :contacts?.map((contact:Contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>
    </div>
  );
};



export default AllContacts ;