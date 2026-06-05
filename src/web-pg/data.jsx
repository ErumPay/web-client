/* Mock data for ErumPay admin */

const MERCHANT_BRANDS = [
  { name: "스타필드",       mid: "10000001", mark: "S",  color: "#1F6F5F" },
  { name: "위티하우스",     mid: "10000002", mark: "W",  color: "#C5A95F" },
  { name: "카페노블",       mid: "10000003", mark: "C",  color: "#45565C" },
  { name: "리빙스토어",     mid: "10000004", mark: "L",  color: "#2FB484" },
  { name: "키친봄바",       mid: "10000005", mark: "K",  color: "#EF5350" },
  { name: "패션웨이브",     mid: "10000006", mark: "P",  color: "#6FCF97" },
  { name: "스포츠라인",     mid: "10000007", mark: "S",  color: "#FF9F2F" },
  { name: "헬시푸드",       mid: "10000008", mark: "H",  color: "#67B173" },
  { name: "북앤커피",       mid: "10000009", mark: "B",  color: "#1C1D1F" },
  { name: "이앤바이저",     mid: "10000010", mark: "E",  color: "#1F6F5F" }
];

const DASHBOARD_TABLE = MERCHANT_BRANDS.map((b, i) => ({
  rank: i + 1,
  brand: b,
  status: ["normal","normal","normal","caution","normal","normal","caution","normal","normal","normal"][i],
  count:  [2548, 1985, 1563, 1245, 1032, 876, 642, 358, 287, 198][i],
  amount: [482560000, 312450000, 198760000, 156230000, 136850000, 98750000, 71230000, 41180000, 32450000, 21760000][i],
  failure:{ n: [32,18,12,25,9,7,13,4,3,2][i], pct: ["1.25%","0.90%","0.77%","2.01%","0.87%","0.80%","2.03%","1.12%","1.05%","1.01%"][i] },
  alert:  [0,1,0,2,0,0,1,0,0,0][i]
}));

const WAITING_MERCHANTS = [
  { name: "브런치카페",   date: "2024-05-14" },
  { name: "헤어맛집",     date: "2024-05-14" },
  { name: "데일리세션",   date: "2024-05-13" },
  { name: "키즈필드",     date: "2024-05-13" },
  { name: "플라워가든",   date: "2024-05-12" }
];

const TRANSACTIONS = Array.from({length: 14}).map((_, i) => {
  const mid = MERCHANT_BRANDS[i % MERCHANT_BRANDS.length];
  const cards = ["신한카드","KB국민카드","현대카드","삼성카드","롯데카드","하나카드","BC카드"];
  const statuses = ["paid","paid","paid","paid","refunded","paid","failed","paid","canceled","paid","paid","paid","paid","paid"];
  const amounts = [38500, 124800, 9800, 56000, 89000, 32100, 19900, 215000, 7800, 64500, 11500, 45200, 102400, 27800];
  return {
    id: "TX2024051400" + String(120 - i).padStart(3, "0"),
    time: `2024-05-14 ${14 - Math.floor(i/3)}:${String(58 - i*3).padStart(2,"0")}:${String(12 + i).padStart(2,"0")}`,
    brand: mid,
    card: cards[i % cards.length],
    amount: amounts[i],
    status: statuses[i],
    method: i % 4 === 0 ? "QR" : "단말기"
  };
});

const SETTLEMENTS = Array.from({length: 12}).map((_, i) => {
  const m = MERCHANT_BRANDS[i % MERCHANT_BRANDS.length];
  const gross = [12450000, 8730000, 6210000, 4580000, 3920000, 2840000, 2110000, 1670000, 1340000, 980000, 720000, 540000][i];
  const fee = Math.round(gross * 0.025);
  return {
    cycle: `2024-W${20 - Math.floor(i/4)}`,
    brand: m,
    gross,
    fee,
    net: gross - fee,
    status: ["paid","paid","paid","pending","paid","paid","pending","paid","paid","paid","pending","paid"][i],
    settleAt: `2024-05-${String(13 - Math.floor(i/3)).padStart(2,"0")}`
  };
});

