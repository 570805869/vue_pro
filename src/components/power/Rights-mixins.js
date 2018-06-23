export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightList()
  },
  methods: {
    async getRightList () {
      const {data: res} = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('请求权限列表出错')
      this.rightsList = res.data
      console.log(res.data)
    }
  }
}
