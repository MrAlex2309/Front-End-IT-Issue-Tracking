import axios from "axios";
let isRefreshing = false;
let refreshSubcriber = []
const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`,
})
api.interceptors.request.use(
    (config)=>{
        const token = JSON.parse(localStorage.getItem('authToken'))
        if(token){
            config.headers.Authorization = "Bearer "+ String(token)
        }
        return config
    },
    (error)=>Promise.reject(error)  
)
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        const { config, response:{status,data}} = error;
        const originalRequest = config
        
        if(status === 401 ){
            if(!isRefreshing){
                isRefreshing = true
                const refresh = JSON.parse(localStorage.getItem('refresh'))
                const refreshToken = {
                    'refresh': refresh
                }
                console.log(refreshToken)
                axios.post(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/api/token/refresh/`,refreshToken)
                    .then(({data})=>{
                        localStorage.setItem('authToken', JSON.stringify(data.access))
                        axios.defaults.headers.common.Authorization = "Bearer "+String(data.access)
                        refreshSubcriber.forEach(cb=>cb(data.access))
                        refreshSubcriber = []
                    })
                    .catch(err =>{
                        if (err.response.status === 401) {
                            window.alert("Session Expire")
                            logout()
                          }
                    })
                    .finally(()=>{
                        isRefreshing = false
                    })
            }
            const retryOriginalRequest = new Promise(resolve => {
                subscribeTokenRefresh(token=>{
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    resolve(axios(originalRequest))
                })
            })
            return retryOriginalRequest
        }
        if(status === 403){
            window.alert(data.detail)
        }
        return Promise.reject(error)
    }
)
function subscribeTokenRefresh(cb) {
    refreshSubcriber.push(cb);
  }
function logout(){
    localStorage.removeItem("userInfo")
    localStorage.removeItem("refresh")
    localStorage.removeItem("authToken")
    window.location.href="/login"
} 
export default api