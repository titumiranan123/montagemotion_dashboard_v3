'use client'
import Image from 'next/image';
import React from 'react';
import ReactPlayer from 'react-player';

export interface ITestimonial {
    id?: string;
    name: string;
    designation: string;
    message?: string;
    image?: string;
    video_message?: string;
    position?: number;
    type: "main" | "shorts" | "talking" | "podcast" | "graphic" | "advertising" | "website";
}

const Shortcard = ({ data }: { data: ITestimonial }) => {
    return (
        <section className='relative flex flex-col-reverse w-[321px] h-[576px] rounded-[10px] overflow-hidden border border-gray-200 shadow-lg mx-auto'>
            {/* Video Player */}
            <div className='absolute inset-0 w-full h-full'>
                <ReactPlayer
                    url={data.video_message}
                    playing={false}
                    light={data.image}
                    playIcon={
                        <div className="flex items-center justify-center w-full h-full">
                            <Image
                                src="/assets/playbutton.png"
                                width={80}
                                height={80}
                                alt="Play"
                                
                            />
                        </div>
                    }
                    width="100%"
                    height="100%"
                    controls
                    config={{
                        youtube: {
                            playerVars: {
                                modestbranding: 1,
                                showinfo: 0,
                                rel: 0,
                                controls: 0,
                                fs: 0,
                            },
                        },
                    }}
                    
                />
            </div>
            {/* Info Overlay */}
            <div className='relative p-4 bg-gradient-to-t from-black to-transparent z-10'>
                <h1 className='text-2xl font-semibold text-white'>{data.name}</h1>
                <p className='text-lg text-white/80'>{data.designation}</p>
                {/* {data.message && (
                    <p className='mt-2 text-white/90 text-sm line-clamp-2'>{data.message}</p>
                )} */}
            </div>
        </section>
    );
};

export default Shortcard;