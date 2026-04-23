// 48 支 FIFA World Cup 2026 參賽隊伍
// iso2：flagcdn.com 使用的 ISO 3166-1 alpha-2（英格蘭/蘇格蘭用細分碼 gb-eng / gb-sct）
export const WC_TEAMS = [
  // 地主國
  { code: 'CAN', name: '加拿大',             flag: '🇨🇦', iso2: 'ca',     confed: 'CONCACAF' },
  { code: 'MEX', name: '墨西哥',             flag: '🇲🇽', iso2: 'mx',     confed: 'CONCACAF' },
  { code: 'USA', name: '美國',               flag: '🇺🇸', iso2: 'us',     confed: 'CONCACAF' },
  // AFC（亞洲）
  { code: 'AUS', name: '澳洲',               flag: '🇦🇺', iso2: 'au',     confed: 'AFC' },
  { code: 'IRN', name: '伊朗',               flag: '🇮🇷', iso2: 'ir',     confed: 'AFC' },
  { code: 'JPN', name: '日本',               flag: '🇯🇵', iso2: 'jp',     confed: 'AFC' },
  { code: 'JOR', name: '約旦',               flag: '🇯🇴', iso2: 'jo',     confed: 'AFC' },
  { code: 'KOR', name: '韓國',               flag: '🇰🇷', iso2: 'kr',     confed: 'AFC' },
  { code: 'UZB', name: '烏茲別克',           flag: '🇺🇿', iso2: 'uz',     confed: 'AFC' },
  { code: 'QAT', name: '卡達',               flag: '🇶🇦', iso2: 'qa',     confed: 'AFC' },
  { code: 'KSA', name: '沙烏地阿拉伯',       flag: '🇸🇦', iso2: 'sa',     confed: 'AFC' },
  { code: 'IRQ', name: '伊拉克',             flag: '🇮🇶', iso2: 'iq',     confed: 'AFC' },
  // CAF（非洲）
  { code: 'MAR', name: '摩洛哥',             flag: '🇲🇦', iso2: 'ma',     confed: 'CAF' },
  { code: 'TUN', name: '突尼西亞',           flag: '🇹🇳', iso2: 'tn',     confed: 'CAF' },
  { code: 'EGY', name: '埃及',               flag: '🇪🇬', iso2: 'eg',     confed: 'CAF' },
  { code: 'ALG', name: '阿爾及利亞',         flag: '🇩🇿', iso2: 'dz',     confed: 'CAF' },
  { code: 'GHA', name: '迦納',               flag: '🇬🇭', iso2: 'gh',     confed: 'CAF' },
  { code: 'SEN', name: '塞內加爾',           flag: '🇸🇳', iso2: 'sn',     confed: 'CAF' },
  { code: 'CIV', name: '象牙海岸',           flag: '🇨🇮', iso2: 'ci',     confed: 'CAF' },
  { code: 'CPV', name: '維德角',             flag: '🇨🇻', iso2: 'cv',     confed: 'CAF' },
  { code: 'RSA', name: '南非',               flag: '🇿🇦', iso2: 'za',     confed: 'CAF' },
  { code: 'COD', name: '剛果民主共和國',     flag: '🇨🇩', iso2: 'cd',     confed: 'CAF' },
  // CONCACAF（中北美）
  { code: 'PAN', name: '巴拿馬',             flag: '🇵🇦', iso2: 'pa',     confed: 'CONCACAF' },
  { code: 'CUW', name: '古拉索',             flag: '🇨🇼', iso2: 'cw',     confed: 'CONCACAF' },
  { code: 'HAI', name: '海地',               flag: '🇭🇹', iso2: 'ht',     confed: 'CONCACAF' },
  // CONMEBOL（南美）
  { code: 'ARG', name: '阿根廷',             flag: '🇦🇷', iso2: 'ar',     confed: 'CONMEBOL' },
  { code: 'BRA', name: '巴西',               flag: '🇧🇷', iso2: 'br',     confed: 'CONMEBOL' },
  { code: 'URU', name: '烏拉圭',             flag: '🇺🇾', iso2: 'uy',     confed: 'CONMEBOL' },
  { code: 'COL', name: '哥倫比亞',           flag: '🇨🇴', iso2: 'co',     confed: 'CONMEBOL' },
  { code: 'ECU', name: '厄瓜多',             flag: '🇪🇨', iso2: 'ec',     confed: 'CONMEBOL' },
  { code: 'PAR', name: '巴拉圭',             flag: '🇵🇾', iso2: 'py',     confed: 'CONMEBOL' },
  // OFC（大洋洲）
  { code: 'NZL', name: '紐西蘭',             flag: '🇳🇿', iso2: 'nz',     confed: 'OFC' },
  // UEFA（歐洲）
  { code: 'ENG', name: '英格蘭',             flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', iso2: 'gb-eng', confed: 'UEFA' },
  { code: 'FRA', name: '法國',               flag: '🇫🇷', iso2: 'fr',     confed: 'UEFA' },
  { code: 'GER', name: '德國',               flag: '🇩🇪', iso2: 'de',     confed: 'UEFA' },
  { code: 'ESP', name: '西班牙',             flag: '🇪🇸', iso2: 'es',     confed: 'UEFA' },
  { code: 'POR', name: '葡萄牙',             flag: '🇵🇹', iso2: 'pt',     confed: 'UEFA' },
  { code: 'NED', name: '荷蘭',               flag: '🇳🇱', iso2: 'nl',     confed: 'UEFA' },
  { code: 'BEL', name: '比利時',             flag: '🇧🇪', iso2: 'be',     confed: 'UEFA' },
  { code: 'CRO', name: '克羅埃西亞',         flag: '🇭🇷', iso2: 'hr',     confed: 'UEFA' },
  { code: 'SUI', name: '瑞士',               flag: '🇨🇭', iso2: 'ch',     confed: 'UEFA' },
  { code: 'AUT', name: '奧地利',             flag: '🇦🇹', iso2: 'at',     confed: 'UEFA' },
  { code: 'NOR', name: '挪威',               flag: '🇳🇴', iso2: 'no',     confed: 'UEFA' },
  { code: 'SCO', name: '蘇格蘭',             flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', iso2: 'gb-sct', confed: 'UEFA' },
  { code: 'TUR', name: '土耳其',             flag: '🇹🇷', iso2: 'tr',     confed: 'UEFA' },
  { code: 'BIH', name: '波赫',               flag: '🇧🇦', iso2: 'ba',     confed: 'UEFA' },
  { code: 'SWE', name: '瑞典',               flag: '🇸🇪', iso2: 'se',     confed: 'UEFA' },
  { code: 'CZE', name: '捷克',               flag: '🇨🇿', iso2: 'cz',     confed: 'UEFA' },
];

// 假設的「全體用戶投票分佈」權重（數字越大代表選此隊的人越多）
export const WC_WEIGHTS = {
  ARG: 18420, BRA: 17890, FRA: 14230, ESP: 12340, ENG: 11560, GER:  9870,
  POR:  8420, NED:  5430, BEL:  3210, URU:  2980, CRO:  2340, COL:  1890,
  MAR:  1720, USA:  1680, MEX:  1420, JPN:  1210, SUI:   890, KOR:   780,
  SWE:   480, SEN:   430, AUT:   380, NOR:   340, TUR:   310, CZE:   270,
  ECU:   290, CAN:   270, AUS:   240, EGY:   190, GHA:   170, CIV:   160,
  BIH:   150, TUN:   130, ALG:   120, RSA:   100, IRN:   110, PAR:   100,
  SCO:    90, COD:    75, JOR:    72, UZB:    68, QAT:    61, KSA:    58,
  IRQ:    44, CPV:    40, PAN:    39, CUW:    25, HAI:    22, NZL:    21,
};
