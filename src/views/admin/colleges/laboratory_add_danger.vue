<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据处理中..."
    element-loading-spinner="el-icon-loading"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane label="危险源" name="dangerSource">
        <el-form :model="dangerSource" label-width="100px">
          <el-form-item>
            <div><h2>辐射类</h2></div>
            <el-checkbox-group v-model="dangerSource.radiation">
              <el-checkbox label="Ⅰ类放射源">Ⅰ类放射源</el-checkbox>
              <el-checkbox label="Ⅱ类放射源">Ⅱ类放射源</el-checkbox>
              <el-checkbox label="Ⅲ类放射源">Ⅲ类放射源</el-checkbox>
              <el-checkbox label="IV类放射源">IV类放射源</el-checkbox>
              <el-checkbox label="V类放射源">V类放射源</el-checkbox>
              <el-checkbox label="Ⅰ类射线裴置">Ⅰ类射线裴置</el-checkbox>
              <el-checkbox label="Ⅱ类射线装置">Ⅱ类射线装置</el-checkbox>
              <el-checkbox label="Ⅲ类射线装置">Ⅲ类射线装置</el-checkbox>
              <br />
              <el-checkbox label="甲级非密封放射性物质工作场所"
                >甲级非密封放射性物质工作场所</el-checkbox
              >
              <el-checkbox label="乙级非密封放射性物质工作场所"
                >乙级非密封放射性物质工作场所</el-checkbox
              >
              <el-checkbox label="丙级非密封放射性物质工作场所"
                >丙级非密封放射性物质工作场所</el-checkbox
              >
              <br />
              <el-checkbox label="管制的核材料">管制的核材料</el-checkbox>
              <el-checkbox label="豁免放射源">豁免放射源</el-checkbox>
              <el-checkbox label="豁免放射装置">豁免放射装置</el-checkbox>
            </el-checkbox-group>
            <div><h2>机械类</h2></div>
            <el-checkbox-group v-model="dangerSource.mechanical">
              <el-checkbox label="压力容器(压力>=20MPa的高压容器，压力>=3.8MPa的锅炉)"
                >压力容器(压力>=20MPa的高压容器，压力>=3.8MPa的锅炉)</el-checkbox
              >
              <el-checkbox label="高速旋转设备（转速≥30000r/min）"
                >高速旋转设备（转速≥30000r/min）</el-checkbox
              >
              <el-checkbox label="特殊设备:行车、等离子设备、电弧放电设备、热淬火设备、锻压设备等"
                >特殊设备:行车、等离子设备、电弧放电设备、热淬火设备、锻压设备等</el-checkbox
              >
              <el-checkbox label="单间实验室中加热设备合计数量>=6台，如烘箱、马弗炉、管式炉等"
                >单间实验室中加热设备合计数量>=6台，如烘箱、马弗炉、管式炉等</el-checkbox
              >
              <el-checkbox label="压力容器(10MPa-20MPa的高压容器，压力&lt;3.8MPa的锅炉)"
                >压力容器(10MPa-20MPa的高压容器，压力&lt;3.8MPa的锅炉)</el-checkbox
              >
              <el-checkbox label="机械压力设备:冲压机、金属挤压液压机、四柱液压机等"
                >机械压力设备:冲压机、金属挤压液压机、四柱液压机等</el-checkbox
              >

              <el-checkbox label="高转速设备(转速10000r/min-30000r/min)"
                >高转速设备(转速10000r/min-30000r/min)</el-checkbox
              >
              <el-checkbox label="单间实验室中加热设备合计数量3-5台，如烘箱、马弗炉、管式炉等"
                >单间实验室中加热设备合计数量3-5台，如烘箱、马弗炉、管式炉等</el-checkbox
              >
              <el-checkbox label="额定起重量>3t的起重机械(除行车外)及叉车等"
                >额定起重量>3t的起重机械(除行车外)及叉车等</el-checkbox
              >
              <el-checkbox label="压力容器(压力&lt;10MPa)">压力容器(压力&lt;10MPa)</el-checkbox>
              <el-checkbox label="机械加工设备:高速、回转机械、车床、钻床、铣床、刨床等"
                >机械加工设备:高速、回转机械、车床、钻床、铣床、刨床等</el-checkbox
              >
              <el-checkbox label="特种加工设备:线切割机、电火花机等、注塑机、电焊设备等"
                >特种加工设备:线切割机、电火花机等、注塑机、电焊设备等</el-checkbox
              >

              <el-checkbox label="单间实验室中加热设备数量S2台，如烘箱、马弗炉、管式炉等"
                >单间实验室中加热设备数量S2台，如烘箱、马弗炉、管式炉等</el-checkbox
              >
              <el-checkbox label="未列入以上三级的机械类危险源"
                >未列入以上三级的机械类危险源</el-checkbox
              >
            </el-checkbox-group>

            <div><h2>电子(电气)类</h2></div>
            <el-checkbox-group v-model="dangerSource.electronic">
              <el-checkbox label="高电压设备(电压>=1000V)、大电流设备(电流>=500A)"
                >高电压设备(电压>=1000V)、大电流设备(电流>=500A)</el-checkbox
              >
              <el-checkbox label="单间实验室设备总功率>=40kW"
                >单间实验室设备总功率>=40kW</el-checkbox
              >
              <el-checkbox label="激光设备(输出功率>=500W)，如激光切割机、雕刻机、打孔机、焊接机等"
                >激光设备(输出功率>=500W)，如激光切割机、雕刻机、打孔机、焊接机等</el-checkbox
              >
              <el-checkbox label="强磁设备和环境(磁感应强度>=2T)"
                >强磁设备和环境(磁感应强度>=2T)</el-checkbox
              >
              <el-checkbox label="较高电压设备(380V-1000V)">较高电压设备(380V-1000V)</el-checkbox>
              <el-checkbox label="较大电流设备(100A-500A)">较大电流设备(100A-500A)</el-checkbox>
              <el-checkbox label="单间实验室设备总功率(10kW-40kW)"
                >单间实验室设备总功率(10kW-40kW)</el-checkbox
              >

              <el-checkbox
                label="激光设备(0.5Ws输出功率&lt;500W)如激光切割机、雕刻机、打孔机、焊接机、指示器等"
                >激光设备(0.5Ws输出功率&lt;500W)如激光切割机、雕刻机、打孔机、焊接机、指示器等</el-checkbox
              >
              <el-checkbox label="强磁设备和环境(0.5TS&lt;=磁感应强度&lt;2T)"
                >强磁设备和环境(0.5TS&lt;=磁感应强度&lt;2T)</el-checkbox
              >
              <el-checkbox label="单间实验室设备总功率&lt;10kW"
                >单间实验室设备总功率&lt;10kW</el-checkbox
              >
              <el-checkbox label="24小时不断电设备">24小时不断电设备</el-checkbox>
              <el-checkbox label="微波暗室">微波暗室</el-checkbox>
              <el-checkbox label="中磁设备和环境(0.2TS磁感应强度&lt;0.5T)"
                >中磁设备和环境(0.2TS磁感应强度&lt;0.5T)</el-checkbox
              >

              <el-checkbox label="电烙铁、电吹风、热风枪、电磁炉等"
                >电烙铁、电吹风、热风枪、电磁炉等</el-checkbox
              >
              <el-checkbox label="未列入以上三级的电子(电气)类危险源"
                >未列入以上三级的电子(电气)类危险源</el-checkbox
              >
            </el-checkbox-group>

            <div><h2>生物医学类</h2></div>
            <el-checkbox-group v-model="dangerSource.biomedical">
              <el-checkbox label="第一类病原微生物及类似的新病原微生物"
                >第一类病原微生物及类似的新病原微生物</el-checkbox
              >
              <el-checkbox label="第二类病原微生物及类似的新病原微生物"
                >第二类病原微生物及类似的新病原微生物</el-checkbox
              >
              <el-checkbox label="麻醉药品">麻醉药品</el-checkbox>
              <el-checkbox label="精神药品">精神药品</el-checkbox>
              <el-checkbox label="第三类病原微生物">第三类病原微生物</el-checkbox>
              <el-checkbox label="第四类病原微生物">第四类病原微生物</el-checkbox>
              <el-checkbox label="有毒有害生物制剂">有毒有害生物制剂</el-checkbox>
              <el-checkbox label="实验动物及尸体(不涉及病原微生物)"
                >实验动物及尸体(不涉及病原微生物)</el-checkbox
              >
              <el-checkbox label="转基因生物">转基因生物</el-checkbox>
              <el-checkbox label="未列入以上的类别的高温高压灭菌锅"
                >未列入以上的类别的高温高压灭菌锅</el-checkbox
              >
              <el-checkbox label="未列入以上的其他生物(医学)类危险源"
                >未列入以上的其他生物(医学)类危险源</el-checkbox
              >
            </el-checkbox-group>

            <div><h2>化学类</h2></div>
            <el-checkbox-group v-model="dangerSource.chemistry">
              <el-checkbox label="强氧化性试剂">强氧化性试剂</el-checkbox>
              <el-checkbox label="强腐蚀性试剂">强腐蚀性试剂</el-checkbox>
              <el-checkbox label="其他一般危险化学试剂">其他一般危险化学试剂</el-checkbox>
              <el-checkbox label="有毒有害气体">有毒有害气体</el-checkbox>
              <el-checkbox label="易燃易爆气体">易燃易爆气体</el-checkbox>
              <el-checkbox label="助燃气体">助燃气体</el-checkbox>
              <el-checkbox label="腐蚀性气体">腐蚀性气体</el-checkbox>
              <el-checkbox label="其他气体(单间存放钢瓶数>=5)"
                >其他气体(单间存放钢瓶数>=5)</el-checkbox
              >
              <el-checkbox label="普通化学试剂">普通化学试剂</el-checkbox>
              <el-checkbox label="少量酒精">少量酒精</el-checkbox>
              <el-checkbox label="压缩或液化惰性气体">压缩或液化惰性气体</el-checkbox>
              <el-checkbox label="单间实验室存放其它气体钢瓶数量&lt;=4瓶"
                >单间实验室存放其它气体钢瓶数量&lt;=4瓶</el-checkbox
              >
              <el-checkbox label="剧毒品">剧毒品</el-checkbox>
              <el-checkbox label="剧毒气体">剧毒气体</el-checkbox>
              <el-checkbox label="爆炸品">爆炸品</el-checkbox>
              <el-checkbox label="第一类易制毒品">第一类易制毒品</el-checkbox>
              <el-checkbox label="易制爆品">易制爆品</el-checkbox>
              <el-checkbox label="第二类易制毒品">第二类易制毒品</el-checkbox>
              <el-checkbox label="第三类易制毒品">第三类易制毒品</el-checkbox>
              <el-checkbox label="有毒有害试剂">有毒有害试剂</el-checkbox>
              <el-checkbox label="易燃易爆试剂">易燃易爆试剂</el-checkbox>
            </el-checkbox-group>

            <div><h2>其他类</h2></div>
            <el-checkbox-group v-model="dangerSource.other">
              <el-checkbox label="舞台升降机械">舞台升降机械</el-checkbox>
              <el-checkbox label="涉及粉尘爆炸危险的场所">涉及粉尘爆炸危险的场所</el-checkbox>
              <el-checkbox label="有毒、易燃的绘画材料、颜料、釉料、染料、清洗剂等"
                >有毒、易燃的绘画材料、颜料、釉料、染料、清洗剂等</el-checkbox
              >
              <el-checkbox label="木工加工场所">木工加工场所</el-checkbox>
              <el-checkbox label="易发生绞、碾、碰、戳、切、割等伤害的体艺器材等"
                >易发生绞、碾、碰、戳、切、割等伤害的体艺器材等</el-checkbox
              >
              <el-checkbox label="未列入以上的其他类危险源">未列入以上的其他类危险源</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="防护要点" name="protectionPoints">
        <el-form :model="dangerSource" label-width="100px">
          <el-form-item>
            <div><h2>灭火要点(注意:CO2灭火器限实验室内有单价30万元及以上贵重精密仪器设备)</h2></div>
            <el-checkbox-group v-model="dangerSource.fire">
              <el-checkbox label="用水灭火">用水灭火</el-checkbox>
              <el-checkbox label="用CO2灭火器灭火">用CO2灭火器灭火</el-checkbox>
              <el-checkbox label="用沙土灭火">用沙土灭火</el-checkbox>
              <el-checkbox label="用干粉灭火器灭火">用干粉灭火器灭火</el-checkbox>
            </el-checkbox-group>

            <div><h2>重要提示</h2></div>
            <el-checkbox-group v-model="dangerSource.note">
              <el-checkbox label="注意安全">注意安全</el-checkbox>
              <el-checkbox label="当心滑跌">当心滑跌</el-checkbox>
              <el-checkbox label="当心挤压">当心挤压</el-checkbox>
              <el-checkbox label="注意高温">注意高温</el-checkbox>
              <el-checkbox label="当心伤手">当心伤手</el-checkbox>
              <el-checkbox label="当心爆炸">当心爆炸</el-checkbox>
              <el-checkbox label="当心触电">当心触电</el-checkbox>
              <el-checkbox label="当心机械伤人">当心机械伤人</el-checkbox>
              <el-checkbox label="注意防火">注意防火</el-checkbox>
              <el-checkbox label="注意防毒">注意防毒</el-checkbox>
              <el-checkbox label="当心腐蚀">当心腐蚀</el-checkbox>
              <el-checkbox label="注意通风">注意通风</el-checkbox>
              <el-checkbox label="当心泄露">当心泄露</el-checkbox>
              <el-checkbox label="当心低温">当心低温</el-checkbox>
              <el-checkbox label="当心电离辐射">当心电离辐射</el-checkbox>
              <el-checkbox label="当心吊物">当心吊物</el-checkbox>
              <el-checkbox label="当心瓦斯">当心瓦斯</el-checkbox>
              <el-checkbox label="当心蒸汽和热水">当心蒸汽和热水</el-checkbox>
              <el-checkbox label="禁止启动">禁止启动</el-checkbox>
              <el-checkbox label="禁止入内">禁止入内</el-checkbox>
              <el-checkbox label="禁止攀爬">禁止攀爬</el-checkbox>
              <el-checkbox label="禁止明火作业">禁止明火作业</el-checkbox>
              <el-checkbox label="禁止触摸">禁止触摸</el-checkbox>
              <el-checkbox label="禁止混放">禁止混放</el-checkbox>
              <el-checkbox label="禁止吸烟">禁止吸烟</el-checkbox>
              <el-checkbox label="禁止放易燃物">禁止放易燃物</el-checkbox>
              <el-checkbox label="禁止带火种">禁止带火种</el-checkbox>
              <el-checkbox label="禁止烟火">禁止烟火</el-checkbox>
              <el-checkbox label="禁止用水灭火">禁止用水灭火</el-checkbox>
              <el-checkbox label="禁止戴手套">禁止戴手套</el-checkbox>
              <el-checkbox label="禁止堆放">禁止堆放</el-checkbox>
              <el-checkbox label="禁止饮食">禁止饮食</el-checkbox>
              <el-checkbox label="必须保持清洁">必须保持清洁</el-checkbox>
              <el-checkbox label="必须戴防护眼镜">必须戴防护眼镜</el-checkbox>
              <el-checkbox label="必须持证上岗">必须持证上岗</el-checkbox>
              <el-checkbox label="必须穿防护服">必须穿防护服</el-checkbox>
              <el-checkbox label="必须戴防护手套">必须戴防护手套</el-checkbox>
              <el-checkbox label="必须戴防毒面具">必须戴防毒面具</el-checkbox>
              <el-checkbox label="必须穿防护鞋">必须穿防护鞋</el-checkbox>
              <el-checkbox label="必须戴防护口罩">必须戴防护口罩</el-checkbox>
              <el-checkbox label="必须戴防护帽">必须戴防护帽</el-checkbox>
              <el-checkbox label="必须加锁">必须加锁</el-checkbox>
              <el-checkbox label="必须穿工作服">必须穿工作服</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="small" @click="submit('form')">保 存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { addCourtyard, editCourtyard, get_a_Courtyard } from '@/api/colleges';
