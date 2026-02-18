<template>
  <div class="login-wrapper">
    <LoginHeader />
    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">欢迎使用</h1>
        <!-- <h1 class="title">{{ title }}</h1> -->
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        class="login-form"
        label-width="0"
        size="large"
      >
        <el-form-item prop="account">
          <el-input v-model="formData.account" placeholder="请输入账号">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            :type="showPsw ? 'text' : 'password'"
            placeholder="请输入密码"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
            <template #suffix>
              <el-icon class="cursor-pointer" @click="showPsw = !showPsw">
                <View v-if="showPsw" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="submit-btn" :loading="loading" @click="onPreSubmit">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="copyright">Copyright @ 2021-2025. All Rights Reserved</div>

    <!-- 验证码弹窗 -->
    <el-dialog
      v-model="captchaVisible"
      title="安全验证"
      width="400px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form :model="formData" ref="captchaFormRef" @submit.prevent>
        <el-form-item prop="code" :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]">
          <div class="flex items-center w-full gap-2">
            <el-input
              v-model="formData.code"
              auto-complete="off"
              placeholder="请输入验证码"
              style="width: 200px"
              @keyup.enter="onCaptchaSubmit"
            >
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" @click="getCode" class="login-code-img cursor-pointer" />
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="captchaVisible = false">取消</el-button>
          <el-button type="primary" :loading="loading" @click="onCaptchaSubmit">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { getCodeImg } from '@/api/login'
import { ElMessage } from 'element-plus'
import LoginHeader from './components/Header.vue'

const title = import.meta.env.VITE_APP_TITLE
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const showPsw = ref(false)
const loading = ref(false)
const formRef = ref(null)
const captchaFormRef = ref(null)

const captchaVisible = ref(false)
const codeUrl = ref('')
const captchaEnabled = ref(true)

const formData = reactive({
  account: '',
  password: '',
  code: '',
  uuid: ''
})

const formRules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const getCode = async () => {
  getCodeImg().then(res => {
    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled
    if (captchaEnabled.value) {
      codeUrl.value = 'data:image/gif;base64,' + res.img
      formData.uuid = res.uuid
    }
  })
}

// 点击登录按钮，先校验账号密码
const onPreSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      // 校验通过，打开验证码弹窗
      formData.code = '' // 重置验证码
      captchaVisible.value = true
      getCode() // 获取验证码
    }
  })
}

// 提交登录
const onCaptchaSubmit = async () => {
  if (!captchaFormRef.value) return
  // 校验验证码
  await captchaFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.login({
          username: formData.account,
          password: formData.password,
          code: formData.code,
          uuid: formData.uuid
        })
        ElMessage.success('登录成功')
        captchaVisible.value = false
        const redirect = route.query.redirect
        router.push(redirect ? decodeURIComponent(redirect) : '/')
      } catch (error) {
        ElMessage.error(error.message || '登录失败')
        loading.value = false
        if (captchaEnabled.value) {
          getCode() // 刷新验证码
          formData.code = ''
        }
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  height: 100vh;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-size: cover;
  background-position: right center;
  position: relative;
  background-color: var(--td-bg-color-container);
  background-image: url('@/assets/assets-login-bg-white.png');

  .login-container {
    position: absolute;
    top: 40%;
    left: 5%;
    min-height: 500px;
    width: 400px;

    .title-container {
      .title {
        font-size: 36px;
        line-height: 44px;
        color: var(--td-text-color-primary);
        margin-top: 8px;
        text-align: left;
        font-weight: 500;

        &.margin-no {
          margin-top: 0;
        }
      }
    }
    
    .login-form {
      margin-top: 48px;
    }

    .submit-btn {
      width: 100%; 
      height: 40px;
      background-color: var(--td-brand-color);
      border-color: var(--td-brand-color);
      
      &:hover {
        background-color: var(--td-brand-color-hover);
        border-color: var(--td-brand-color-hover);
      }
    }
  }

  .copyright {
    position: absolute;
    left: 5%;
    bottom: 64px;
    color: var(--td-text-color-placeholder);
    font-size: 14px;
  }
}

.login-code {
  height: 38px;
}
.login-code-img {
  height: 100%;
}

/* 暗色模式 */
html.dark .login-wrapper {
  background-image: url('@/assets/assets-login-bg-black.png');
}

@media screen and (max-height: 700px) {
  .login-wrapper .copyright {
    display: none;
  }
}

/* 修复浏览器自动填充背景色 */
:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:hover),
:deep(input:-webkit-autofill:focus),
:deep(input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 1000px var(--el-input-bg-color, #fff) inset !important;
  -webkit-text-fill-color: var(--el-input-text-color, #303133) !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* 暗色模式自动填充 */
html.dark :deep(input:-webkit-autofill),
html.dark :deep(input:-webkit-autofill:hover),
html.dark :deep(input:-webkit-autofill:focus),
html.dark :deep(input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 1000px var(--el-input-bg-color, #1f1f1f) inset !important;
  -webkit-text-fill-color: var(--el-input-text-color, #e5e5e5) !important;
}
</style>
