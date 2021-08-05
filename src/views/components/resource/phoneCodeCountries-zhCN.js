const allCountries = [
  [
    // 'Afghanistan (‫افغانستان‬‎)',
    '阿富汗',
    'af',
    '93'
  ],
  [
    // 'Albania (Shqipëri)',
    '阿尔巴尼亚',
    'al',
    '355'
  ],
  [
    // 'Algeria (‫الجزائر‬‎)',
    '阿尔及利亚',
    'dz',
    '213'
  ],
  [
    // 'American Samoa',
    '美属萨摩亚',
    'as',
    '1684'
  ],
  [
    // 'Andorra',
    '安道尔',
    'ad',
    '376'
  ],
  [
    // 'Angola',
    '安哥拉',
    'ao',
    '244'
  ],
  [
    // 'Anguilla',
    '安圭拉',
    'ai',
    '1264'
  ],
  [
    // 'Antigua and Barbuda',
    '安提瓜和巴布达',
    'ag',
    '1268'
  ],
  [
    // 'Argentina',
    '阿根廷',
    'ar',
    '54'
  ],
  [
    // 'Armenia (Հայաստան)',
    '亚美尼亚',
    'am',
    '374'
  ],
  [
    // 'Aruba',
    '阿鲁巴',
    'aw',
    '297'
  ],
  [
    // 'Australia',
    '澳大利亚',
    'au',
    '61',
    0
  ],
  [
    // 'Austria (Österreich)',
    '奥地利',
    'at',
    '43'
  ],
  [
    // 'Azerbaijan (Azərbaycan)',
    '阿塞拜疆',
    'az',
    '994'
  ],
  [
    // 'Bahamas',
    '巴哈马',
    'bs',
    '1242'
  ],
  [
    // 'Bahrain (‫البحرين‬‎)',
    '巴林',
    'bh',
    '973'
  ],
  [
    // 'Bangladesh (বাংলাদেশ)',
    '孟加拉国',
    'bd',
    '880'
  ],
  [
    // 'Barbados',
    '巴巴多斯',
    'bb',
    '1246'
  ],
  [
    // 'Belarus (Беларусь)',
    '白俄罗斯',
    'by',
    '375'
  ],
  [
    // 'Belgium (België)',
    '比利时',
    'be',
    '32'
  ],
  [
    // 'Belize',
    '伯利兹',
    'bz',
    '501'
  ],
  [
    // 'Benin (Bénin)',
    '贝宁',
    'bj',
    '229'
  ],
  [
    // 'Bermuda',
    '百慕大群岛',
    'bm',
    '1441'
  ],
  [
    // 'Bhutan (འབྲུག)',
    '不丹',
    'bt',
    '975'
  ],
  [
    // 'Bolivia',
    '玻利维亚',
    'bo',
    '591'
  ],
  [
    // 'Bosnia and Herzegovina (Босна и Херцеговина)',
    '波斯尼亚和黑塞哥维那',
    'ba',
    '387'
  ],
  [
    // 'Botswana',
    '博茨瓦纳',
    'bw',
    '267'
  ],
  [
    // 'Brazil (Brasil)',
    '巴西',
    'br',
    '55'
  ],
  [
    // 'British Indian Ocean Territory',
    '英属印度洋领土',
    'io',
    '246'
  ],
  [
    // 'British Virgin Islands',
    '英属维尔京群岛',
    'vg',
    '1284'
  ],
  [
    // 'Brunei',
    '文莱',
    'bn',
    '673'
  ],
  [
    // 'Bulgaria (България)',
    '保加利亚',
    'bg',
    '359'
  ],
  [
    // 'Burkina Faso',
    '布基纳法索',
    'bf',
    '226'
  ],
  [
    // 'Burundi (Uburundi)',
    '布隆迪',
    'bi',
    '257'
  ],
  [
    // 'Cambodia (កម្ពុជា)',
    '柬埔寨',
    'kh',
    '855'
  ],
  [
    // 'Cameroon (Cameroun)',
    '喀麦隆',
    'cm',
    '237'
  ],
  [
    // 'Canada',
    '加拿大',
    'ca',
    '1',
    1,
    ['204', '226', '236', '249', '250', '289', '306', '343', '365', '387', '403', '416', '418', '431', '437', '438', '450', '506', '514', '519', '548', '579', '581', '587', '604', '613', '639', '647', '672', '705', '709', '742', '778', '780', '782', '807', '819', '825', '867', '873', '902', '905']
  ],
  [
    // 'Cape Verde (Kabu Verdi)',
    '佛得角',
    'cv',
    '238'
  ],
  [
    // 'Caribbean Netherlands',
    '荷兰加勒比区',
    'bq',
    '599',
    1
  ],
  [
    // 'Cayman Islands',
    '开曼群岛',
    'ky',
    '1345'
  ],
  [
    // 'Central African Republic (République centrafricaine)',
    '中非共和国',
    'cf',
    '236'
  ],
  [
    // 'Chad (Tchad)',
    '乍得',
    'td',
    '235'
  ],
  [
    // 'Chile',
    '智利',
    'cl',
    '56'
  ],
  [
    // 'China (中国)',
    '中国',
    'cn',
    '86'
  ],
  [
    // 'Christmas Island',
    '圣诞岛',
    'cx',
    '61',
    2
  ],
  [
    // 'Cocos (Keeling) Islands',
    '科科斯群岛',
    'cc',
    '61',
    1
  ],
  [
    // 'Colombia',
    '哥伦比亚',
    'co',
    '57'
  ],
  [
    // 'Comoros (‫جزر القمر‬‎)',
    '科摩罗',
    'km',
    '269'
  ],
  [
    // 'Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)',
    '刚果民主共和国',
    'cd',
    '243'
  ],
  [
    // 'Congo (Republic) (Congo-Brazzaville)',
    '刚果布拉柴维尔',
    'cg',
    '242'
  ],
  [
    // 'Cook Islands',
    '库克群岛',
    'ck',
    '682'
  ],
  [
    // 'Costa Rica',
    '哥斯达黎加',
    'cr',
    '506'
  ],
  [
    // 'Côte d’Ivoire',
    '科特迪瓦',
    'ci',
    '225'
  ],
  [
    // 'Croatia (Hrvatska)',
    '克罗地亚',
    'hr',
    '385'
  ],
  [
    // 'Cuba',
    '古巴',
    'cu',
    '53'
  ],
  [
    // 'Curaçao',
    '库拉索',
    'cw',
    '599',
    0
  ],
  [
    // 'Cyprus (Κύπρος)',
    '塞浦路斯',
    'cy',
    '357'
  ],
  [
    // 'Czech Republic (Česká republika)',
    '捷克共和国',
    'cz',
    '420'
  ],
  [
    // 'Denmark (Danmark)',
    '丹麦',
    'dk',
    '45'
  ],
  [
    // 'Djibouti',
    '吉布提',
    'dj',
    '253'
  ],
  [
    // 'Dominica',
    '多米尼加',
    'dm',
    '1767'
  ],
  [
    // 'Dominican Republic (República Dominicana)',
    '多米尼加共和国',
    'do',
    '1',
    2,
    ['809', '829', '849']
  ],
  [
    // 'Ecuador',
    '厄瓜多尔',
    'ec',
    '593'
  ],
  [
    // 'Egypt (‫مصر‬‎)',
    '埃及',
    'eg',
    '20'
  ],
  [
    // 'El Salvador',
    '萨尔瓦多',
    'sv',
    '503'
  ],
  [
    // 'Equatorial Guinea (Guinea Ecuatorial)',
    '赤道几内亚',
    'gq',
    '240'
  ],
  [
    // 'Eritrea',
    '厄立特里亚',
    'er',
    '291'
  ],
  [
    // 'Estonia (Eesti)',
    '爱沙尼亚',
    'ee',
    '372'
  ],
  [
    // 'Ethiopia',
    '埃塞俄比亚',
    'et',
    '251'
  ],
  [
    // 'Falkland Islands (Islas Malvinas)',
    '福克兰群岛',
    'fk',
    '500'
  ],
  [
    // 'Faroe Islands (Føroyar)',
    '法罗群岛',
    'fo',
    '298'
  ],
  [
    // 'Fiji',
    '斐济',
    'fj',
    '679'
  ],
  [
    // 'Finland (Suomi)',
    '芬兰',
    'fi',
    '358',
    0
  ],
  [
    // 'France',
    '法国',
    'fr',
    '33'
  ],
  [
    // 'French Guiana (Guyane française)',
    '法属圭亚那',
    'gf',
    '594'
  ],
  [
    // 'French Polynesia (Polynésie française)',
    '法属波利尼西亚',
    'pf',
    '689'
  ],
  [
    // 'Gabon',
    '加蓬共和国',
    'ga',
    '241'
  ],
  [
    // 'Gambia',
    '冈比亚共和国',
    'gm',
    '220'
  ],
  [
    // 'Georgia (საქართველო)',
    '格鲁吉亚',
    'ge',
    '995'
  ],
  [
    // 'Germany (Deutschland)',
    '德国',
    'de',
    '49'
  ],
  [
    // 'Ghana (Gaana)',
    '加纳',
    'gh',
    '233'
  ],
  [
    // 'Gibraltar',
    '直布罗陀',
    'gi',
    '350'
  ],
  [
    // 'Greece (Ελλάδα)',
    '希腊',
    'gr',
    '30'
  ],
  [
    // 'Greenland (Kalaallit Nunaat)',
    '格陵兰岛',
    'gl',
    '299'
  ],
  [
    // 'Grenada',
    '格林纳达',
    'gd',
    '1473'
  ],
  [
    // 'Guadeloupe',
    '瓜德罗普岛',
    'gp',
    '590',
    0
  ],
  [
    // 'Guam',
    '关岛',
    'gu',
    '1671'
  ],
  [
    // 'Guatemala',
    '危地马拉',
    'gt',
    '502'
  ],
  [
    // 'Guernsey',
    '根西岛',
    'gg',
    '44',
    1
  ],
  [
    // 'Guinea (Guinée)',
    '几内亚',
    'gn',
    '224'
  ],
  [
    // 'Guinea-Bissau (Guiné Bissau)',
    '几内亚比绍',
    'gw',
    '245'
  ],
  [
    // 'Guyana',
    '圭亚那',
    'gy',
    '592'
  ],
  [
    // 'Haiti',
    '海地共和国',
    'ht',
    '509'
  ],
  [
    // 'Honduras',
    '洪都拉斯',
    'hn',
    '504'
  ],
  [
    // 'Hong Kong (香港)',
    '香港',
    'hk',
    '852'
  ],
  [
    // 'Hungary (Magyarország)',
    '匈牙利',
    'hu',
    '36'
  ],
  [
    // 'Iceland (Ísland)',
    '冰岛',
    'is',
    '354'
  ],
  [
    // 'India (भारत)',
    '印度',
    'in',
    '91'
  ],
  [
    // 'Indonesia',
    '印度尼西亚',
    'id',
    '62'
  ],
  [
    // 'Iran (‫ایران‬‎)',
    '伊朗',
    'ir',
    '98'
  ],
  [
    // 'Iraq (‫العراق‬‎)',
    '伊拉克',
    'iq',
    '964'
  ],
  [
    // 'Ireland',
    '爱尔兰',
    'ie',
    '353'
  ],
  [
    // 'Isle of Man',
    '马恩岛',
    'im',
    '44',
    2
  ],
  [
    // 'Israel (‫ישראל‬‎)',
    '以色列',
    'il',
    '972'
  ],
  [
    // 'Italy (Italia)',
    '意大利',
    'it',
    '39',
    0
  ],
  [
    // 'Jamaica',
    '牙买加',
    'jm',
    '1876'
  ],
  [
    // 'Japan (日本)',
    '日本',
    'jp',
    '81'
  ],
  [
    // 'Jersey',
    '泽西岛',
    'je',
    '44',
    3
  ],
  [
    // 'Jordan (‫الأردن‬‎)',
    '约旦',
    'jo',
    '962'
  ],
  [
    // 'Kazakhstan (Казахстан)',
    '哈萨克斯坦',
    'kz',
    '7',
    1
  ],
  [
    // 'Kenya',
    '肯尼亚',
    'ke',
    '254'
  ],
  [
    // 'Kiribati',
    '基里巴斯',
    'ki',
    '686'
  ],
  [
    // 'Kosovo',
    '科索沃',
    'xk',
    '383'
  ],
  [
    // 'Kuwait (‫الكويت‬‎)',
    '科威特',
    'kw',
    '965'
  ],
  [
    // 'Kyrgyzstan (Кыргызстан)',
    '吉尔吉斯斯坦',
    'kg',
    '996'
  ],
  [
    // 'Laos (ລາວ)',
    '老挝',
    'la',
    '856'
  ],
  [
    // 'Latvia (Latvija)',
    '拉脱维亚',
    'lv',
    '371'
  ],
  [
    // 'Lebanon (‫لبنان‬‎)',
    '黎巴嫩',
    'lb',
    '961'
  ],
  [
    // 'Lesotho',
    '莱索托',
    'ls',
    '266'
  ],
  [
    // 'Liberia',
    '利比里亚',
    'lr',
    '231'
  ],
  [
    // 'Libya (‫ليبيا‬‎)',
    '利比亚',
    'ly',
    '218'
  ],
  [
    // 'Liechtenstein',
    '列支敦士登',
    'li',
    '423'
  ],
  [
    // 'Lithuania (Lietuva)',
    '立陶宛',
    'lt',
    '370'
  ],
  [
    // 'Luxembourg',
    '卢森堡',
    'lu',
    '352'
  ],
  [
    // 'Macau (澳門)',
    '澳门',
    'mo',
    '853'
  ],
  [
    // 'Macedonia (FYROM) (Македонија)',
    '马其顿',
    'mk',
    '389'
  ],
  [
    // 'Madagascar (Madagasikara)',
    '马达加斯加',
    'mg',
    '261'
  ],
  [
    // 'Malawi',
    '马拉维',
    'mw',
    '265'
  ],
  [
    // 'Malaysia',
    '马来西亚',
    'my',
    '60'
  ],
  [
    // 'Maldives',
    '马尔代夫',
    'mv',
    '960'
  ],
  [
    // 'Mali',
    '马里',
    'ml',
    '223'
  ],
  [
    // 'Malta',
    '马耳他',
    'mt',
    '356'
  ],
  [
    // 'Marshall Islands',
    '马绍尔群岛',
    'mh',
    '692'
  ],
  [
    // 'Martinique',
    '马提尼克岛',
    'mq',
    '596'
  ],
  [
    // 'Mauritania (‫موريتانيا‬‎)',
    '毛里塔尼亚',
    'mr',
    '222'
  ],
  [
    // 'Mauritius (Moris)',
    '毛里求斯',
    'mu',
    '230'
  ],
  [
    // 'Mayotte',
    '马约特',
    'yt',
    '262',
    1
  ],
  [
    // 'Mexico (México)',
    '墨西哥',
    'mx',
    '52'
  ],
  [
    // 'Micronesia',
    '密克罗尼西亚',
    'fm',
    '691'
  ],
  [
    // 'Moldova (Republica Moldova)',
    '摩尔多瓦共和国',
    'md',
    '373'
  ],
  [
    // 'Monaco',
    '摩纳哥',
    'mc',
    '377'
  ],
  [
    // 'Mongolia (Монгол)',
    '蒙古国',
    'mn',
    '976'
  ],
  [
    // 'Montenegro (Crna Gora)',
    '黑山',
    'me',
    '382'
  ],
  [
    // 'Montserrat',
    '蒙特塞拉特',
    'ms',
    '1664'
  ],
  [
    // 'Morocco (‫المغرب‬‎)',
    '摩洛哥',
    'ma',
    '212',
    0
  ],
  [
    // 'Mozambique (Moçambique)',
    '莫桑比克',
    'mz',
    '258'
  ],
  [
    // 'Myanmar (Burma) (မြန်မာ)',
    '缅甸',
    'mm',
    '95'
  ],
  [
    // 'Namibia (Namibië)',
    '纳米比亚',
    'na',
    '264'
  ],
  [
    // 'Nauru',
    '瑙鲁',
    'nr',
    '674'
  ],
  [
    // 'Nepal (नेपाल)',
    '尼泊尔',
    'np',
    '977'
  ],
  [
    // 'Netherlands (Nederland)',
    '荷兰',
    'nl',
    '31'
  ],
  [
    // 'New Caledonia (Nouvelle-Calédonie)',
    '新喀里多尼亚',
    'nc',
    '687'
  ],
  [
    // 'New Zealand',
    '新西兰',
    'nz',
    '64'
  ],
  [
    // 'Nicaragua',
    '尼加拉瓜',
    'ni',
    '505'
  ],
  [
    // 'Niger (Nijar)',
    '尼日尔',
    'ne',
    '227'
  ],
  [
    // 'Nigeria',
    '尼日利亚',
    'ng',
    '234'
  ],
  [
    // 'Niue',
    '纽埃',
    'nu',
    '683'
  ],
  [
    // 'Norfolk Island',
    '诺福克岛',
    'nf',
    '672'
  ],
  [
    // 'North Korea (조선 민주주의 인민 공화국)',
    '朝鲜',
    'kp',
    '850'
  ],
  [
    // 'Northern Mariana Islands',
    '北马里亚纳群岛',
    'mp',
    '1670'
  ],
  [
    // 'Norway (Norge)',
    '挪威',
    'no',
    '47',
    0
  ],
  [
    // 'Oman (‫عُمان‬‎)',
    '阿曼',
    'om',
    '968'
  ],
  [
    // 'Pakistan (‫پاکستان‬‎)',
    '巴基斯坦',
    'pk',
    '92'
  ],
  [
    // 'Palau',
    '帕劳',
    'pw',
    '680'
  ],
  [
    // 'Palestine (‫فلسطين‬‎)',
    '巴勒斯坦',
    'ps',
    '970'
  ],
  [
    // 'Panama (Panamá)',
    '巴拿马',
    'pa',
    '507'
  ],
  [
    // 'Papua New Guinea',
    '巴布亚新几内亚',
    'pg',
    '675'
  ],
  [
    // 'Paraguay',
    '巴拉圭',
    'py',
    '595'
  ],
  [
    // 'Peru (Perú)',
    '秘鲁',
    'pe',
    '51'
  ],
  [
    // 'Philippines',
    '菲律宾',
    'ph',
    '63'
  ],
  [
    // 'Poland (Polska)',
    '波兰',
    'pl',
    '48'
  ],
  [
    // 'Portugal',
    '葡萄牙',
    'pt',
    '351'
  ],
  [
    // 'Puerto Rico',
    '波多黎各',
    'pr',
    '1',
    3,
    ['787', '939']
  ],
  [
    // 'Qatar (‫قطر‬‎)',
    '卡塔尔',
    'qa',
    '974'
  ],
  [
    // 'Réunion (La Réunion)',
    '留尼汪',
    're',
    '262',
    0
  ],
  [
    // 'Romania (România)',
    '罗马尼亚',
    'ro',
    '40'
  ],
  [
    // 'Russia (Россия)',
    '俄罗斯',
    'ru',
    '7',
    0
  ],
  [
    // 'Rwanda',
    '卢旺达',
    'rw',
    '250'
  ],
  [
    // 'Saint Barthélemy',
    '圣巴塞莱米',
    'bl',
    '590',
    1
  ],
  [
    // 'Saint Helena',
    '圣赫勒拿',
    'sh',
    '290'
  ],
  [
    // 'Saint Kitts and Nevis',
    '圣基茨和尼维斯',
    'kn',
    '1869'
  ],
  [
    // 'Saint Lucia',
    '圣卢西亚',
    'lc',
    '1758'
  ],
  [
    // 'Saint Martin (Saint-Martin (partie française))',
    '圣马丁',
    'mf',
    '590',
    2
  ],
  [
    // 'Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)',
    '圣皮埃尔和密克隆',
    'pm',
    '508'
  ],
  [
    // 'Saint Vincent and the Grenadines',
    '圣文森特和格林纳丁斯',
    'vc',
    '1784'
  ],
  [
    // 'Samoa',
    '萨摩亚',
    'ws',
    '685'
  ],
  [
    // 'San Marino',
    '圣马力诺',
    'sm',
    '378'
  ],
  [
    // 'São Tomé and Príncipe (São Tomé e Príncipe)',
    '圣多美和普林西比',
    'st',
    '239'
  ],
  [
    // 'Saudi Arabia (‫المملكة العربية السعودية‬‎)',
    '沙特阿拉伯',
    'sa',
    '966'
  ],
  [
    // 'Senegal (Sénégal)',
    '塞内加尔',
    'sn',
    '221'
  ],
  [
    // 'Serbia (Србија)',
    '塞尔维亚',
    'rs',
    '381'
  ],
  [
    // 'Seychelles',
    '塞舌尔',
    'sc',
    '248'
  ],
  [
    // 'Sierra Leone',
    '塞拉利昂',
    'sl',
    '232'
  ],
  [
    // 'Singapore',
    '新加坡',
    'sg',
    '65'
  ],
  [
    // 'Sint Maarten',
    '荷属圣马丁',
    'sx',
    '1721'
  ],
  [
    // 'Slovakia (Slovensko)',
    '斯洛伐克',
    'sk',
    '421'
  ],
  [
    // 'Slovenia (Slovenija)',
    '斯洛文尼亚',
    'si',
    '386'
  ],
  [
    // 'Solomon Islands',
    '所罗门群岛',
    'sb',
    '677'
  ],
  [
    // 'Somalia (Soomaaliya)',
    '索马里',
    'so',
    '252'
  ],
  [
    // 'South Africa',
    '南非',
    'za',
    '27'
  ],
  [
    // 'South Korea (대한민국)',
    '韩国',
    'kr',
    '82'
  ],
  [
    // 'South Sudan (‫جنوب السودان‬‎)',
    '南苏丹',
    'ss',
    '211'
  ],
  [
    // 'Spain (España)',
    '西班牙',
    'es',
    '34'
  ],
  [
    // 'Sri Lanka (ශ්‍රී ලංකාව)',
    '斯里兰卡',
    'lk',
    '94'
  ],
  [
    // 'Sudan (‫السودان‬‎)',
    '苏丹',
    'sd',
    '249'
  ],
  [
    // 'Suriname',
    '苏里南',
    'sr',
    '597'
  ],
  [
    // 'Svalbard and Jan Mayen',
    '斯瓦尔巴和扬马延',
    'sj',
    '47',
    1
  ],
  [
    // 'Swaziland',
    '斯威士兰',
    'sz',
    '268'
  ],
  [
    // 'Sweden (Sverige)',
    '瑞典',
    'se',
    '46'
  ],
  [
    // 'Switzerland (Schweiz)',
    '瑞士',
    'ch',
    '41'
  ],
  [
    // 'Syria (‫سوريا‬‎)',
    '叙利亚',
    'sy',
    '963'
  ],
  [
    // 'Taiwan (台灣)',
    '台湾',
    'tw',
    '886'
  ],
  [
    // 'Tajikistan',
    '塔吉克斯坦',
    'tj',
    '992'
  ],
  [
    // 'Tanzania',
    '坦桑尼亚',
    'tz',
    '255'
  ],
  [
    // 'Thailand (ไทย)',
    '泰国',
    'th',
    '66'
  ],
  [
    // 'Timor-Leste',
    '东帝汶',
    'tl',
    '670'
  ],
  [
    // 'Togo',
    '多哥',
    'tg',
    '228'
  ],
  [
    // 'Tokelau',
    '托克劳',
    'tk',
    '690'
  ],
  [
    // 'Tonga',
    '汤加',
    'to',
    '676'
  ],
  [
    // 'Trinidad and Tobago',
    '特立尼达和多巴哥',
    'tt',
    '1868'
  ],
  [
    // 'Tunisia (‫تونس‬‎)',
    '突尼斯',
    'tn',
    '216'
  ],
  [
    // 'Turkey (Türkiye)',
    '土耳其',
    'tr',
    '90'
  ],
  [
    // 'Turkmenistan',
    '土库曼斯坦',
    'tm',
    '993'
  ],
  [
    // 'Turks and Caicos Islands',
    '特克斯和凯科斯群岛',
    'tc',
    '1649'
  ],
  [
    // 'Tuvalu',
    '图瓦卢',
    'tv',
    '688'
  ],
  [
    // 'U.S. Virgin Islands',
    '美属维尔京群岛',
    'vi',
    '1340'
  ],
  [
    // 'Uganda',
    '乌干达',
    'ug',
    '256'
  ],
  [
    // 'Ukraine (Україна)',
    '乌克兰',
    'ua',
    '380'
  ],
  [
    // 'United Arab Emirates (‫الإمارات العربية المتحدة‬‎)',
    '阿拉伯联合酋长国',
    'ae',
    '971'
  ],
  [
    // 'United Kingdom',
    '英国',
    'gb',
    '44',
    0
  ],
  [
    // 'United States',
    '美国',
    'us',
    '1',
    0
  ],
  [
    // 'Uruguay',
    '乌拉圭',
    'uy',
    '598'
  ],
  [
    // 'Uzbekistan (Oʻzbekiston)',
    '乌兹别克斯坦',
    'uz',
    '998'
  ],
  [
    // 'Vanuatu',
    '瓦努阿图',
    'vu',
    '678'
  ],
  [
    // 'Vatican City (Città del Vaticano)',
    '梵蒂冈城',
    'va',
    '39',
    1
  ],
  [
    // 'Venezuela',
    '委内瑞拉',
    've',
    '58'
  ],
  [
    // 'Vietnam (Việt Nam)',
    '越南',
    'vn',
    '84'
  ],
  [
    // 'Wallis and Futuna (Wallis-et-Futuna)',
    '瓦利斯和富图纳',
    'wf',
    '681'
  ],
  [
    // 'Western Sahara (‫الصحراء الغربية‬‎)',
    '西撒哈拉',
    'eh',
    '212',
    1
  ],
  [
    // 'Yemen (‫اليمن‬‎)',
    '也门',
    'ye',
    '967'
  ],
  [
    // 'Zambia',
    '赞比亚',
    'zm',
    '260'
  ],
  [
    // 'Zimbabwe',
    '津巴布韦',
    'zw',
    '263'
  ],
  [
    // 'Åland Islands',
    '奥兰群岛',
    'ax',
    '358',
    1
  ]
]

export const countriesIso = allCountries.map(country => country[1].toUpperCase())

export const countries = allCountries.map(country => ({
  name: country[0],
  iso2: country[1].toUpperCase(),
  dialCode: '+'+country[2],
  priority: country[3] || 0,
  areaCodes: country[4] || null
}))
