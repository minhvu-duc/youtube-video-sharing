import { useMemo } from 'react'

import Youtube, { YouTubeProps } from 'react-youtube'

type YoutubePlayerProps = {
  url: string,
  title: string,
  description: string,
  username: string
}

const YoutubePlayer = ({ url, title, description, username }: YoutubePlayerProps) => {

  const opts: YouTubeProps['opts'] = {
    height: '300',
    width: '350',
  }

  const videoId = useMemo(() => {
    if (url) {
      const videoIdPattern = /(?:v=|\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(videoIdPattern);

      if (match) {
        return match[1]
      }
    }
  }, [url])

  return (
    <div className='flex flex-col md:flex-row justify-center items-center'>
      <div className=''>
        <Youtube 
          videoId={videoId}
          opts={opts}
        />
      </div>
      <div className='ml-0 md:ml-3 p-2 bg-gray-100 text-sm w-[350px] h-[300px]'>
        <div>{title}</div>
        <div>Shared by: {username}</div>
        <div>Description:</div>
        <div className='truncate h-[100px]'>{description}</div>
      </div>
    </div>
  )
}

export default YoutubePlayer
