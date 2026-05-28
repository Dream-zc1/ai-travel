export interface ChinaCity {
  id: string;
  name: string;
  lat: number;
  lng: number;
  level: "province" | "prefecture";
}

// WGS-84 coordinates for Chinese cities
export const chineseCities: ChinaCity[] = [
  // --- 直辖市 ---
  { id: "beijing", name: "北京", lat: 39.9042, lng: 116.4074, level: "province" },
  { id: "shanghai", name: "上海", lat: 31.2304, lng: 121.4737, level: "province" },
  { id: "tianjin", name: "天津", lat: 39.1252, lng: 117.1908, level: "province" },
  { id: "chongqing", name: "重庆", lat: 29.4316, lng: 106.9123, level: "province" },

  // --- 河北 ---
  { id: "shijiazhuang", name: "石家庄", lat: 38.0428, lng: 114.5149, level: "province" },
  { id: "tangshan", name: "唐山", lat: 39.6309, lng: 118.1802, level: "prefecture" },
  { id: "qinhuangdao", name: "秦皇岛", lat: 39.9255, lng: 119.5997, level: "prefecture" },
  { id: "handan", name: "邯郸", lat: 36.6256, lng: 114.5391, level: "prefecture" },
  { id: "baoding", name: "保定", lat: 38.8739, lng: 115.4646, level: "prefecture" },
  { id: "chengde", name: "承德", lat: 40.9515, lng: 117.9634, level: "prefecture" },
  { id: "zhangjiakou", name: "张家口", lat: 40.7691, lng: 114.8863, level: "prefecture" },
  { id: "langfang", name: "廊坊", lat: 39.5380, lng: 116.6838, level: "prefecture" },

  // --- 山西 ---
  { id: "taiyuan", name: "太原", lat: 37.8706, lng: 112.5489, level: "province" },
  { id: "datong", name: "大同", lat: 40.0768, lng: 113.3001, level: "prefecture" },
  { id: "linfen", name: "临汾", lat: 36.0882, lng: 111.5193, level: "prefecture" },
  { id: "yuncheng", name: "运城", lat: 35.0174, lng: 111.0070, level: "prefecture" },
  { id: "jinzhong", name: "晋中", lat: 37.6870, lng: 112.7528, level: "prefecture" },
  { id: "changzhi", name: "长治", lat: 36.1954, lng: 113.1163, level: "prefecture" },

  // --- 内蒙古 ---
  { id: "hohhot", name: "呼和浩特", lat: 40.8422, lng: 111.7492, level: "province" },
  { id: "baotou", name: "包头", lat: 40.6214, lng: 109.9535, level: "prefecture" },
  { id: "chifeng", name: "赤峰", lat: 42.2568, lng: 118.8869, level: "prefecture" },
  { id: "eerduosi", name: "鄂尔多斯", lat: 39.6085, lng: 109.7814, level: "prefecture" },
  { id: "hulunbuir", name: "呼伦贝尔", lat: 49.2120, lng: 119.7608, level: "prefecture" },

  // --- 辽宁 ---
  { id: "shenyang", name: "沈阳", lat: 41.8057, lng: 123.4315, level: "province" },
  { id: "dalian", name: "大连", lat: 38.9140, lng: 121.6147, level: "prefecture" },
  { id: "anshan", name: "鞍山", lat: 41.1078, lng: 122.9945, level: "prefecture" },
  { id: "fushun", name: "抚顺", lat: 41.8811, lng: 123.9572, level: "prefecture" },
  { id: "jinzhou", name: "锦州", lat: 41.0952, lng: 121.1270, level: "prefecture" },
  { id: "dandong", name: "丹东", lat: 40.1292, lng: 124.3833, level: "prefecture" },

  // --- 吉林 ---
  { id: "changchun", name: "长春", lat: 43.8868, lng: 125.3245, level: "province" },
  { id: "jilin", name: "吉林", lat: 43.8378, lng: 126.5495, level: "prefecture" },
  { id: "yanji", name: "延吉", lat: 42.9068, lng: 129.5090, level: "prefecture" },
  { id: "siping", name: "四平", lat: 43.1704, lng: 124.3504, level: "prefecture" },

  // --- 黑龙江 ---
  { id: "haerbin", name: "哈尔滨", lat: 45.8038, lng: 126.5350, level: "province" },
  { id: "daqing", name: "大庆", lat: 46.5967, lng: 125.1040, level: "prefecture" },
  { id: "mudanjiang", name: "牡丹江", lat: 44.5517, lng: 129.6324, level: "prefecture" },
  { id: "jiamusi", name: "佳木斯", lat: 46.7999, lng: 130.3193, level: "prefecture" },
  { id: "qiqihaer", name: "齐齐哈尔", lat: 47.3543, lng: 123.9182, level: "prefecture" },

  // --- 江苏 ---
  { id: "nanjing", name: "南京", lat: 32.0603, lng: 118.7969, level: "province" },
  { id: "suzhou_js", name: "苏州", lat: 31.2990, lng: 120.5853, level: "prefecture" },
  { id: "wuxi", name: "无锡", lat: 31.4912, lng: 120.3119, level: "prefecture" },
  { id: "changzhou", name: "常州", lat: 31.7712, lng: 119.9737, level: "prefecture" },
  { id: "nantong", name: "南通", lat: 32.0147, lng: 120.8937, level: "prefecture" },
  { id: "xuzhou", name: "徐州", lat: 34.2700, lng: 117.2017, level: "prefecture" },
  { id: "yangzhou", name: "扬州", lat: 32.3939, lng: 119.4143, level: "prefecture" },
  { id: "zhenjiang", name: "镇江", lat: 32.2044, lng: 119.4558, level: "prefecture" },
  { id: "yancheng", name: "盐城", lat: 33.3505, lng: 120.1632, level: "prefecture" },

  // --- 浙江 ---
  { id: "hangzhou", name: "杭州", lat: 30.2741, lng: 120.1551, level: "province" },
  { id: "ningbo", name: "宁波", lat: 29.8683, lng: 121.5440, level: "prefecture" },
  { id: "wenzhou", name: "温州", lat: 27.9943, lng: 120.6994, level: "prefecture" },
  { id: "shaoxing", name: "绍兴", lat: 30.0300, lng: 120.5802, level: "prefecture" },
  { id: "jiaxing", name: "嘉兴", lat: 30.7730, lng: 120.7551, level: "prefecture" },
  { id: "jinhua", name: "金华", lat: 29.0792, lng: 119.6474, level: "prefecture" },
  { id: "taizhou_zj", name: "台州", lat: 28.6564, lng: 121.4208, level: "prefecture" },
  { id: "huzhou", name: "湖州", lat: 30.8933, lng: 120.0882, level: "prefecture" },
  { id: "zhoushan", name: "舟山", lat: 30.0164, lng: 122.2072, level: "prefecture" },

  // --- 安徽 ---
  { id: "hefei", name: "合肥", lat: 31.8206, lng: 117.2272, level: "province" },
  { id: "wuhu", name: "芜湖", lat: 31.3529, lng: 118.4332, level: "prefecture" },
  { id: "huangshan", name: "黄山", lat: 29.7152, lng: 118.3375, level: "prefecture" },
  { id: "anqing", name: "安庆", lat: 30.5319, lng: 117.0488, level: "prefecture" },
  { id: "bengbu", name: "蚌埠", lat: 32.9165, lng: 117.3892, level: "prefecture" },
  { id: "fuyang", name: "阜阳", lat: 32.8901, lng: 115.8203, level: "prefecture" },

  // --- 福建 ---
  { id: "fuzhou", name: "福州", lat: 26.0745, lng: 119.2965, level: "province" },
  { id: "xiamen", name: "厦门", lat: 24.4798, lng: 118.0894, level: "prefecture" },
  { id: "quanzhou", name: "泉州", lat: 24.8744, lng: 118.6022, level: "prefecture" },
  { id: "zhangzhou", name: "漳州", lat: 24.5135, lng: 117.6471, level: "prefecture" },
  { id: "putian", name: "莆田", lat: 25.4540, lng: 119.0078, level: "prefecture" },
  { id: "wuyishan", name: "武夷山", lat: 27.7563, lng: 118.0327, level: "prefecture" },

  // --- 江西 ---
  { id: "nanchang", name: "南昌", lat: 28.6829, lng: 115.8582, level: "province" },
  { id: "jiujiang", name: "九江", lat: 29.7051, lng: 115.9990, level: "prefecture" },
  { id: "jingdezhen", name: "景德镇", lat: 29.2689, lng: 117.1847, level: "prefecture" },
  { id: "ganzhou", name: "赣州", lat: 25.8311, lng: 114.9350, level: "prefecture" },
  { id: "shangrao", name: "上饶", lat: 28.4530, lng: 117.9436, level: "prefecture" },
  { id: "lushan", name: "庐山", lat: 29.4568, lng: 115.9928, level: "prefecture" },

  // --- 山东 ---
  { id: "jinan", name: "济南", lat: 36.6512, lng: 117.1201, level: "province" },
  { id: "qingdao", name: "青岛", lat: 36.0671, lng: 120.3826, level: "prefecture" },
  { id: "yantai", name: "烟台", lat: 37.4635, lng: 121.4479, level: "prefecture" },
  { id: "weifang", name: "潍坊", lat: 36.7068, lng: 119.1618, level: "prefecture" },
  { id: "linyi", name: "临沂", lat: 35.0518, lng: 118.3565, level: "prefecture" },
  { id: "jining", name: "济宁", lat: 35.4147, lng: 116.5872, level: "prefecture" },
  { id: "zibo", name: "淄博", lat: 36.8135, lng: 118.0549, level: "prefecture" },
  { id: "weihai", name: "威海", lat: 37.5226, lng: 122.1216, level: "prefecture" },
  { id: "taian", name: "泰安", lat: 36.2003, lng: 117.0886, level: "prefecture" },
  { id: "rizhao", name: "日照", lat: 35.4167, lng: 119.5269, level: "prefecture" },
  { id: "qufu", name: "曲阜", lat: 35.5809, lng: 116.9865, level: "prefecture" },

  // --- 河南 ---
  { id: "zhengzhou", name: "郑州", lat: 34.7466, lng: 113.6253, level: "province" },
  { id: "luoyang", name: "洛阳", lat: 34.6181, lng: 112.4540, level: "prefecture" },
  { id: "kaifeng", name: "开封", lat: 34.7973, lng: 114.3073, level: "prefecture" },
  { id: "nanyang", name: "南阳", lat: 33.0128, lng: 112.5288, level: "prefecture" },
  { id: "anyang", name: "安阳", lat: 36.0974, lng: 114.3933, level: "prefecture" },
  { id: "xinxiang", name: "新乡", lat: 35.3030, lng: 113.9268, level: "prefecture" },
  { id: "xuchang", name: "许昌", lat: 34.0270, lng: 113.8526, level: "prefecture" },

  // --- 湖北 ---
  { id: "wuhan", name: "武汉", lat: 30.5928, lng: 114.3055, level: "province" },
  { id: "yichang", name: "宜昌", lat: 30.6919, lng: 111.2864, level: "prefecture" },
  { id: "xiangyang", name: "襄阳", lat: 32.0092, lng: 112.1236, level: "prefecture" },
  { id: "jingzhou", name: "荆州", lat: 30.3348, lng: 112.2419, level: "prefecture" },
  { id: "shiyan", name: "十堰", lat: 32.6292, lng: 110.7978, level: "prefecture" },
  { id: "wudangshan", name: "武当山", lat: 32.4005, lng: 111.0013, level: "prefecture" },

  // --- 湖南 ---
  { id: "changsha", name: "长沙", lat: 28.2282, lng: 112.9388, level: "province" },
  { id: "zhangjiajie", name: "张家界", lat: 29.3412, lng: 110.4813, level: "prefecture" },
  { id: "yueyang", name: "岳阳", lat: 29.3714, lng: 113.1290, level: "prefecture" },
  { id: "hengyang", name: "衡阳", lat: 26.8932, lng: 112.5720, level: "prefecture" },
  { id: "xiangtan", name: "湘潭", lat: 27.8326, lng: 112.9440, level: "prefecture" },
  { id: "zhuzhou", name: "株洲", lat: 27.8279, lng: 113.1329, level: "prefecture" },
  { id: "changde", name: "常德", lat: 29.0317, lng: 111.6985, level: "prefecture" },
  { id: "fenghuang", name: "凤凰", lat: 27.9482, lng: 109.5996, level: "prefecture" },

  // --- 广东 ---
  { id: "guangzhou", name: "广州", lat: 23.1291, lng: 113.2644, level: "province" },
  { id: "shenzhen", name: "深圳", lat: 22.5431, lng: 114.0579, level: "prefecture" },
  { id: "zhuhai", name: "珠海", lat: 22.2710, lng: 113.5767, level: "prefecture" },
  { id: "dongguan", name: "东莞", lat: 23.0207, lng: 113.7518, level: "prefecture" },
  { id: "foshan", name: "佛山", lat: 23.0219, lng: 113.1215, level: "prefecture" },
  { id: "zhongshan", name: "中山", lat: 22.5190, lng: 113.3928, level: "prefecture" },
  { id: "huizhou", name: "惠州", lat: 23.0988, lng: 114.4168, level: "prefecture" },
  { id: "shantou", name: "汕头", lat: 23.3545, lng: 116.6822, level: "prefecture" },
  { id: "zhanjiang", name: "湛江", lat: 21.2706, lng: 110.3594, level: "prefecture" },
  { id: "shaoguan", name: "韶关", lat: 24.8104, lng: 113.5975, level: "prefecture" },

  // --- 广西 ---
  { id: "nanning", name: "南宁", lat: 22.8170, lng: 108.3665, level: "province" },
  { id: "guilin", name: "桂林", lat: 25.2345, lng: 110.1798, level: "prefecture" },
  { id: "beihai", name: "北海", lat: 21.4813, lng: 109.1201, level: "prefecture" },
  { id: "liuzhou", name: "柳州", lat: 24.3263, lng: 109.4281, level: "prefecture" },
  { id: "yangshuo", name: "阳朔", lat: 24.7785, lng: 110.4967, level: "prefecture" },

  // --- 海南 ---
  { id: "haikou", name: "海口", lat: 20.0440, lng: 110.3312, level: "province" },
  { id: "sanya", name: "三亚", lat: 18.2525, lng: 109.5119, level: "prefecture" },

  // --- 四川 ---
  { id: "chengdu", name: "成都", lat: 30.5728, lng: 104.0668, level: "province" },
  { id: "jiuzhaigou", name: "九寨沟", lat: 33.2598, lng: 104.2365, level: "prefecture" },
  { id: "leshan", name: "乐山", lat: 29.5519, lng: 103.7614, level: "prefecture" },
  { id: "mianyang", name: "绵阳", lat: 31.4675, lng: 104.6797, level: "prefecture" },
  { id: "yibin", name: "宜宾", lat: 28.7695, lng: 104.6432, level: "prefecture" },
  { id: "luzhou", name: "泸州", lat: 28.8721, lng: 105.4426, level: "prefecture" },
  { id: "dujiangyan", name: "都江堰", lat: 31.0030, lng: 103.6477, level: "prefecture" },
  { id: "emeishan", name: "峨眉山", lat: 29.6012, lng: 103.4845, level: "prefecture" },

  // --- 贵州 ---
  { id: "guiyang", name: "贵阳", lat: 26.6470, lng: 106.6302, level: "province" },
  { id: "zunyi", name: "遵义", lat: 27.6942, lng: 106.9073, level: "prefecture" },
  { id: "anshun", name: "安顺", lat: 26.2542, lng: 105.9433, level: "prefecture" },
  { id: "kaili", name: "凯里", lat: 26.5644, lng: 107.9819, level: "prefecture" },
  { id: "huangguoshu", name: "黄果树", lat: 25.9961, lng: 105.6639, level: "prefecture" },

  // --- 云南 ---
  { id: "kunming", name: "昆明", lat: 25.0389, lng: 102.7183, level: "province" },
  { id: "dali", name: "大理", lat: 25.5916, lng: 100.2300, level: "prefecture" },
  { id: "lijiang", name: "丽江", lat: 26.8721, lng: 100.2299, level: "prefecture" },
  { id: "shangrila", name: "香格里拉", lat: 27.8270, lng: 99.7069, level: "prefecture" },
  { id: "jinghong", name: "西双版纳", lat: 22.0067, lng: 100.7983, level: "prefecture" },
  { id: "tengchong", name: "腾冲", lat: 25.0265, lng: 98.4940, level: "prefecture" },
  { id: "yuanyang", name: "元阳", lat: 23.2197, lng: 102.8356, level: "prefecture" },

  // --- 西藏 ---
  { id: "lhasa", name: "拉萨", lat: 29.6500, lng: 91.1000, level: "province" },
  { id: "shigatse", name: "日喀则", lat: 29.2550, lng: 88.8915, level: "prefecture" },
  { id: "nyingchi", name: "林芝", lat: 29.6488, lng: 94.3610, level: "prefecture" },

  // --- 陕西 ---
  { id: "xian", name: "西安", lat: 34.2608, lng: 108.9420, level: "province" },
  { id: "baoji", name: "宝鸡", lat: 34.3619, lng: 107.2373, level: "prefecture" },
  { id: "xianyang", name: "咸阳", lat: 34.3294, lng: 108.7091, level: "prefecture" },
  { id: "yanan", name: "延安", lat: 36.6035, lng: 109.4908, level: "prefecture" },
  { id: "hanzhong", name: "汉中", lat: 33.0677, lng: 107.0232, level: "prefecture" },
  { id: "huashan", name: "华山", lat: 34.4700, lng: 110.0850, level: "prefecture" },

  // --- 甘肃 ---
  { id: "lanzhou", name: "兰州", lat: 36.0611, lng: 103.8343, level: "province" },
  { id: "dunhuang", name: "敦煌", lat: 40.1412, lng: 94.6620, level: "prefecture" },
  { id: "jiuquan", name: "酒泉", lat: 39.7444, lng: 98.5004, level: "prefecture" },
  { id: "tianshui", name: "天水", lat: 34.5799, lng: 105.7250, level: "prefecture" },
  { id: "jiayuguan", name: "嘉峪关", lat: 39.7726, lng: 98.2895, level: "prefecture" },
  { id: "zhangye", name: "张掖", lat: 38.9253, lng: 100.4548, level: "prefecture" },

  // --- 青海 ---
  { id: "xining", name: "西宁", lat: 36.6175, lng: 101.7782, level: "province" },
  { id: "geermu", name: "格尔木", lat: 36.4024, lng: 94.8967, level: "prefecture" },
  { id: "qinghaihu", name: "青海湖", lat: 36.8521, lng: 100.7828, level: "prefecture" },

  // --- 宁夏 ---
  { id: "yinchuan", name: "银川", lat: 38.4872, lng: 106.2309, level: "province" },
  { id: "zhongwei", name: "中卫", lat: 37.5141, lng: 105.1968, level: "prefecture" },

  // --- 新疆 ---
  { id: "urumqi", name: "乌鲁木齐", lat: 43.8256, lng: 87.6168, level: "province" },
  { id: "turpan", name: "吐鲁番", lat: 42.9514, lng: 89.1896, level: "prefecture" },
  { id: "kashgar", name: "喀什", lat: 39.4691, lng: 75.9957, level: "prefecture" },
  { id: "yining", name: "伊宁", lat: 43.9094, lng: 81.3254, level: "prefecture" },
  { id: "karamay", name: "克拉玛依", lat: 45.5867, lng: 84.8813, level: "prefecture" },
  { id: "tianshan", name: "天山", lat: 43.0111, lng: 88.0713, level: "prefecture" },

  // --- 港澳台 ---
  { id: "hongkong", name: "香港", lat: 22.3193, lng: 114.1694, level: "province" },
  { id: "macau", name: "澳门", lat: 22.1987, lng: 113.5439, level: "province" },
  { id: "taipei", name: "台北", lat: 25.0330, lng: 121.5654, level: "province" },
  { id: "taizhong", name: "台中", lat: 24.1477, lng: 120.6736, level: "prefecture" },
  { id: "gaoxiong", name: "高雄", lat: 22.6273, lng: 120.3014, level: "prefecture" },
  { id: "hualien", name: "花莲", lat: 23.9921, lng: 121.6043, level: "prefecture" },
];
