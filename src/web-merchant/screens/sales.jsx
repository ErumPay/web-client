/* Merchant sales management */

const SALES_BY_PERIOD = {
  day: [
    { date: "2025-05-13", amount: 3920000, count: 392, cancel: 10, refund: 4, net: 3875000 },
    { date: "2025-05-12", amount: 3750000, count: 375, cancel: 10, refund: 4, net: 3710000 },
    { date: "2025-05-11", amount: 3830000, count: 383, cancel: 8, refund: 3, net: 3795000 },
    { date: "2025-05-10", amount: 4120000, count: 412, cancel: 9, refund: 5, net: 4075000 },
    { date: "2025-05-09", amount: 3650000, count: 365, cancel: 7, refund: 2, net: 3620000 },
  ],
  week: [
    { date: "2025-05-11 ~ 2025-05-17", amount: 22680000, count: 2268, cancel: 37, refund: 17, net: 22380000 },
    { date: "2025-05-04 ~ 2025-05-10", amount: 21000000, count: 2100, cancel: 33, refund: 14, net: 20770000 },
    { date: "2025-04-27 ~ 2025-05-03", amount: 19850000, count: 1985, cancel: 28, refund: 12, net: 19640000 },
    { date: "2025-04-20 ~ 2025-04-26", amount: 18950000, count: 1895, cancel: 25, refund: 10, net: 18750000 },
  ],
  month: [
    { date: "2025-05", amount: 88800000, count: 8880, cancel: 143, refund: 65, net: 87750000 },
    { date: "2025-04", amount: 82900000, count: 8290, cancel: 133, refund: 57, net: 81930000 },
    { date: "2025-03", amount: 79500000, count: 7950, cancel: 128, refund: 52, net: 78650000 },
    { date: "2025-02", amount: 75200000, count: 7520, cancel: 118, refund: 48, net: 74380000 },
  ],
};

const SalesMetric = ({ label, value, icon, accent, footer, footerClass }) => {
  const Ico = Icons[icon];
  return (
    <div className="sales-metric">
      <div className="sales-metric-label">
        <span style={{color: accent, background: `${accent}18`}}><Ico size={18}/></span>
        {label}
      </div>
      <strong>{value}</strong>
      <small className={footerClass || ""}>{footer}</small>
    </div>
  );
};

const Sales = () => {
  const [period, setPeriod] = React.useState("day");
  const [query, setQuery] = React.useState("");
  const [expanded, setExpanded] = React.useState(null);
  const [page, setPage] = React.useState(1);

  const rows = SALES_BY_PERIOD[period].filter(row => !query || row.date.includes(query));
  const totals = rows.reduce((sum, row) => ({
    amount: sum.amount + row.amount,
    count: sum.count + row.count,
    canceled: sum.canceled + row.cancel + row.refund,
    net: sum.net + row.net,
  }), { amount: 0, count: 0, canceled: 0, net: 0 });

  return (
    <div className="page merchant-sales final-list-page">
      <div className="row between">
        <h1 className="page-title">매출 관리</h1>
        <Button kind="ghost"><Icons.Download size={14}/> 엑셀 다운로드</Button>
      </div>

      <div className="merchant-summary-grid final-summary-grid">
        <SalesMetric label="총 매출" value={fmtKRW(totals.amount)} icon="Won" accent="#2FA084" footer="이번 달"/>
        <SalesMetric label="결제" value={`${fmtNum(totals.count)}건`} icon="Up" accent="#67B173" footer="+3.2%" footerClass="positive"/>
        <SalesMetric label="취소/환불" value={`${fmtNum(totals.canceled)}건`} icon="CircleX" accent="#EF5350" footer="-1.8%" footerClass="negative"/>
        <SalesMetric label="순 매출" value={fmtKRW(totals.net)} icon="Card" accent="#54C9AF" footer="+2.4%" footerClass="positive"/>
      </div>

      <section className="final-table-card">
        <div className="final-table-title">
          <h2>매출 상세 내역</h2>
          <div className="period-tabs">
            {[["day", "일별"], ["week", "주별"], ["month", "월별"]].map(([value, label]) => (
              <button key={value} className={period === value ? "active" : ""} onClick={() => { setPeriod(value); setExpanded(null); }}>{label}</button>
            ))}
          </div>
        </div>

        <div className="final-filter-row">
          <SearchInput placeholder="날짜로 검색" value={query} onChange={setQuery}/>
          <button className="date-filter"><Icons.Calendar size={16}/></button>
          <button className="reset-filter" onClick={() => setQuery("")}>초기화</button>
        </div>

        <div className="sales-table-head">
          <span>날짜</span><span>매출액</span><span>건수</span><span>취소</span><span>환불</span><span>순매출</span>
        </div>
        {rows.map((row, index) => (
          <React.Fragment key={row.date}>
            <button className="sales-table-row" onClick={() => period === "day" && setExpanded(expanded === index ? null : index)}>
              <span><Icons.Down size={13}/>{row.date}</span>
              <strong>{fmtKRW(row.amount)}</strong>
              <span>{fmtNum(row.count)}건</span>
              <span className="t-danger">{row.cancel}건</span>
              <span className="t-warning">{row.refund}건</span>
              <strong className="t-main">{fmtKRW(row.net)}</strong>
            </button>
            {period === "day" && expanded === index && (
              <div className="sales-payment-detail">
                {[
                  ["카드", 3290000, 329, 7, 3, "card"],
                  ["간편결제", 450000, 45, 0, 0, "easy"],
                  ["현금", 180000, 18, 0, 0, "cash"],
                ].map(([name, amount, count, cancel, refund, kind]) => (
                  <div key={name} className={`sales-method ${kind}`}>
                    <strong><i/>{name}</strong>
                    <span>매출액 <b>{fmtKRW(amount)}</b></span>
                    <span>건수 <b>{count}건</b></span>
                    <span>취소 <b className="t-danger">{cancel}건</b></span>
                    <span>환불 <b className="t-warning">{refund}건</b></span>
                  </div>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}

        <div className="final-table-footer">
          <span>총 {rows.length}건</span>
          <Pager page={page} total={3} onChange={setPage}/>
        </div>
      </section>
    </div>
  );
};

window.Sales = Sales;
