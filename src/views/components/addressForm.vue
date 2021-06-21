<template>
  <el-dialog
    center
    :title="dialogStatus === 'create' ? `新增收货地址` : `编辑收货地址`"
    :visible.sync="dialogFormVisible"
    width="620px"
    @open="handleOpen"
    @close="dialogClose"
  >
    <div>
      <el-form
        label-width="90px"
        size="medium"
        :model="addrForm"
        :rules="addrFormRules"
        ref="addrFormRef"
      >
        <!-- 国家/地区 必填 -->
        <el-form-item label="国家/地区" prop="consigneeCountry">
          <!-- select选择器 -->
          <el-select v-model="addrForm.consigneeCountry" placeholder="请选择">
            <el-option
              v-for="(item, index) in frontData.conuntryOptions"
              :key="index"
              :label="item.name"
              :value="item.short"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 收货人 必填 -->
        <el-form-item label="收货人" prop="consigneeName">
          <!-- 文本框 -->
          <el-input
            v-model.trim="addrForm.consigneeName"
            placeholder="请输入收货人姓名"
          ></el-input>
        </el-form-item>

        <!-- 街道地址 必填-->
        <el-form-item label="街道地址" prop="consigneeAddr">
          <!-- textarea -->
          <el-input
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 3 }"
            placeholder="街道地址，邮政信箱，公司名称，转交方，公寓，套房，单元，大厦，楼层等"
            v-model.trim="addrForm.consigneeAddr"
          ></el-input>
        </el-form-item>
        <!-- 州/省/地区 必填-->
        <el-form-item label="州/省/地区" required>
          <!-- 级联选择 -->
          <el-col :span="10">
            <el-form-item prop="consigneeProvince">
              <el-select
                v-model="addrForm.consigneeProvince"
                placeholder="省份"
              >
                <el-option
                  v-for="item in frontData.province"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1" class="txtCenter">-</el-col>
          <el-col :span="10">
            <el-form-item prop="consigneeCity">
              <el-select v-model="addrForm.consigneeCity" placeholder="城市">
                <el-option
                  v-for="item in frontData.city"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- 手机区号 + 手机号 -->
        <el-form-item label="手机">
          <!-- select选择器+文本框 -->
          <el-col :span="6">
            <el-form-item prop="consigneePhoneHead">
              <el-select
                v-model="addrForm.consigneePhoneHead"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in frontData.conuntryOptions"
                  :key="index"
                  :label="item.tel"
                  :value="item.tel"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1" class="txtCenter">-</el-col>
          <el-col :span="17">
            <el-form-item prop="consigneePhone">
              <el-input
                type="tel"
                placeholder="请输入您的手机号码"
                v-model.trim="addrForm.consigneePhone"
                @input="checkInputValue('consigneePhone')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- 固定电话 -->
        <el-form-item label="固定电话">
          <!-- 下拉+文本框 -->
          <el-col :span="6">
            <el-form-item prop="consigneeTelHead">
              <el-select
                v-model="addrForm.consigneeTelHead"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in frontData.telCode"
                  :key="index"
                  :label="item.value"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1" class="txtCenter">-</el-col>
          <el-col :span="17">
            <el-form-item prop="consigneeTel">
              <el-input
                type="tel"
                placeholder="请输入您的固定电话"
                v-model.trim="addrForm.consigneeTel"
                @input="checkInputValue('consigneeTel')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <!-- 邮政编码 必填 -->
        <el-form-item label="邮政编码" class="zipCode" prop="consigneeZipCode">
          <!-- 文本框 -->
          <el-input
            type="text"
            placeholder="请输入邮政编码"
            v-model="addrForm.consigneeZipCode"
            @input="checkInputValue()"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <!-- 取消 -->
      <el-button type="info" size="medium" @click="dialogFormVisible = false"
        >取消</el-button
      >
      <!-- 确定 -->
      <el-button
        type="primary"
        size="medium"
        @click="saveAddrForm('addrFormRef')"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { addAddressList } from "@/utils/request";
