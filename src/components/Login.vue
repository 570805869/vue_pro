<template>
  <div class="login-container">
    <div class="logo">
      <img src="../assets/logo.png" alt="">
    </div>

    <!--登录的表单-->
    <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="0" class="loginform_style">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username">
          <!-- slot为输入框设置图标 -->
          <i slot="prefix" class="iconfont icon-user"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password">
          <i slot="prefix" class="iconfont icon-3702mima"></i>
        </el-input>
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button typr="info" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  components: {},
  methods: {
    // 点击重置按钮重置表单项
    resetForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('login', this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        // 登陆成功
        this.$message.success('登陆成功')
        // 登陆成功，保存令牌
        window.sessionStorage.setItem('token', res.data.token)
        // 跳到后台主页
        this.$router.push('/home')
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .login-container {
    width: 450px;
    height: 304px;
    background-color: #fff;
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 5px;

    .logo {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      transform: translateX(-50%) translateY(-60px);
      background-color: #fff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .loginform_style {
      padding: 0 20px;
      margin-top: 110px;
    }

    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
