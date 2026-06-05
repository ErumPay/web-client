/* Temporary API adapter for merchant web */

const createMerchants = () => MERCHANT_BRANDS.map((b, i) => ({
  ...b,
  bizNo: ["123-45-67890","234-56-78901","345-67-89012","456-78-90123","567-89-01234","678-90-12345","789-01-23456","890-12-34567","901-23-45678","012-34-56789"][i],
  rep: ["김태형","이서연","박지훈","정수민","최예진","강민재","윤하늘","조서영","임도윤","한지호"][i],
  category: ["리테일","F&B","F&B","리테일","F&B","리테일","리테일","F&B","F&B","서비스"][i],
  joined: ["2022-08-12","2022-11-04","2023-02-19","2021-06-30","2023-09-22","2022-04-14","2021-12-01","2024-01-15","2023-05-08","2024-04-02"][i],
  status: ["normal","normal","normal","caution","normal","normal","caution","normal","normal","normal"][i],
  terminals: [12, 4, 2, 8, 3, 6, 5, 2, 1, 2][i],
  mtdAmount: [1248000000, 781000000, 412000000, 524000000, 312000000, 226000000, 198000000, 121000000, 82000000, 64000000][i],
  fee: 2.5,
}));

const SALES_DAILY_MOCK = [
  { date: "2024-05-14", count: 128, amount: 8927000, cancelCount: 3, cancelAmount: 186000 },
  { date: "2024-05-13", count: 112, amount: 7652000, cancelCount: 2, cancelAmount: 94000 },
  { date: "2024-05-12", count: 94, amount: 6428000, cancelCount: 1, cancelAmount: 38000 },
  { date: "2024-05-11", count: 136, amount: 9437000, cancelCount: 4, cancelAmount: 215000 },
  { date: "2024-05-10", count: 121, amount: 8036000, cancelCount: 2, cancelAmount: 118000 },
  { date: "2024-05-09", count: 87, amount: 5834000, cancelCount: 1, cancelAmount: 42000 },
  { date: "2024-05-08", count: 76, amount: 4921000, cancelCount: 0, cancelAmount: 0 },
];

const MERCHANT_SETTLEMENTS_MOCK = [
  { id: "STL-202405-W20", period: "2024-05-13 ~ 2024-05-19", payDate: "2024-05-20", gross: 12450000, canceled: 385000, fee: 301625, status: "pending", account: "신한은행 110-***-******" },
  { id: "STL-202405-W19", period: "2024-05-06 ~ 2024-05-12", payDate: "2024-05-13", gross: 10872000, canceled: 228000, fee: 261850, status: "paid", account: "신한은행 110-***-******" },
  { id: "STL-202405-W18", period: "2024-04-29 ~ 2024-05-05", payDate: "2024-05-07", gross: 9840000, canceled: 142000, fee: 246950, status: "paid", account: "신한은행 110-***-******" },
  { id: "STL-202404-W17", period: "2024-04-22 ~ 2024-04-28", payDate: "2024-04-29", gross: 8934000, canceled: 188000, fee: 217650, status: "paid", account: "신한은행 110-***-******" },
  { id: "STL-202404-W16", period: "2024-04-15 ~ 2024-04-21", payDate: "2024-04-22", gross: 7620000, canceled: 94000, fee: 190650, status: "paid", account: "신한은행 110-***-******" },
  { id: "STL-202404-W15", period: "2024-04-08 ~ 2024-04-14", payDate: "2024-04-15", gross: 7115000, canceled: 0, fee: 177875, status: "paid", account: "신한은행 110-***-******" },
  { id: "STL-202404-W14", period: "2024-04-01 ~ 2024-04-07", payDate: "2024-04-08", gross: 6582000, canceled: 76000, fee: 163950, status: "paid", account: "신한은행 110-***-******" },
];

const CHANGE_LOGS_MOCK = [
  ["2026-06-03", "정산 계좌 검증 완료"],
  ["2026-05-28", "사업자 정보 수정 요청 승인"],
  ["2026-05-20", "가게 운영 상태 정상 전환"],
];

const DASHBOARD_TASKS_MOCK = [
  ["정산 계좌 확인", "정산 정보 변경 요청이 접수되었습니다.", "pending"],
  ["영수증 재발행 문의", "거래번호 TX2024051400120", "approved"],
  ["공지 확인", "단말기 보안 업데이트 안내", "waiting"],
];

const clone = (value) => JSON.parse(JSON.stringify(value));

const MerchantApi = {
  getMerchants: () => createMerchants(),
  getDashboard: () => ({
    transactions: clone(TRANSACTIONS),
    salesTrend: [0.42, 0.58, 0.52, 0.68, 0.61, 0.76, 0.84],
    nextSettlementDate: "2024-05-20",
    tasks: clone(DASHBOARD_TASKS_MOCK),
  }),
  getSalesDaily: () => clone(SALES_DAILY_MOCK),
  getTransactions: () => clone(TRANSACTIONS),
  getSettlements: () => clone(MERCHANT_SETTLEMENTS_MOCK),
  getMerchantProfile: () => {
    const merchant = createMerchants()[0];
    return {
      ...merchant,
      store: {
        name: `${merchant.name} 강남점`,
        phone: "02-1234-5678",
        email: "store@erumpay.kr",
        address: "서울특별시 강남구 테헤란로 123",
        hours: "10:00 - 22:00",
      },
      business: {
        type: "소매",
        item: merchant.category,
        openedAt: "2023-02-01",
        address: "서울특별시 강남구 테헤란로 123",
        documentName: "사업자등록증.pdf",
        documentSubmittedAt: "2026-05-28",
      },
      settlement: {
        bank: "신한은행",
        accountNo: "110-***-******",
        cycle: "주 1회",
        nextPayDate: "2026-06-10",
        basis: "승인일 + 3영업일",
        method: "자동 입금",
        payTime: "오후 2시 이후",
        minAmount: 10000,
        holdRule: "취소/환불 발생 시",
        lastPayDate: "2026-06-03",
        lastPayAmount: 8437000,
      },
      changeLogs: clone(CHANGE_LOGS_MOCK),
    };
  },
};

Object.assign(window, { MerchantApi });
