import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { api_url } from './Apiurl';

const useContact = () => {
    const {data,isLoading,isError} = useQuery({
        queryKey:["contacts"],
        queryFn:async ()=>{
        const res = await api_url.get('/api/contacts')
        return res.data.data
        }
    })
    return {data,isLoading,isError}
};

export default useContact;