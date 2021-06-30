import {useState, useEffect, React} from 'react'
import axios from 'axios'


//const URL_SERVER = 'http://localhost:3001'
const URL_SERVER = 'https://spotify-ser.herokuapp.com'


export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState() 
    const [expiresIn, setExpiresIn] = useState()

    useEffect(() => {
        axios.post(URL_SERVER + '/login', {
           code, 
        }).then(res => {
            console.log(res.data)
            setAccessToken(res.data.accessToken)
            setRefreshToken(res.data.refreshToken)
            setExpiresIn(res.data.expiresIn)
            window.history.pushState({},null,"/")
        }).catch(() => {
            window.location = '/'
        })
    }, [code])


    useEffect(() => {
        if (!refreshToken || !expiresIn) return
        const interval = setInterval(() =>{
                    axios.post(URL_SERVER + '/refresh', {
           refreshToken, 
        }).then(res => {
            setAccessToken(res.data.accessToken)
            setExpiresIn(res.data.expiresIn)
        }).catch(() => {
            window.location = '/'
        })

        }, (expiresIn - 60) * 1000)

        return () => clearInterval(interval)
    },[refreshToken, expiresIn])

    return accessToken
}
