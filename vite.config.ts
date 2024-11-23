import {defineConfig , loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({mode})=>{
  const env = loadEnv(mode, process.cwd(), '');
  return{
    define:{
      'process.env.REACT_APP_APILEY': JSON.stringify(env.REACT_APP_APILEY),
      'process.env.REACT_APP_AUTHDOMAIN': JSON.stringify(env.REACT_APP_AUTHDOMAIN),
      'process.env.REACT_APP_PROJECTID': JSON.stringify(env.REACT_APP_PROJECTID),
      'process.env.REACT_APP_STORAGEBUCKET': JSON.stringify(env.REACT_APP_STORAGEBUCKET),
      'process.env.REACT_APP_MESSAGING_SENDER_ID': JSON.stringify(env.REACT_APP_MESSAGING_SENDER_ID),
      'process.env.REACT_APP_APPID': JSON.stringify(env.REACT_APP_APPID),
      'process.env.REACT_APP_MEASUREMENT_ID': JSON.stringify(env.REACT_APP_MEASUREMENT_ID),
      'process.env.REACT_APP_API_KEY': JSON.stringify(env.REACT_APP_API_KEY)
    },
    plugins: [react()],
  }
})

