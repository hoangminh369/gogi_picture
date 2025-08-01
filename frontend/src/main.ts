import { createApp } from 'vue'
import App from './App.vue'
import router from './router'



// Element Plus
import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'


const app = createApp(App)

// Install Pinia FIRST before router
app.use(router)

app.mount('#app') 