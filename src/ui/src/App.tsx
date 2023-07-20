import { useEffect, useState } from 'react'
import axios from 'axios'

import YoutubePlayer from './component/YoutubePlayer'
import Modal from './component/ShareVideo'

const BASE_URL = ""

function App() {
  const [user, setUser] = useState<any>(null)

  const [videos, setVideos] = useState<any[]>([])
  const [page, setPage] = useState<number>(1)
  const [allFetched, setAllFetched] = useState(false)
  const [showSharing, setShowSharing] = useState(false)

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [videoUrl, setVideoUrl] = useState<string>("")

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const result = await axios.get('/video/get', {
          params: {
            page,
            limit: 1
          }
        })
  
        setVideos(result.data)
      } catch (err) {

      }
    }

    const loadUser = async () => {
      try {
        const token = localStorage.getItem("access-token")
        if (token) {
          const result = await axios.get('/user/info', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          if (result.status === 200) {
            setUser(result.data.user)
          }
        }
      } catch (err) {

      }
    }

    loadVideo()
    loadUser()
  }, [])

  const handleLoadMore = async () => {
    const result = await axios.get('/video/get', {
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

  const handleLoginOrRegister = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return console.log('ERROR')
    }

    if (!password) {
      return console.log('ERROR')
    }

    const name = email.split('@')[0]

    let result;
    try {
      result = await axios.post('/user/create', {
        email,
        password,
        name
      })

      if (result.status === 201) {
        localStorage.setItem("access-token", result.data.token)
        return setUser(result.data.user)
      }
    } catch (err) {

    }

    try {
      result = await axios.post('/user/login', {
        email,
        password
      })

      if (result.status === 200) {
        console.log(result.data)
        localStorage.setItem('access-token', result.data.token)
        return setUser(result.data.user)
      }
    } catch (err: any) {
      console.log(err.response.data.error)
    }


  }

  const handleShareVideo = async () => {
    try {
      const token = localStorage.getItem("access-token")
      await axios.post('/video/create', {
        url: videoUrl
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setShowSharing(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = async () => {
    const token = localStorage.getItem("access-token")
    try {
      await axios.post('/user/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setUser(null)
    } catch (err) {

    }
  }

  return (
    <div>
      <div className='flex flex-col md:flex-row justify-between items-center top-0 w-full bg-slate-500 px-3 py-2'>
        <div className='text-white md:mr-2 md:mb-0 mr-0 mb-2 text-lg font-semibold'>Funny Movies</div>
        {!user && 
          <div className='flex md:flex-row flex-col items-center'>
            <input onChange={e => setEmail(e.target.value)} className='md:mr-2 md:mb-0 mr-0 mb-2 pl-1' placeholder='email'/>
            <input type="password" onChange={e => setPassword(e.target.value)} className='md:mr-2 md:mb-0 mr-0 mb-2 pl-1' placeholder='password'/>
            <button onClick={handleLoginOrRegister} className='bg-slate-200 px-2 w-[150px]'>Login / Register</button>
          </div>
        }
        {user && 
          <div className='flex md:flex-row flex-col items-center'>
            <div className='md:mr-2 md:mb-0 mr-0 mb-2 pl-1' placeholder='email'>Welcome {user.name}</div>
            <button onClick={() => setShowSharing(true)} className='md:mr-2 md:mb-0 mr-0 mb-2 pl-1 bg-slate-200 px-2 w-[150px]'>Share a movie</button>
            <button onClick={handleLogout} className='bg-slate-200 px-2 w-[150px]'>Logout</button>
          </div>
        }
      </div>
      <div className='flex flex-col items-center justify-center w-full p-2'>
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
      <Modal open={showSharing}>
        <div className='flex flex-col justify-center items-center w-[300px]'>
          <div className='mb-2'>Share a Youtube movie</div>
          <input onChange={e => setVideoUrl(e.target.value)} className='pl-1 border border-gray-300 mb-2' placeholder='youtube url'/>
          <button onClick={handleShareVideo} className=' bg-gray-300 px-2 py-1'>Share</button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
