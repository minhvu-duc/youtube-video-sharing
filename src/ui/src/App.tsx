import { useEffect, useState } from 'react'
import axios from 'axios'

import YoutubePlayer from './component/YoutubePlayer'

function App() {
  const [videos, setVideos] = useState<any[]>([])
  const [page, setPage] = useState<number>(1)
  const [allFetched, setAllFetched] = useState(false)

  useEffect(() => {
    const load = async () => {
      const result = await axios.get('http://localhost:8080/video/get', {
        params: {
          page,
          limit: 1
        }
      })

      setVideos(result.data)
    }

    load()
  }, [])

  const handleLoadMore = async () => {
    const result = await axios.get('http://localhost:8080/video/get', {
      params: {
        page: page + 1,
        limit: 1
      }
    })

    if (result.data?.length === 0) {
      return setAllFetched(true)
    }
    setPage(prev => ++prev)
    setVideos(prev => [...prev, ...result.data])
  }

  return (
    <div className="flex flex-col items-center justify-center w-full p-2">
      {
        videos.map((video: any, index) => {
          return (
            <div className='m-3' key={index}>
              <YoutubePlayer url={video.url} title={video.title} description={video.description} username={video.User.name}/>
            </div>
          )
        })
      }
      <button hidden={allFetched} onClick={handleLoadMore} className=' bg-slate-200 p-2'>Load more</button>
    </div>
  );
}

export default App;
