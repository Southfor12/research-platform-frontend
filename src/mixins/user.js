import { getDepartmentListAPI, getSubjectFacilitatorListAPI, getLaboratoryListAPI } from '@/api/user'
export default {
  data () {
    return {
      departmentLis: [],
      subjectFacilitatorList: [],
    }
  },
  created () {
    this.getDepartmentList()
    this.getSubjectFacilitatorList()
  },

  methods: {
    async getDepartmentList () {
      const { data } = await getDepartmentListAPI()
      this.departmentLis = data
    },
    async getSubjectFacilitatorList () {
      const { data } = await getSubjectFacilitatorListAPI()
      this.subjectFacilitatorList = data
    },
  }
}
