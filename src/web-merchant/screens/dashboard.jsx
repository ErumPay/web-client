/* Merchant dashboard */

const StatCard = ({ label, value, unit, delta, deltaDir, icon, accent }) => {
  const Ico = icon ? Icons[icon] : null;
  return (
    <div className="stat merchant-stat">
      <div className="stat-head">
        <span>{label}</span>
        {Ico && <span className="stat-ico" style={accent ? {background: accent + "22", color: accent} : {}}><Ico size={16}/></span>}
      </div>
      <div className="stat-value">
        {value}
        {unit && <span className="unit">{unit}</span>}
      </div>
      {delta !== undefined && (
        <div className={`stat-delta ${deltaDir === "up" ? "up" : deltaDir === "down" ? "down" : ""}`}>
          <span>전일 대비</span>
          {deltaDir === "up" && <Icons.Up size={12}/>}
          {deltaDir === "down" && <Icons.Down size={12}/>}
          <strong>{delta}</strong>
        </div>
      )}
    </div>
  );
};

const Sparkbars = ({ data }) => (
  <div className="bar-row">
    {data.map((v, i) => (
      <div key={i} className={`bar ${i === data.length - 1 ? "hi" : ""}`} style={{height: (v * 100) + "%"}}/>
    ))}
  </div>
);

const Dashboard = () => {
  const [period, setPeriod] = React.useState("today");

  const paidTransactions = TRANSACTIONS.filter(t => t.status === "paid");
  const canceledTransactions = TRANSACTIONS.filter(t => t.status === "failed" || t.status === "refunded" || t.status === "canceled");
  const todayAmount = paidTransactions.reduce((sum, t) => sum + t.amount, 0);
  const cancelAmount = canceledTransactions.reduce((sum, t) => sum + t.amount, 0);
  const expectedSettlement = Math.round(todayAmount * 0.975);
  const cancelRate = ((canceledTransactions.length / TRANSACTIONS.length) * 100).toFixed(1);

  const recentRows = TRANSACTIONS.slice(0, 7);

  return (
    <div className="page merchant-dashboard">
      <div className="row between">
        <div className="page-header">
          <h1 className="page-title">대시보드</h1>
          <p className="page-desc">내 가게의 매출, 거래, 정산 현황을 한눈에 확인합니다.</p>
        </div>
        <div className="row" style={{gap: 8}}>
          <Select value={period} onChange={setPeriod} options={[
            {value: "today", label: "오늘"},
            {value: "week", label: "최근 7일"},
            {value: "month", label: "이번 달"},
          ]}/>
          <Button kind="ghost"><Icons.Download size={14}/> 다운로드</Button>
        </div>
      </div>

      <div className="merchant-summary-grid">
        <StatCard label="오늘 결제 금액" value={fmtKRW(todayAmount)} delta="8.7%" deltaDir="up" icon="Won" accent="#2FA084"/>
        <StatCard label="오늘 결제 건수" value={fmtNum(paidTransactions.length)} unit="건" delta="3건" deltaDir="up" icon="Card" accent="#1F6F5F"/>
        <StatCard label="실패/취소 건수" value={fmtNum(canceledTransactions.length)} unit="건" delta={`${cancelRate}%`} deltaDir="down" icon="CircleX" accent="#EF5350"/>
        <StatCard label="정산 예정 금액" value={fmtKRW(expectedSettlement)} icon="Wallet" accent="#67B173"/>
      </div>

      <div className="merchant-dashboard-grid">
        <Card title="매출 추이" action={<span className="text t-tertiary">최근 7일</span>}>
          <div className="sales-chart">
            <Sparkbars data={[0.42, 0.58, 0.52, 0.68, 0.61, 0.76, 0.84]}/>
          </div>
          <div className="row between" style={{marginTop: 12, fontSize: 12, color: "var(--text-tertiary)"}}>
            <span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span><span>오늘</span>
          </div>
        </Card>

        <Card title="정산 현황">
          <div className="settlement-summary">
            <div>
              <span>다음 정산일</span>
              <strong>2024-05-20</strong>
            </div>
            <div>
              <span>수수료</span>
              <strong>{fmtKRW(Math.round(todayAmount * 0.025))}</strong>
            </div>
            <div>
              <span>실지급 예정</span>
              <strong className="t-main">{fmtKRW(expectedSettlement)}</strong>
            </div>
          </div>
        </Card>
      </div>

      <div className="merchant-dashboard-grid lower">
        <Card flush>
          <div className="card-head">
            <h3>최근 거래 내역</h3>
            <Button kind="text" size="sm">전체 보기 <Icons.Right size={12}/></Button>
          </div>
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{width: 160}}>결제일시</th>
                  <th style={{width: 170}}>거래번호</th>
                  <th style={{width: 110}}>카드사</th>
                  <th style={{width: 80}}>수단</th>
                  <th className="right" style={{width: 130}}>결제 금액</th>
                  <th className="center" style={{width: 90}}>상태</th>
                </tr>
              </thead>
              <tbody>
                {recentRows.map(t => (
                  <tr key={t.id}>
                    <td className="num t-tertiary">{t.time}</td>
                    <td className="mono num">{t.id}</td>
                    <td>{t.card}</td>
                    <td>{t.method}</td>
                    <td className="right num">{fmtKRW(t.amount)}</td>
                    <td className="center"><StatusTag status={t.status}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="처리 필요 항목">
          <div className="col" style={{gap: 8}}>
            {[
              ["정산 계좌 확인", "정산 정보 변경 요청이 접수되었습니다.", "pending"],
              ["영수증 재발행 문의", "거래번호 TX2024051400120", "approved"],
              ["공지 확인", "단말기 보안 업데이트 안내", "waiting"],
            ].map(([title, desc, status]) => (
              <div key={title} className="dashboard-task">
                <div>
                  <strong>{title}</strong>
                  <span>{desc}</span>
                </div>
                <StatusTag status={status}/>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

Object.assign(window, { Dashboard, StatCard, Sparkbars });
