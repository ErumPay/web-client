/* Merchant sales overview */

const Sales = () => {
  const [period, setPeriod] = React.useState("today");
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  const rows = TRANSACTIONS.filter(t =>
    !query || t.id.includes(query) || t.card.includes(query) || t.method.includes(query)
  );

  const totals = rows.reduce((acc, t) => {
    if (t.status === "paid") {
      acc.count += 1;
      acc.amount += t.amount;
    }
    if (t.status === "refunded" || t.status === "canceled") {
      acc.cancel += t.amount;
    }
    return acc;
  }, { count: 0, amount: 0, cancel: 0 });

  return (
    <div className="page">
      <div className="row between">
        <div className="page-header">
          <h1 className="page-title">매출 관리</h1>
          <p className="page-desc">일자별 결제 매출과 취소 금액을 확인합니다.</p>
        </div>
        <Button kind="ghost"><Icons.Download size={14}/> 매출 내역 다운로드</Button>
      </div>

      <div className="stat-grid" style={{gridTemplateColumns: "repeat(4, 1fr)"}}>
        <StatCard label="오늘 매출" value={fmtKRW(totals.amount)} icon="Won" accent="#2FB484"/>
        <StatCard label="오늘 결제 건수" value={fmtNum(totals.count)} unit="건" icon="Card" accent="#1F6F5F"/>
        <StatCard label="취소/환불 금액" value={fmtKRW(totals.cancel)} icon="CircleX" accent="#FF662F"/>
        <StatCard label="정산 예정 금액" value={fmtKRW(Math.round(totals.amount * 0.975))} icon="Wallet" accent="#67B173"/>
      </div>

      <div className="grid-3">
        <Card title="매출 추이" action={<span className="text t-tertiary">최근 7일</span>}>
          <Sparkbars data={[0.42,0.58,0.54,0.68,0.61,0.76,0.82]}/>
          <div className="row between" style={{marginTop: 8, fontSize: 11, color: "var(--text-tertiary)"}}>
            <span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span><span>일</span>
          </div>
        </Card>
        <Card title="결제 수단별 비중">
          <div className="col" style={{gap: 8}}>
            {[
              ["단말기", 74, "#2FB484"],
              ["QR", 18, "#1F6F5F"],
              ["온라인", 8, "#C5A86F"],
            ].map(([label, pct, color]) => (
              <div key={label}>
                <div className="row between" style={{fontSize: 12, marginBottom: 4}}>
                  <span>{label}</span><span className="num t-tertiary">{pct}%</span>
                </div>
                <div style={{height: 6, background: "var(--c-grey-3)", borderRadius: 999}}>
                  <div style={{width: pct + "%", height: "100%", background: color, borderRadius: 999}}/>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="입금 예정">
          <InfoGrid rows={[
            ["다음 정산일", "2024-05-20", "정산 주기", "주 1회"],
            ["예상 수수료", fmtKRW(Math.round(totals.amount * 0.025)), "실지급액", fmtKRW(Math.round(totals.amount * 0.975))],
          ]}/>
        </Card>
      </div>

      <Card flush>
        <div style={{padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--border)"}}>
          <div className="filter-bar" style={{gridTemplateColumns: "180px 1fr auto auto"}}>
            <Field label="기간">
              <Select value={period} onChange={setPeriod} options={[
                {value: "today", label: "오늘"},
                {value: "week", label: "최근 7일"},
                {value: "month", label: "이번 달"},
              ]}/>
            </Field>
            <Field label="검색">
              <SearchInput placeholder="거래번호, 카드사, 결제 수단" value={query} onChange={setQuery}/>
            </Field>
            <div style={{display: "flex", gap: 8, alignItems: "end"}}>
              <Button kind="primary"><Icons.Search size={14}/> 검색</Button>
              <Button kind="ghost" onClick={() => { setQuery(""); setPeriod("today"); }}>초기화</Button>
            </div>
            <div></div>
          </div>
        </div>

        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{width: 150}}>결제일시</th>
                <th style={{width: 170}}>거래번호</th>
                <th style={{width: 110}}>카드사</th>
                <th style={{width: 80}}>수단</th>
                <th className="right" style={{width: 130}}>결제 금액</th>
                <th className="right" style={{width: 120}}>수수료</th>
                <th className="right" style={{width: 130}}>정산 예정금</th>
                <th className="center" style={{width: 90}}>상태</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(t => {
                const fee = Math.round(t.amount * 0.025);
                return (
                  <tr key={t.id}>
                    <td className="num t-tertiary">{t.time}</td>
                    <td className="mono num">{t.id}</td>
                    <td>{t.card}</td>
                    <td>{t.method}</td>
                    <td className="right num">{fmtKRW(t.amount)}</td>
                    <td className="right num t-tertiary">{fmtKRW(fee)}</td>
                    <td className="right num" style={{fontWeight: 700}}>{fmtKRW(t.amount - fee)}</td>
                    <td className="center"><StatusTag status={t.status}/></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="row between" style={{padding: "var(--s-4) var(--s-5)"}}>
          <div className="text t-tertiary">총 {rows.length}건</div>
          <Pager page={page} total={8} onChange={setPage}/>
        </div>
      </Card>
    </div>
  );
};

window.Sales = Sales;
