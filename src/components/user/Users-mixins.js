export default {
  data () {
    // 自定义校验邮箱
    var checkEmail = (rule, value, callback) => {
      if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)+$/.test(value) === false) {
        return callback(new Error('邮箱地址不正确'))
      }
      callback()
    }
    // 自定义校验手机号
    var checkMobile = (rule, value, callback) => {
      if (/^1\d{10}$/.test(value) === false) {
        return callback(new Error('手机号不正确'))
      }
      callback()
    }
    return {
      //  分页
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0, // 总共有多少条数
      userList: [],
      addDialogVisible: false, // 控制  添加用户的对话框 显示于隐藏
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制 编辑用户的对话框 显示与隐藏
      editDialogVisible: false,
      // 编辑表单验证
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑表单
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 分配角色对话框
      setRoleDialogVisible: false,
      // 分配角色表单信息
      setRoleForm: {
        id: '',
        username: '',
        role_name: '',
        rid: ''
      },
      rolesList: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取收评数据
    async getUserList () {
      const { data: res } = await this.$http.get('users', {params: this.queryinfo}) // get方式携带参数时需要一个params
      if (res.meta.status !== 200) return this.$message.error('请求用户列表失败')
      console.log(res)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize
    handleSizeChange (newSize) {
      console.log(newSize)
      this.queryinfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值的变化
    handleCurrentChange (newPageNum) {
      console.log(newPageNum)
      this.queryinfo.pagenum = newPageNum
      this.getUserList()
    },
    // 点击开关，就出发这个函数，把最新的状态保存到数据库
    async switchChange (newState, id) {
      const { data: res } = await this.$http.put(`users/${id}/state/${newState}`)
      if (res.meta.status !== 200) return this.$message.error('修改用户状态失败')
      this.$message.success('修改用户状态成功')
    },
    // 添加用户的对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser () {
      // 调用JS方法，校验表单是否正确
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.getUserList()
        this.addDialogVisible = false
      })
    },
    // 关闭 编辑对话框时候处理函数
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击编辑按钮，展示编辑的对话框
    async showEditDialog (scope) {
      // console.log(scope.row.id)
      const { data: res } = await this.$http.get('users/' + scope.row.id)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      // console.log(res.data)
      this.editForm.id = res.data.id
      this.editForm.username = res.data.username
      this.editForm.email = res.data.email
      this.editForm.mobile = res.data.mobile
      // 显示编辑对话框
      this.editDialogVisible = true
    },
    // 点击按钮 保存对用户做的修改
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, this.editForm)
        if (res.meta.status !== 200) return this.$message.error('编辑用户失败')
        this.$message.success('编辑用户成功')
        this.getUserList()
        this.editDialogVisible = false
      })
    },
    // 删除
    async remove (scope) {
      // console.log(scope.row.id)
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 用户取消了了删除
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      const { data: res } = await this.$http.delete('users/' + scope.row.id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失效')
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    // 点击按钮 展示分配角色的对话框
    showSetRoleDialog (row) {
      this.setRoleDialogVisible = true
      console.log(row)
      this.setRoleForm.id = row.id
      this.setRoleForm.role_name = row.role_name
      this.setRoleForm.username = row.username
      this.getRolesList()
    },
    // 关闭 分配角色对话框
    setRoleDialogClosed () {
      // 在vue中，没有设定:rules规则的时候，resetfields是不生效的
      this.setRoleForm.rid = ''
    },
    // 获取所有角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
      console.log(res.data)
    },
    // 点击按钮分配新角色
    async setRole () {
      if (this.setRoleForm.rid === '') return this.$message('请选择要分配的权限')
      // put方法（请求地址，请求参数）
      const { data: res } = await this.$http.put(`users/${this.setRoleForm.id}/role`, {
        rid: this.setRoleForm.rid})
      if (res.meta.status !== 200) return this.$message.error('为用户分配新角色失败！')
      this.$message.success('为用户分配新角色成功！')
      this.getUserList()
      this.setRoleDialogVisible = false
    }
  }
}
