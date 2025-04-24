import { useQuery } from '@tanstack/react-query';
import { api_url } from './Apiurl';
const useIntro = () => {
    const {data,isLoading,isError} = useQuery({
        queryKey:["headers"],
        queryFn:async ()=>{
        const res = await api_url.get('/api/header')
        return res.data.data
        }
    })
    return {data,isLoading,isError}
};

export default useIntro;