const NOTICES = [
  { id: "N241", type: "system", title: "5월 정기점검 안내 (5/22 02:00~04:00)",     audience: "전체",    pub: "2024-05-14", status: "published", views: 1284 },
  { id: "N240", type: "policy", title: "단말기 보안 펌웨어 v2.4.1 의무 업데이트", audience: "가맹점",  pub: "2024-05-13", status: "published", views: 892 },
  { id: "N239", type: "event",  title: "여름 캠페인 - 카드 캐시백 1.5% 이벤트",    audience: "가맹점",  pub: "2024-05-12", status: "scheduled", views: 0 },
  { id: "N238", type: "alert",  title: "BC카드 결제망 일시 지연 (복구 완료)",       audience: "내부",    pub: "2024-05-11", status: "published", views: 64 },
  { id: "N237", type: "system", title: "신규 가맹점 가입 절차 변경 안내",            audience: "전체",    pub: "2024-05-10", status: "draft",     views: 0 }
];

const AUDITS = Array.from({length: 12}).map((_, i) => {
  const acts = ["로그인","가맹점 상태 변경","수기 정산 처리","권한 변경","공지 발행","결제 강제 취소","관리자 추가","로그인 실패","비밀번호 재설정","감사 로그 내보내기","계정 잠금 해제","API 키 발급"];
  const users = ["김이름","박감독","이재현","최서윤","장민호","정유리","오현우","김이름","박감독","이재현","최서윤","장민호"];
  const ips = ["192.168.10.21","220.45.13.118","10.0.4.55","61.78.231.7","192.168.10.21","118.40.7.221","220.45.13.118","10.0.4.55"];
  return {
    ts: `2024-05-14 ${String(15 - Math.floor(i/2)).padStart(2,"0")}:${String(58 - i*4).padStart(2,"0")}:${String(12 + i).padStart(2,"0")}`,
    user: users[i],
    role: ["슈퍼바이저","운영자","운영자","관리자","운영자","감독자","슈퍼바이저","슈퍼바이저","운영자","운영자","관리자","감독자"][i],
    action: acts[i],
    target: ["—","MID:10000004","STL-2024-W20-002","admin:lee","NOTI-N241","TX:TX20240514002","admin:park","—","admin:park","—","admin:choi","API-KEY-883"][i],
    ip: ips[i % ips.length],
    result: i === 7 ? "실패" : "성공"
  };
});

const ADMINS = [
  { id: "u_001", name: "김이름", email: "kim@erumpay.kr",   role: "슈퍼바이저", dept: "PG운영", phone: "010-1234-5678", last: "2024-05-14 14:22", status: "active",   created: "2023-08-12" },
  { id: "u_002", name: "박감독", email: "park@erumpay.kr",  role: "감독자",     dept: "감사",   phone: "010-2345-6789", last: "2024-05-14 11:08", status: "active",   created: "2023-09-01" },
  { id: "u_003", name: "이재현", email: "lee@erumpay.kr",   role: "운영자",     dept: "PG운영", phone: "010-3456-7890", last: "2024-05-13 18:45", status: "active",   created: "2024-01-15" },
  { id: "u_004", name: "최서윤", email: "choi@erumpay.kr",  role: "운영자",     dept: "정산",   phone: "010-4567-8901", last: "2024-05-14 09:31", status: "active",   created: "2024-02-22" },
  { id: "u_005", name: "장민호", email: "jang@erumpay.kr",  role: "관리자",     dept: "보안",   phone: "010-5678-9012", last: "2024-05-10 16:12", status: "locked",   created: "2024-03-08" },
  { id: "u_006", name: "정유리", email: "jung@erumpay.kr",  role: "운영자",     dept: "CS",     phone: "010-6789-0123", last: "2024-04-28 13:50", status: "invited",  created: "2024-04-28" },
  { id: "u_007", name: "오현우", email: "oh@erumpay.kr",    role: "운영자",     dept: "PG운영", phone: "010-7890-1234", last: "2024-05-13 10:02", status: "inactive", created: "2024-04-02" }
];

Object.assign(window, {
  MERCHANT_BRANDS, DASHBOARD_TABLE, WAITING_MERCHANTS,
  TRANSACTIONS, SETTLEMENTS, NOTICES, AUDITS, ADMINS
});
