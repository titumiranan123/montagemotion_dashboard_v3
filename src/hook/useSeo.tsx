import { useQuery } from '@tanstack/react-query';
import { api_url } from './Apiurl';
const useSeo = () => {
    const {data,isLoading,isError,refetch} = useQuery({
        queryKey:["seo"],
        queryFn:async ()=>{
        const res = await api_url.get('/api/seo')
        return res.data.data
        }
    })
    return {data,isLoading,isError,refetch}
};

export default useSeo;