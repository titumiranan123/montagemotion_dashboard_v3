import { useQuery } from '@tanstack/react-query';
import { api_url } from './Apiurl';
const useFaq = () => {
    const {data,isLoading,isError,refetch} = useQuery({
        queryKey:["pricing"],
        queryFn:async ()=>{
        const res = await api_url.get('/api/faq')
        return res.data.data
        }
    })
    return {data,isLoading,isError,refetch}
};

export default useFaq;