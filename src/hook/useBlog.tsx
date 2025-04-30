import { useQuery } from '@tanstack/react-query';
import { api_url } from './Apiurl';
const useBlog = () => {
    const {data,isLoading,isError,refetch} = useQuery({
        queryKey:["blog"],
        queryFn:async ()=>{
        const res = await api_url.get('/api/blogs')
        return res.data.data
        }
    })
    return {data,isLoading,isError,refetch}
};

export default useBlog;