export default {
  name: "AddressForm",
  props: {
    // 编辑表单时接收表单信息
    setAddrForm: {
      type: Object,
      required: false,
    },
  },
  // 数据
  data() {
    // 校验 手机号
    var checkPhone = (rule, value, callback) => {
      if (value && !/^\d{11}$/.test(value)) {
        return callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };
    // 校验 固定电话
    var checkTel = (rule, value, callback) => {
      if (!/^\d{7,8}$/.test(value)) {
        return callback(new Error("请输入正确的电话号码"));
      } else {
        callback();
      }
    };
    // 校验 邮编
    var checkZipCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入邮政编码"));
      } else {
        callback();
      }
    };

    return {
      // 页面参数
      dialogStatus: "", // 哪种弹窗 create:创建 edit:编辑
      dialogFormVisible: false, // 是否显示弹窗

      // 收货地址表单
      addrForm: {
        consigneeCountry: "", // 国家
        consigneeName: "", // 收货人名称
        consigneePhoneHead: "", // 手机区号
        consigneePhone: "", // 手机号
        consigneeTelHead: "", // 电话区号
        consigneeTel: "", // 电话号
        consigneeAddr: "", // 详细地址
        consigneeProvince: "", // 省/州/地区
        consigneeCity: "", // 地区
        consigneeZipCode: "", // 邮政编码
      },
      // 收货地址表单 校验规则
      addrFormRules: {
        // 国家
        consigneeCountry: [
          { required: true, message: "请选择国家", trigger: "change" },
        ],
        // 收货人
        consigneeName: [
          { required: true, message: "请输入收件人名称", trigger: "blur" },
        ],
        // 收货地址
        consigneeAddr: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        // 手机号头部
        consigneePhoneHead: [{ required: false, trigger: "change" }],
        // 手机号
        consigneePhone: [
          { required: false, validator: checkPhone, trigger: "blur" },
        ],
        // 电话号头部
        consigneeTelHead: [{ required: false, trigger: "change" }],
        // 电话号
        consigneeTel: [
          { required: false, validator: checkTel, trigger: "blur" },
        ],
        // 省份
        consigneeProvince: [
          {
            required: true,
            message: "请选择省份",
            trigger: "change",
          },
        ],
        // 市
        consigneeCity: [
          {
            required: true,
            message: "请选择市",
            trigger: "change",
          },
        ],
        // 邮编
        consigneeZipCode: [
          { required: true, validator: checkZipCode, trigger: "blur" },
        ],
      },
      // 省市区数据
      frontData: {
        // 国家
        conuntryOptions: [
          {
            short: "AD",
            name: "安道尔共和国",
            en: "Andorra",
            tel: "376",
          },
          {
            short: "AE",
            name: "阿拉伯联合酋长国",
            en: "UnitedArabEmirates",
            tel: "971",
          },
          {
            short: "AF",
            name: "阿富汗",
            en: "Afghanistan",
            tel: "93",
          },
          {
            short: "AG",
            name: "安提瓜和巴布达",
            en: "AntiguaandBarbuda",
            tel: "1268",
          },
          {
            short: "AI",
            name: "安圭拉岛",
            en: "Anguilla",
            tel: "1264",
          },
          {
            short: "AL",
            name: "阿尔巴尼亚",
            en: "Albania",
            tel: "355",
          },
          {
            short: "AM",
            name: "亚美尼亚",
            en: "Armenia",
            tel: "374",
          },
          {
            short: "",
            name: "阿森松",
            en: "Ascension",
            tel: "247",
          },
          {
            short: "AO",
            name: "安哥拉",
            en: "Angola",
            tel: "244",
          },
          {
            short: "AR",
            name: "阿根廷",
            en: "Argentina",
            tel: "54",
          },
          {
            short: "AT",
            name: "奥地利",
            en: "Austria",
            tel: "43",
          },
          {
            short: "AU",
            name: "澳大利亚",
            en: "Australia",
            tel: "61",
          },
          {
            short: "AZ",
            name: "阿塞拜疆",
            en: "Azerbaijan",
            tel: "994",
          },
          {
            short: "BB",
            name: "巴巴多斯",
            en: "Barbados",
            tel: "1246",
          },
          {
            short: "BD",
            name: "孟加拉国",
            en: "Bangladesh",
            tel: "880",
          },
          {
            short: "BE",
            name: "比利时",
            en: "Belgium",
            tel: "32",
          },
          {
            short: "BF",
            name: "布基纳法索",
            en: "Burkina-faso",
            tel: "226",
          },
          {
            short: "BG",
            name: "保加利亚",
            en: "Bulgaria",
            tel: "359",
          },
          {
            short: "BH",
            name: "巴林",
            en: "Bahrain",
            tel: "973",
          },
          {
            short: "BI",
            name: "布隆迪",
            en: "Burundi",
            tel: "257",
          },
          {
            short: "BJ",
            name: "贝宁",
            en: "Benin",
            tel: "229",
          },
          {
            short: "BL",
            name: "巴勒斯坦",
            en: "Palestine",
            tel: "970",
          },
          {
            short: "BM",
            name: "百慕大群岛",
            en: "BermudaIs.",
            tel: "1441",
          },
          {
            short: "BN",
            name: "文莱",
            en: "Brunei",
            tel: "673",
          },
          {
            short: "BO",
            name: "玻利维亚",
            en: "Bolivia",
            tel: "591",
          },
          {
            short: "BR",
            name: "巴西",
            en: "Brazil",
            tel: "55",
          },
          {
            short: "BS",
            name: "巴哈马",
            en: "Bahamas",
            tel: "1242",
          },
          {
            short: "BW",
            name: "博茨瓦纳",
            en: "Botswana",
            tel: "267",
          },
          {
            short: "BY",
            name: "白俄罗斯",
            en: "Belarus",
            tel: "375",
          },
          {
            short: "BZ",
            name: "伯利兹",
            en: "Belize",
            tel: "501",
          },
          {
            short: "CA",
            name: "加拿大",
            en: "Canada",
            tel: "1",
          },
          {
            short: "",
            name: "开曼群岛",
            en: "CaymanIs.",
            tel: "1345",
          },
          {
            short: "CF",
            name: "中非共和国",
            en: "CentralAfricanRepublic",
            tel: "236",
          },
          {
            short: "CG",
            name: "刚果",
            en: "Congo",
            tel: "242",
          },
          {
            short: "CH",
            name: "瑞士",
            en: "Switzerland",
            tel: "41",
          },
          {
            short: "CK",
            name: "库克群岛",
            en: "CookIs.",
            tel: "682",
          },
          {
            short: "CL",
            name: "智利",
            en: "Chile",
            tel: "56",
          },
          {
            short: "CM",
            name: "喀麦隆",
            en: "Cameroon",
            tel: "237",
          },
          {
            short: "CN",
            name: "中国",
            en: "China",
            tel: "86",
          },
          {
            short: "CO",
            name: "哥伦比亚",
            en: "Colombia",
            tel: "57",
          },
          {
            short: "CR",
            name: "哥斯达黎加",
            en: "CostaRica",
            tel: "506",
          },
          {
            short: "CS",
            name: "捷克",
            en: "Czech",
            tel: "420",
          },
          {
            short: "CU",
            name: "古巴",
            en: "Cuba",
            tel: "53",
          },
          {
            short: "CY",
            name: "塞浦路斯",
            en: "Cyprus",
            tel: "357",
          },
          {
            short: "CZ",
            name: "捷克",
            en: "CzechRepublic",
            tel: "420",
          },
          {
            short: "DE",
            name: "德国",
            en: "Germany",
            tel: "49",
          },
          {
            short: "DJ",
            name: "吉布提",
            en: "Djibouti",
            tel: "253",
          },
          {
            short: "DK",
            name: "丹麦",
            en: "Denmark",
            tel: "45",
          },
          {
            short: "DO",
            name: "多米尼加共和国",
            en: "DominicaRep.",
            tel: "1890",
          },
          {
            short: "DZ",
            name: "阿尔及利亚",
            en: "Algeria",
            tel: "213",
          },
          {
            short: "EC",
            name: "厄瓜多尔",
            en: "Ecuador",
            tel: "593",
          },
          {
            short: "EE",
            name: "爱沙尼亚",
            en: "Estonia",
            tel: "372",
          },
          {
            short: "EG",
            name: "埃及",
            en: "Egypt",
            tel: "20",
          },
          {
            short: "ES",
            name: "西班牙",
            en: "Spain",
            tel: "34",
          },
          {
            short: "ET",
            name: "埃塞俄比亚",
            en: "Ethiopia",
            tel: "251",
          },
          {
            short: "FI",
            name: "芬兰",
            en: "Finland",
            tel: "358",
          },
          {
            short: "FJ",
            name: "斐济",
            en: "Fiji",
            tel: "679",
          },
          {
            short: "FR",
            name: "法国",
            en: "France",
            tel: "33",
          },
          {
            short: "GA",
            name: "加蓬",
            en: "Gabon",
            tel: "241",
          },
          {
            short: "GB",
            name: "英国",
            en: "UnitedKiongdom",
            tel: "44",
          },
          {
            short: "GD",
            name: "格林纳达",
            en: "Grenada",
            tel: "1809",
          },
          {
            short: "GE",
            name: "格鲁吉亚",
            en: "Georgia",
            tel: "995",
          },
          {
            short: "GF",
            name: "法属圭亚那",
            en: "FrenchGuiana",
            tel: "594",
          },
          {
            short: "GH",
            name: "加纳",
            en: "Ghana",
            tel: "233",
          },
          {
            short: "GI",
            name: "直布罗陀",
            en: "Gibraltar",
            tel: "350",
          },
          {
            short: "GM",
            name: "冈比亚",
            en: "Gambia",
            tel: "220",
          },
          {
            short: "GN",
            name: "几内亚",
            en: "Guinea",
            tel: "224",
          },
          {
            short: "GR",
            name: "希腊",
            en: "Greece",
            tel: "30",
          },
          {
            short: "GT",
            name: "危地马拉",
            en: "Guatemala",
            tel: "502",
          },
          {
            short: "GU",
            name: "关岛",
            en: "Guam",
            tel: "1671",
          },
          {
            short: "GY",
            name: "圭亚那",
            en: "Guyana",
            tel: "592",
          },
          {
            short: "HK",
            name: "香港特别行政区",
            en: "Hongkong",
            tel: "852",
          },
          {
            short: "HN",
            name: "洪都拉斯",
            en: "Honduras",
            tel: "504",
          },
          {
            short: "HT",
            name: "海地",
            en: "Haiti",
            tel: "509",
          },
          {
            short: "HU",
            name: "匈牙利",
            en: "Hungary",
            tel: "36",
          },
          {
            short: "ID",
            name: "印度尼西亚",
            en: "Indonesia",
            tel: "62",
          },
          {
            short: "IE",
            name: "爱尔兰",
            en: "Ireland",
            tel: "353",
          },
          {
            short: "IL",
            name: "以色列",
            en: "Israel",
            tel: "972",
          },
          {
            short: "IN",
            name: "印度",
            en: "India",
            tel: "91",
          },
          {
            short: "IQ",
            name: "伊拉克",
            en: "Iraq",
            tel: "964",
          },
          {
            short: "IR",
            name: "伊朗",
            en: "Iran",
            tel: "98",
          },
          {
            short: "IS",
            name: "冰岛",
            en: "Iceland",
            tel: "354",
          },
          {
            short: "IT",
            name: "意大利",
            en: "Italy",
            tel: "39",
          },
          {
            short: "",
            name: "科特迪瓦",
            en: "IvoryCoast",
            tel: "225",
          },
          {
            short: "JM",
            name: "牙买加",
            en: "Jamaica",
            tel: "1876",
          },
          {
            short: "JO",
            name: "约旦",
            en: "Jordan",
            tel: "962",
          },
          {
            short: "JP",
            name: "日本",
            en: "Japan",
            tel: "81",
          },
          {
            short: "KE",
            name: "肯尼亚",
            en: "Kenya",
            tel: "254",
          },
          {
            short: "KG",
            name: "吉尔吉斯坦",
            en: "Kyrgyzstan",
            tel: "331",
          },
          {
            short: "KH",
            name: "柬埔寨",
            en: "Kampuchea(Cambodia)",
            tel: "855",
          },
          {
            short: "KP",
            name: "朝鲜",
            en: "NorthKorea",
            tel: "850",
          },
          {
            short: "KR",
            name: "韩国",
            en: "Korea",
            tel: "82",
          },
          {
            short: "KT",
            name: "科特迪瓦共和国",
            en: "RepublicofIvoryCoast",
            tel: "225",
          },
          {
            short: "KW",
            name: "科威特",
            en: "Kuwait",
            tel: "965",
          },
          {
            short: "KZ",
            name: "哈萨克斯坦",
            en: "Kazakstan",
            tel: "327",
          },
          {
            short: "LA",
            name: "老挝",
            en: "Laos",
            tel: "856",
          },
          {
            short: "LB",
            name: "黎巴嫩",
            en: "Lebanon",
            tel: "961",
          },
          {
            short: "LC",
            name: "圣卢西亚",
            en: "St.Lucia",
            tel: "1758",
          },
          {
            short: "LI",
            name: "列支敦士登",
            en: "Liechtenstein",
            tel: "423",
          },
          {
            short: "LK",
            name: "斯里兰卡",
            en: "SriLanka",
            tel: "94",
          },
          {
            short: "LR",
            name: "利比里亚",
            en: "Liberia",
            tel: "231",
          },
          {
            short: "LS",
            name: "莱索托",
            en: "Lesotho",
            tel: "266",
          },
          {
            short: "LT",
            name: "立陶宛",
            en: "Lithuania",
            tel: "370",
          },
          {
            short: "LU",
            name: "卢森堡",
            en: "Luxembourg",
            tel: "352",
          },
          {
            short: "LV",
            name: "拉脱维亚",
            en: "Latvia",
            tel: "371",
          },
          {
            short: "LY",
            name: "利比亚",
            en: "Libya",
            tel: "218",
          },
          {
            short: "MA",
            name: "摩洛哥",
            en: "Morocco",
            tel: "212",
          },
          {
            short: "MC",
            name: "摩纳哥",
            en: "Monaco",
            tel: "377",
          },
          {
            short: "MD",
            name: "摩尔多瓦",
            en: "Moldova,Republicof",
            tel: "373",
          },
          {
            short: "MG",
            name: "马达加斯加",
            en: "Madagascar",
            tel: "261",
          },
          {
            short: "ML",
            name: "马里",
            en: "Mali",
            tel: "223",
          },
          {
            short: "MM",
            name: "缅甸",
            en: "Burma",
            tel: "95",
          },
          {
            short: "MN",
            name: "蒙古",
            en: "Mongolia",
            tel: "976",
          },
          {
            short: "MO",
            name: "澳门",
            en: "Macao",
            tel: "853",
          },
          {
            short: "MS",
            name: "蒙特塞拉特岛",
            en: "MontserratIs",
            tel: "1664",
          },
          {
            short: "MT",
            name: "马耳他",
            en: "Malta",
            tel: "356",
          },
          {
            short: "",
            name: "马里亚那群岛",
            en: "MarianaIs",
            tel: "1670",
          },
          {
            short: "",
            name: "马提尼克",
            en: "Martinique",
            tel: "596",
          },
          {
            short: "MU",
            name: "毛里求斯",
            en: "Mauritius",
            tel: "230",
          },
          {
            short: "MV",
            name: "马尔代夫",
            en: "Maldives",
            tel: "960",
          },
          {
            short: "MW",
            name: "马拉维",
            en: "Malawi",
            tel: "265",
          },
          {
            short: "MX",
            name: "墨西哥",
            en: "Mexico",
            tel: "52",
          },
          {
            short: "MY",
            name: "马来西亚",
            en: "Malaysia",
            tel: "60",
          },
          {
            short: "MZ",
            name: "莫桑比克",
            en: "Mozambique",
            tel: "258",
          },
          {
            short: "NA",
            name: "纳米比亚",
            en: "Namibia",
            tel: "264",
          },
          {
            short: "NE",
            name: "尼日尔",
            en: "Niger",
            tel: "977",
          },
          {
            short: "NG",
            name: "尼日利亚",
            en: "Nigeria",
            tel: "234",
          },
          {
            short: "NI",
            name: "尼加拉瓜",
            en: "Nicaragua",
            tel: "505",
          },
          {
            short: "NL",
            name: "荷兰",
            en: "Netherlands",
            tel: "31",
          },
          {
            short: "NO",
            name: "挪威",
            en: "Norway",
            tel: "47",
          },
          {
            short: "NP",
            name: "尼泊尔",
            en: "Nepal",
            tel: "977",
          },
          {
            short: "",
            name: "荷属安的列斯",
            en: "NetheriandsAntilles",
            tel: "599",
          },
          {
            short: "NR",
            name: "瑙鲁",
            en: "Nauru",
            tel: "674",
          },
          {
            short: "NZ",
            name: "新西兰",
            en: "NewZealand",
            tel: "64",
          },
          {
            short: "OM",
            name: "阿曼",
            en: "Oman",
            tel: "968",
          },
          {
            short: "PA",
            name: "巴拿马",
            en: "Panama",
            tel: "507",
          },
          {
            short: "PE",
            name: "秘鲁",
            en: "Peru",
            tel: "51",
          },
          {
            short: "PF",
            name: "法属玻利尼西亚",
            en: "FrenchPolynesia",
            tel: "689",
          },
          {
            short: "PG",
            name: "巴布亚新几内亚",
            en: "PapuaNewCuinea",
            tel: "675",
          },
          {
            short: "PH",
            name: "菲律宾",
            en: "Philippines",
            tel: "63",
          },
          {
            short: "PK",
            name: "巴基斯坦",
            en: "Pakistan",
            tel: "92",
          },
          {
            short: "PL",
            name: "波兰",
            en: "Poland",
            tel: "48",
          },
          {
            short: "PR",
            name: "波多黎各",
            en: "PuertoRico",
            tel: "1787",
          },
          {
            short: "PT",
            name: "葡萄牙",
            en: "Portugal",
            tel: "351",
          },
          {
            short: "PY",
            name: "巴拉圭",
            en: "Paraguay",
            tel: "595",
          },
          {
            short: "QA",
            name: "卡塔尔",
            en: "Qatar",
            tel: "974",
          },
          {
            short: "",
            name: "留尼旺",
            en: "Reunion",
            tel: "262",
          },
          {
            short: "RO",
            name: "罗马尼亚",
            en: "Romania",
            tel: "40",
          },
          {
            short: "RU",
            name: "俄罗斯",
            en: "Russia",
            tel: "7",
          },
          {
            short: "SA",
            name: "沙特阿拉伯",
            en: "SaudiArabia",
            tel: "966",
          },
          {
            short: "SB",
            name: "所罗门群岛",
            en: "SolomonIs",
            tel: "677",
          },
          {
            short: "SC",
            name: "塞舌尔",
            en: "Seychelles",
            tel: "248",
          },
          {
            short: "SD",
            name: "苏丹",
            en: "Sudan",
            tel: "249",
          },
          {
            short: "SE",
            name: "瑞典",
            en: "Sweden",
            tel: "46",
          },
          {
            short: "SG",
            name: "新加坡",
            en: "Singapore",
            tel: "65",
          },
          {
            short: "SI",
            name: "斯洛文尼亚",
            en: "Slovenia",
            tel: "386",
          },
          {
            short: "SK",
            name: "斯洛伐克",
            en: "Slovakia",
            tel: "421",
          },
          {
            short: "SL",
            name: "塞拉利昂",
            en: "SierraLeone",
            tel: "232",
          },
          {
            short: "SM",
            name: "圣马力诺",
            en: "SanMarino",
            tel: "378",
          },
          {
            short: "",
            name: "东萨摩亚(美)",
            en: "SamoaEastern",
            tel: "684",
          },
          {
            short: "",
            name: "西萨摩亚",
            en: "SanMarino",
            tel: "685",
          },
          {
            short: "SN",
            name: "塞内加尔",
            en: "Senegal",
            tel: "221",
          },
          {
            short: "SO",
            name: "索马里",
            en: "Somali",
            tel: "252",
          },
          {
            short: "SR",
            name: "苏里南",
            en: "Suriname",
            tel: "597",
          },
          {
            short: "ST",
            name: "圣多美和普林西比",
            en: "SaoTomeandPrincipe",
            tel: "239",
          },
          {
            short: "SV",
            name: "萨尔瓦多",
            en: "EISalvador",
            tel: "503",
          },
          {
            short: "SY",
            name: "叙利亚",
            en: "Syria",
            tel: "963",
          },
          {
            short: "SZ",
            name: "斯威士兰",
            en: "Swaziland",
            tel: "268",
          },
          {
            short: "TD",
            name: "乍得",
            en: "Chad",
            tel: "235",
          },
          {
            short: "TG",
            name: "多哥",
            en: "Togo",
            tel: "228",
          },
          {
            short: "TH",
            name: "泰国",
            en: "Thailand",
            tel: "66",
          },
          {
            short: "TJ",
            name: "塔吉克斯坦",
            en: "Tajikstan",
            tel: "992",
          },
          {
            short: "TM",
            name: "土库曼斯坦",
            en: "Turkmenistan",
            tel: "993",
          },
          {
            short: "TN",
            name: "突尼斯",
            en: "Tunisia",
            tel: "216",
          },
          {
            short: "TO",
            name: "汤加",
            en: "Tonga",
            tel: "676",
          },
          {
            short: "TR",
            name: "土耳其",
            en: "Turkey",
            tel: "90",
          },
          {
            short: "TT",
            name: "特立尼达和多巴哥",
            en: "TrinidadandTobago",
            tel: "1809",
          },
          {
            short: "TW",
            name: "台湾省",
            en: "Taiwan",
            tel: "886",
          },
          {
            short: "TZ",
            name: "坦桑尼亚",
            en: "Tanzania",
            tel: "255",
          },
          {
            short: "UA",
            name: "乌克兰",
            en: "Ukraine",
            tel: "380",
          },
          {
            short: "UG",
            name: "乌干达",
            en: "Uganda",
            tel: "256",
          },
          {
            short: "US",
            name: "美国",
            en: "UnitedStatesofAmerica",
            tel: "1",
          },
          {
            short: "UY",
            name: "乌拉圭",
            en: "Uruguay",
            tel: "598",
          },
          {
            short: "UZ",
            name: "乌兹别克斯坦",
            en: "Uzbekistan",
            tel: "233",
          },
          {
            short: "VC",
            name: "圣文森特岛",
            en: "SaintVincent",
            tel: "1784",
          },
          {
            short: "VE",
            name: "委内瑞拉",
            en: "Venezuela",
            tel: "58",
          },
          {
            short: "VN",
            name: "越南",
            en: "Vietnam",
            tel: "84",
          },
          {
            short: "YE",
            name: "也门",
            en: "Yemen",
            tel: "967",
          },
          {
            short: "YU",
            name: "南斯拉夫",
            en: "Yugoslavia",
            tel: "381",
          },
          {
            short: "ZA",
            name: "南非",
            en: "SouthAfrica",
            tel: "27",
          },
          {
            short: "ZM",
            name: "赞比亚",
            en: "Zambia",
            tel: "260",
          },
          {
            short: "ZR",
            name: "扎伊尔",
            en: "Zaire",
            tel: "243",
          },
          {
            short: "ZW",
            name: "津巴布韦",
            en: "Zimbabwe",
            tel: "263",
          },
        ],

        // 省
        province: [
          {
            id: 8,
            value: "河南省",
          },
          {
            id: 456,
            value: "河北省",
          },
        ],
        // 市
        city: [
          {
            id: 3245,
            value: "新乡市",
          },
          {
            id: 3456768,
            value: "郑州市",
          },
        ],
        // 手机区号
        phoneCode: [
          {
            id: 12,
            value: "+86",
          },
          {
            id: 13,
            value: "+87",
          },
        ],
        // 电话区号
        telCode: [
          {
            id: 123245,
            value: "0086",
          },
          {
            id: 14234253,
            value: "0087",
          },
        ],
      },
    };
  },
  // 方法
  methods: {
    /**
     * 弹窗打开前
     * 1. 是否有接收到值, 且是否为 编辑
     * 2. 都为true, 则给表单赋值
     */
    handleOpen() {
      if (this.setAddrForm && this.dialogStatus === "edit") {
        this.addrForm = this.setAddrForm;
      }
    },
    // 确定
    async saveAddrForm(formName) {
      /**
       * 1. 表单预校验
       * 2. 校验通过,
       * 3. 是否有id,且是编辑eidt, 得到参数
       * 4. 发送请求
       * 5. 关闭弹窗
       * 6. 派发给父组件一个事件
       */
      // try {
      //   const result = await this.$refs[formName].validate();
      //   if (!result) return;
      //   // 发送请求
      //   // const res = await this.$http('url',this.addrForm)
      //   this.dialogFormVisible = false; // 关闭弹窗
      //   this.$emit("confirm", this.addrForm, this.dialogStatus); // 传出去表单对象 + 哪种表单
      // } catch (error) {
      //   console.log(error);
      // }
      const data = {
        consigneeCountry: "中国",
        consigneeAddr: "详细地址",
        consigneeProvince: "河南省",
        consigneeCity: "郑州市",

        consigneeCounty: "县",
        consigneeName: "我是收货人",
        consigneePhone: "18336908347",
        consigneePhoneHead: "0086",
        consigneeTel: "6769038",
        consigneeTelHead: "8633",
        consigneeZipCode: "453600",
        receiverTitle: "新增",
      };
      const result = await addAddressList(data);
      console.log(result);
   
    },
    // 弹窗关闭
    dialogClose() {
      this.$refs.addrFormRef.resetFields(); // 重置表单
    },
    // 检验只能输入数字
    checkInputValue(typeName) {
      this.addrForm[typeName] = this.addrForm[typeName].replace(/[^\d]/g, ""); // 只能输入数字
    },
  },
};
</script>

<style scoped lang="scss">
.txtCenter {
  text-align: center;
}
.zipCode {
  margin-bottom: 0;
}
</style>
