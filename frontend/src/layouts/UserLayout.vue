<template>
  <el-container class="app-layout">
    <!-- Sidebar - Always collapsed by default -->
    <el-aside class="sidebar" :width="isCollapse ? '64px' : '220px'">
      <div class="logo-container">
        <h2 class="logo">📸</h2>
        <h2 v-if="!isCollapse" class="logo-text">Gogi</h2>
      </div>

      <el-menu
        :default-active="$route.path"
        router
        class="sidebar-menu"
        :collapse="isCollapse"
        :collapse-transition="false"
        background-color="transparent"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="/user/dashboard">
          <el-icon><House /></el-icon>
          <span>Dashboard</span>
        </el-menu-item>
        <el-menu-item index="/user/gallery">
          <el-icon><Picture /></el-icon>
          <span>My Gallery</span>
        </el-menu-item>
        <el-menu-item index="/user/chatbot">
          <el-icon><ChatLineRound /></el-icon>
          <span>AI Assistant</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container class="main-container">
      <!-- Header -->
      <el-header class="header">
        <div class="header-left">
          <div class="collapse-btn" @click="toggleCollapse">
            <el-icon><component :is="isCollapse ? 'Expand' : 'Fold'" /></el-icon>
          </div>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">Homepage</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.meta.title || 'Dashboard' }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-tooltip content="Notifications" placement="bottom">
            <el-badge :value="2" class="notification-badge">
              <el-icon size="20"><Bell /></el-icon>
            </el-badge>
          </el-tooltip>

          <el-dropdown @command="handleCommand" trigger="click">
            <span class="user-dropdown">
              <el-avatar :size="32" class="user-avatar">{{ user?.username?.charAt(0).toUpperCase() }}</el-avatar>
              <span class="username">{{ user?.username }}</span>
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon> Profile
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon> Settings
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon> Logout
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- Main Content -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import { Fold, Expand, House, Picture, ChatLineRound, Bell, User, Setting, SwitchButton, ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)
// Sidebar is collapsed by default for better UX
const isCollapse = ref(true)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    try {
      await authStore.logout()
      ElMessage({
        message: 'Logged out successfully',
        type: 'success',
        duration: 2000
      })
      router.push('/login')
    } catch (error) {
      ElMessage.error('Logout failed')
    }
  } else if (command === 'profile') {
    ElMessage({
      message: 'Profile feature coming soon',
      type: 'info',
      duration: 2000
    })
  } else if (command === 'settings') {
    ElMessage({
      message: 'Settings feature coming soon',
      type: 'info',
      duration: 2000
    })
  }
}
</script>

<style scoped>
:root {
  --sidebar-width: 220px;
  --sidebar-width-collapsed: 64px;
  --header-height: 64px;
  --sidebar-bg-color: #001529;
  --sidebar-text-color: rgba(255, 255, 255, 0.85);
  --sidebar-active-color: #fff;
  --primary-color: #409EFF;
}

.app-layout {
  height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
}

/* Sidebar Styles */
.sidebar {
  background-color: var(--sidebar-bg-color);
  transition: width 0.3s ease;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.logo-container {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 10px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  font-size: 24px;
  margin: 0;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  white-space: nowrap;
}

.sidebar-menu {
  flex-grow: 1;
  border-right: none !important;
  background-color: transparent !important;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: var(--sidebar-width);
}

.sidebar-menu .el-menu-item {
  color: var(--sidebar-text-color);
  font-weight: 500;
  margin: 4px 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.sidebar-menu .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.sidebar-menu .el-menu-item.is-active {
  background-color: var(--primary-color) !important;
  color: var(--sidebar-active-color) !important;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

/* Main Container Styles */
.main-container {
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
  background-color: #f8f9fa;
}

/* Header Styles */
.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: var(--header-height);
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #e8eaed;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-btn {
  font-size: 22px;
  cursor: pointer;
  color: #333;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background-color: #f5f7fa;
  color: var(--primary-color);
  transform: scale(1.05);
}

/* Right side of header */
.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.user-dropdown:hover {
  background-color: #f5f7fa;
  transform: translateY(-1px);
}

.username {
  font-weight: 500;
  color: #333;
}

.user-avatar {
  background: var(--primary-color);
  color: #fff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.notification-badge {
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 6px;
}

.notification-badge:hover {
  color: var(--primary-color);
  background-color: #f5f7fa;
  transform: scale(1.1);
}

/* Main Content Styles */
.main-content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  position: relative;
  background-color: #f8f9fa;
}

/* Transitions */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s ease-in-out;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1001;
    transform: translateX(calc(var(--sidebar-width) * -1));
  }

  .sidebar:not(.el-menu--collapse) {
     transform: translateX(0);
  }
  
  .main-container {
    margin-left: 0 !important;
  }

  .username {
    display: none;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .header {
    padding: 0 16px;
  }
}

/* Enhanced hover effects for better UX */
.sidebar-menu .el-menu-item .el-icon {
  transition: all 0.3s ease;
}

.sidebar-menu .el-menu-item:hover .el-icon {
  transform: scale(1.1);
}

/* Smooth transitions for all interactive elements */
* {
  transition: all 0.2s ease;
}

/* Custom scrollbar for main content */
.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 