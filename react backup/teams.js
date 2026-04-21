// 48 teams qualified for FIFA World Cup 2026 (using ISO flag emojis)
window.WC_TEAMS = [
  // Hosts
  { code: "CAN", name: "Canada", flag: "🇨🇦", confed: "CONCACAF" },
  { code: "MEX", name: "Mexico", flag: "🇲🇽", confed: "CONCACAF" },
  { code: "USA", name: "United States", flag: "🇺🇸", confed: "CONCACAF" },
  // AFC
  { code: "AUS", name: "Australia", flag: "🇦🇺", confed: "AFC" },
  { code: "IRN", name: "Iran", flag: "🇮🇷", confed: "AFC" },
  { code: "JPN", name: "Japan", flag: "🇯🇵", confed: "AFC" },
  { code: "JOR", name: "Jordan", flag: "🇯🇴", confed: "AFC" },
  { code: "KOR", name: "South Korea", flag: "🇰🇷", confed: "AFC" },
  { code: "UZB", name: "Uzbekistan", flag: "🇺🇿", confed: "AFC" },
  { code: "QAT", name: "Qatar", flag: "🇶🇦", confed: "AFC" },
  { code: "KSA", name: "Saudi Arabia", flag: "🇸🇦", confed: "AFC" },
  { code: "IRQ", name: "Iraq", flag: "🇮🇶", confed: "AFC" },
  // CAF
  { code: "MAR", name: "Morocco", flag: "🇲🇦", confed: "CAF" },
  { code: "TUN", name: "Tunisia", flag: "🇹🇳", confed: "CAF" },
  { code: "EGY", name: "Egypt", flag: "🇪🇬", confed: "CAF" },
  { code: "ALG", name: "Algeria", flag: "🇩🇿", confed: "CAF" },
  { code: "GHA", name: "Ghana", flag: "🇬🇭", confed: "CAF" },
  { code: "SEN", name: "Senegal", flag: "🇸🇳", confed: "CAF" },
  { code: "CIV", name: "Côte d'Ivoire", flag: "🇨🇮", confed: "CAF" },
  { code: "CMR", name: "Cameroon", flag: "🇨🇲", confed: "CAF" },
  { code: "NGA", name: "Nigeria", flag: "🇳🇬", confed: "CAF" },
  // CONCACAF
  { code: "PAN", name: "Panama", flag: "🇵🇦", confed: "CONCACAF" },
  { code: "CRC", name: "Costa Rica", flag: "🇨🇷", confed: "CONCACAF" },
  { code: "JAM", name: "Jamaica", flag: "🇯🇲", confed: "CONCACAF" },
  // CONMEBOL
  { code: "ARG", name: "Argentina", flag: "🇦🇷", confed: "CONMEBOL" },
  { code: "BRA", name: "Brazil", flag: "🇧🇷", confed: "CONMEBOL" },
  { code: "URU", name: "Uruguay", flag: "🇺🇾", confed: "CONMEBOL" },
  { code: "COL", name: "Colombia", flag: "🇨🇴", confed: "CONMEBOL" },
  { code: "ECU", name: "Ecuador", flag: "🇪🇨", confed: "CONMEBOL" },
  { code: "PAR", name: "Paraguay", flag: "🇵🇾", confed: "CONMEBOL" },
  { code: "PER", name: "Peru", flag: "🇵🇪", confed: "CONMEBOL" },
  // OFC
  { code: "NZL", name: "New Zealand", flag: "🇳🇿", confed: "OFC" },
  // UEFA
  { code: "ENG", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", confed: "UEFA" },
  { code: "FRA", name: "France", flag: "🇫🇷", confed: "UEFA" },
  { code: "GER", name: "Germany", flag: "🇩🇪", confed: "UEFA" },
  { code: "ESP", name: "Spain", flag: "🇪🇸", confed: "UEFA" },
  { code: "ITA", name: "Italy", flag: "🇮🇹", confed: "UEFA" },
  { code: "POR", name: "Portugal", flag: "🇵🇹", confed: "UEFA" },
  { code: "NED", name: "Netherlands", flag: "🇳🇱", confed: "UEFA" },
  { code: "BEL", name: "Belgium", flag: "🇧🇪", confed: "UEFA" },
  { code: "CRO", name: "Croatia", flag: "🇭🇷", confed: "UEFA" },
  { code: "SUI", name: "Switzerland", flag: "🇨🇭", confed: "UEFA" },
  { code: "DEN", name: "Denmark", flag: "🇩🇰", confed: "UEFA" },
  { code: "AUT", name: "Austria", flag: "🇦🇹", confed: "UEFA" },
  { code: "POL", name: "Poland", flag: "🇵🇱", confed: "UEFA" },
  { code: "NOR", name: "Norway", flag: "🇳🇴", confed: "UEFA" },
  { code: "SCO", name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", confed: "UEFA" },
  { code: "TUR", name: "Türkiye", flag: "🇹🇷", confed: "UEFA" },
];

// Distribution weights for mock "everyone else's picks" — heavier on favorites
window.WC_WEIGHTS = {
  ARG: 18420, BRA: 17890, FRA: 14230, ESP: 12340, ENG: 11560, GER: 9870,
  POR: 8420, NED: 5430, ITA: 4920, BEL: 3210, URU: 2980, CRO: 2340,
  COL: 1890, MAR: 1720, USA: 1680, MEX: 1420, JPN: 1210, SUI: 890,
  KOR: 780, DEN: 650, POL: 540, SEN: 430, AUT: 380, NOR: 340, TUR: 310,
  ECU: 290, CAN: 270, AUS: 240, NGA: 220, EGY: 190, GHA: 170, CIV: 160,
  CMR: 140, TUN: 130, ALG: 120, IRN: 110, PAR: 100, PER: 95, SCO: 90,
  JOR: 72, UZB: 68, QAT: 61, KSA: 58, IRQ: 44, PAN: 39, CRC: 36,
  JAM: 28, NZL: 21,
};
