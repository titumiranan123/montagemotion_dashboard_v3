import { useQuery } from '@tanstack/react-query';
import { api_url } from './Apiurl';
const usePrice = () => {
    const {data,isLoading,isError,refetch} = useQuery({
        queryKey:["pricing"],
        queryFn:async ()=>{
        const res = await api_url.get('/api/pricing')
        return res.data.data
        }
    })
    return {data,isLoading,isError,refetch}
};

export default usePrice;