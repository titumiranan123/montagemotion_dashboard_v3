import { useQuery } from '@tanstack/react-query';
import { api_url } from './Apiurl';

const useTestimonial = () => {
    const {data,isLoading,refetch} = useQuery({
        queryKey:['testimonial'],
        queryFn:async()=>{
            const response = await api_url.get('/api/testimonials')
           return response.data
        },
        select:data=>data.data
    })
    return {data,isLoading,refetch}
};

export default useTestimonial;