<template>
  <div id="app">
    <el-container class="layout-container">
      <!-- Header -->
      <el-header class="header">
        <div class="header-content">
          <h1 class="title">
            <el-icon><Picture /></el-icon>
            Smart Photo Management System
          </h1>
          <div class="header-actions">
            <el-button type="primary" @click="checkBackendStatus">
              <el-icon><Connection /></el-icon>
              Check Backend
            </el-button>
          </div>
        </div>
      </el-header>

      <!-- Main Content -->
      <el-main class="main-content">
        <RouterView />
      </el-main>

      <!-- Footer -->
      <el-footer class="footer">
        <p>&copy; 2025 Smart Photo Management System - Powered by Vue.js + Node.js + n8n</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture, Connection } from '@element-plus/icons-vue'

const backendStatus = ref('Unknown')

const checkBackendStatus = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/health')
    if (response.ok) {
      const data = await response.json()
      ElMessage.success(`Backend is running! Status: ${data.status}`)
      backendStatus.value = 'Connected'
    } else {
      throw new Error('Backend not responding')
    }
  } catch (error) {
    ElMessage.error('Backend connection failed!')
    backendStatus.value = 'Disconnected'
  }
}

onMounted(() => {
  checkBackendStatus()
})
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.main-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 120px);
}

.footer {
  background: #f5f7fa;
  text-align: center;
  color: #909399;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer p {
  margin: 0;
}
</style>
