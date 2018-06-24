export default {
  data () {
    return {
      rolesList: [],
      // 控制添加角色的对话框显示与隐藏
      addDialogVisible: false,
      // 添加角色的表单
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加用户规则校验
      addFormRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '请输入角色描述', trigger: 'blur'}
        ]
      },
      // 控制编辑用户的对话框显示与隐藏
      editDialogVisible: false,
      // 编辑角色对话框
      editForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      // 编辑表单角色信息校验
      editFormRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '请输入角色描述', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      // console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加新角色
    addRole () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        this.$message.success('添加角色成功')
        this.getRolesList()
        this.addDialogVisible = false
      })
    },
    // 展示编辑用户信息
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取角色信息失败')
      // 如果获取到了角色信息，赋值给editform
      console.log(res.data)
      this.editForm.id = res.data.roleId
      this.editForm.roleName = res.data.roleName
      this.editForm.roleDesc = res.data.roleDesc
      // 显示编辑的对话框
      this.editDialogVisible = true
    },
    // 点击确认，提交编辑信息
    editRole () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editForm.id, this.editForm)
        if (res.meta.status !== 200) return this.$message.error('编辑角色信息失败！')
        this.$message.success('编辑用户信息成功')
        this.getRolesList()
        this.editDialogVisible = false
      })
    },
    // 删除角色
    async remove (id) {
      // console.log(id)
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 用户取消删除
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      // 确认删除
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败')
      this.$message.success('删除角色成功！')
      this.getRolesList()
    },
    // 删除权限
    async removeRights (row, rightId) {
      // console.log(roleId, rightId)
      const confirmResult = await this.$confirm('此操作将永久删除该角色权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      const { data: res } = await this.$http.delete(`roles/${row.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除角色权限失败')
      this.$message.success('删除权限成功')
      row.children = res.data
    }
  }
}
