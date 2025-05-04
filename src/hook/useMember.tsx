import { useQuery } from '@tanstack/react-query';
import { api_url } from './Apiurl';
const useMembers = () => {
    const {data,isLoading,isError,refetch} = useQuery({
        queryKey:["teams"],
        queryFn:async ()=>{
        const res = await api_url.get('/api/members')
        return res.data.data
        }
    })
    return {data,isLoading,isError,refetch}
};

export default useMembers;