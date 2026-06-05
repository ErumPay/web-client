/* Merchant sales management */

const SALES_DAILY = [
  { date: "2024-05-14", count: 128, amount: 8927000, cancelCount: 3, cancelAmount: 186000 },
  { date: "2024-05-13", count: 112, amount: 7652000, cancelCount: 2, cancelAmount: 94000 },
  { date: "2024-05-12", count: 94,  amount: 6428000, cancelCount: 1, cancelAmount: 38000 },
  { date: "2024-05-11", count: 136, amount: 9437000, cancelCount: 4, cancelAmount: 215000 },
  { date: "2024-05-10", count: 121, amount: 8036000, cancelCount: 2, cancelAmount: 118000 },
  { date: "2024-05-09", count: 87,  amount: 5834000, cancelCount: 1, cancelAmount: 42000 },
  { date: "2024-05-08", count: 76,  amount: 4921000, cancelCount: 0, cancelAmount: 0 },
];

const Sales = () => {
  const [period, setPeriod] = React.useState("week");
  const [status, setStatus] = React.useState("all");
  const [method, setMethod] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  const rows = SALES_DAILY.filter(r => !query || r.date.includes(query));

  const totals = rows.reduce((acc, r) => {
    acc.count += r.count;
    acc.amount += r.amount;
    acc.cancelCount += r.cancelCount;
    acc.cancelAmount += r.cancelAmount;
    return acc;
  }, { count: 0, amount: 0, cancelCount: 0, cancelAmount: 0 });

  const netAmount = totals.amount - totals.cancelAmount;
  const fee = Math.round(netAmount * 0.025);
  const settlementAmount = netAmount - fee;

  return (
    <div className="page merchant-sales">
      <div className="row between">
        <div className="page-header">
          <h1 className="page-title">매출관리</h1>
          <p className="page-desc">기간별 매출 집계와 취소/환불, 정산 예정 금액을 확인합니다.</p>
        </div>
        <Button kind="ghost"><Icons.Download size={14}/> 매출 내역 다운로드</Button>
      </div>

      <div className="merchant-summary-grid">
        <StatCard label="총 매출" value={fmtKRW(totals.amount)} icon="Won" accent="#2FA084"/>
        <StatCard label="결제 건수" value={fmtNum(totals.count)} unit="건" icon="Card" accent="#1F6F5F"/>
        <StatCard label="취소/환불" value={fmtKRW(totals.cancelAmount)} unit={`${totals.cancelCount}건`} icon="CircleX" accent="#EF5350"/>
        <StatCard label="정산 예정 금액" value={fmtKRW(settlementAmount)} icon="Wallet" accent="#67B173"/>
      </div>

      <div className="merchant-dashboard-grid">
        <Card title="매출 추이" action={<span className="text t-tertiary">최근 7일</span>}>
          <div className="sales-chart">
            <Sparkbars data={rows.map(r => r.amount / Math.max(...rows.map(v => v.amount)))}/>
          </div>
          <div className="row between" style={{marginTop: 12, fontSize: 12, color: "var(--text-tertiary)"}}>
            {rows.map(r => <span key={r.date}>{r.date.slice(5)}</span>)}
          </div>
        </Card>

        <Card title="매출 요약">
          <div className="settlement-summary">
            <div>
              <span>순매출</span>
              <strong>{fmtKRW(netAmount)}</strong>
            </div>
            <div>
              <span>수수료</span>
              <strong>{fmtKRW(fee)}</strong>
            </div>
            <div>
              <span>실지급 예정</span>
              <strong className="t-main">{fmtKRW(settlementAmount)}</strong>
            </div>
          </div>
        </Card>
      </div>

      <Card flush>
        <div style={{padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--border)"}}>
          <div className="filter-bar" style={{gridTemplateColumns: "160px 160px 160px 1fr auto auto"}}>
            <Field label="기간">
              <Select value={period} onChange={setPeriod} options={[
                {value: "today", label: "오늘"},
                {value: "week", label: "최근 7일"},
                {value: "month", label: "이번 달"},
              ]}/>
            </Field>
            <Field label="결제 상태">
              <Select value={status} onChange={setStatus} options={[
                {value: "all", label: "전체 상태"},
                {value: "paid", label: "결제완료"},
                {value: "canceled", label: "취소/환불"},
              ]}/>
            </Field>
            <Field label="결제 수단">
              <Select value={method} onChange={setMethod} options={[
                {value: "all", label: "전체 수단"},
                {value: "terminal", label: "단말기"},
                {value: "qr", label: "QR"},
                {value: "online", label: "온라인"},
              ]}/>
            </Field>
            <Field label="검색">
              <SearchInput placeholder="일자 검색" value={query} onChange={setQuery}/>
            </Field>
            <div style={{display: "flex", gap: 8, alignItems: "end"}}>
              <Button kind="primary"><Icons.Search size={14}/> 검색</Button>
              <Button kind="ghost" onClick={() => { setQuery(""); setPeriod("week"); setStatus("all"); setMethod("all"); }}>초기화</Button>
            </div>
            <div></div>
          </div>
        </div>

        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{width: 130}}>일자</th>
                <th className="right" style={{width: 110}}>결제 건수</th>
                <th className="right" style={{width: 140}}>결제 금액</th>
                <th className="right" style={{width: 110}}>취소 건수</th>
                <th className="right" style={{width: 140}}>취소/환불 금액</th>
                <th className="right" style={{width: 140}}>순매출</th>
                <th className="right" style={{width: 120}}>수수료</th>
                <th className="right" style={{width: 140}}>정산 예정금</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const dailyNet = r.amount - r.cancelAmount;
                const dailyFee = Math.round(dailyNet * 0.025);
                return (
                  <tr key={r.date}>
                    <td className="num">{r.date}</td>
                    <td className="right num">{fmtNum(r.count)}건</td>
                    <td className="right num">{fmtKRW(r.amount)}</td>
                    <td className="right num t-danger">{fmtNum(r.cancelCount)}건</td>
                    <td className="right num t-danger">{fmtKRW(r.cancelAmount)}</td>
                    <td className="right num" style={{fontWeight: 700}}>{fmtKRW(dailyNet)}</td>
                    <td className="right num t-tertiary">{fmtKRW(dailyFee)}</td>
                    <td className="right num t-main" style={{fontWeight: 700}}>{fmtKRW(dailyNet - dailyFee)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{background: "var(--bg-subtle)", fontWeight: 700}}>
                <td style={{padding: "var(--s-3) var(--s-4)"}}>합계</td>
                <td className="right num" style={{padding: "var(--s-3) var(--s-4)"}}>{fmtNum(totals.count)}건</td>
                <td className="right num" style={{padding: "var(--s-3) var(--s-4)"}}>{fmtKRW(totals.amount)}</td>
                <td className="right num" style={{padding: "var(--s-3) var(--s-4)"}}>{fmtNum(totals.cancelCount)}건</td>
                <td className="right num" style={{padding: "var(--s-3) var(--s-4)"}}>{fmtKRW(totals.cancelAmount)}</td>
                <td className="right num" style={{padding: "var(--s-3) var(--s-4)"}}>{fmtKRW(netAmount)}</td>
                <td className="right num" style={{padding: "var(--s-3) var(--s-4)"}}>{fmtKRW(fee)}</td>
                <td className="right num" style={{padding: "var(--s-3) var(--s-4)"}}>{fmtKRW(settlementAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="row between" style={{padding: "var(--s-4) var(--s-5)"}}>
          <div className="text t-tertiary">총 {rows.length}일</div>
          <Pager page={page} total={4} onChange={setPage}/>
        </div>
      </Card>
    </div>
  );
};

window.Sales = Sales;