import { frontPlatformList, platformUserList } from '@/api/platform';
import { uploadUrl } from '@/api/public';
import { checkImgFile } from '@/utils/index';
import Tinymce from '@/components/Tinymce';

export default {
  components: {
    Tinymce,
  },
  data() {
    return {
      dialogVisible: true,
      activeTab: 'dangerSource',
      dangerSource: {
        radiation: [],
        mechanical: [],
        note: [],
        fire: [],
        chemistry: [],
        other: [],
        biomedical: [],
        electronic: [],
      },
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: uploadUrl,
      form: {
        name: '',
        number: '',
        id: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        number: [
          {
            required: true,
            message: '请输入序号',
            trigger: 'blur',
          },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
      },
    };
  },
  created() {
    const danger = JSON.parse(this.$route.query.danger);
    if (danger) {
      this.dangerSource = danger;
    }
  },
  methods: {
    submit(form) {
      this.returnToList();
    },
    returnToList() {
      if (this.$route.params.id) {
        this.$router.push({
          name: 'adminLaboratoryEdit',
          params: { id: this.$route.params.id },
          query: {
            form_: this.$route.query.form,
            danger: JSON.stringify(this.dangerSource),
            id: this.$route.params.id,
          },
        });
      } else {
        this.$router.push({
          path: '/admin/colleges/laboratory-add/',
          query: {
            form_: this.$route.query.form,
            danger: JSON.stringify(this.dangerSource),
          },
        });
      }
    },
  },
};
</script>
