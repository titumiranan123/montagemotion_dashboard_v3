import { useQuery } from '@tanstack/react-query';
import { api_url } from './Apiurl';
const useAbout = () => {
    const {data,isLoading,isError,refetch} = useQuery({
        queryKey:["about"],
        queryFn:async ()=>{
        const res = await api_url.get('/api/about')
        return res.data.data
        }
    })
    return {data,isLoading,isError,refetch}
};

export default useAbout;