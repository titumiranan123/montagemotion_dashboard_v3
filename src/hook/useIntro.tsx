import { useQuery } from '@tanstack/react-query';
import { api_url } from './Apiurl';
const useIntro = () => {
    const {data,isLoading,isError,refetch} = useQuery({
        queryKey:["headers"],
        queryFn:async ()=>{
        const res = await api_url.get('/api/header')
        return res.data.data
        }
    })
    return {data,isLoading,isError,refetch}
};

export default useIntro;