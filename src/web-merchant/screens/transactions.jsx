/* Merchant transaction monitoring */

const enhanceTransaction = (tx, index) => ({
  ...tx,
  approvalNo: tx.status === "failed" ? "—" : String(30482817 + index * 37),
  risk: index === 6 || tx.status === "failed",
  authType: index % 6 === 0 ? "void" : index % 5 === 0 ? "auth" : "capture",
  terminalId: index % 4 === 0 ? "QR-PAY" : "TML-A001",
});

const Transactions = ({ onOpen }) => {
  const [tab, setTab] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [method, setMethod] = React.useState("all");
  const [dateFrom, setDateFrom] = React.useState("2024-05-14");
  const [dateTo, setDateTo] = React.useState("2024-05-14");
  const [page, setPage] = React.useState(1);

  const rows = window.MerchantApi.getTransactions().map(enhanceTransaction);

  const filtered = rows.filter(t => {
    const tabMatched =
      tab === "all" ||
      (tab === "approved" && t.status === "paid") ||
      (tab === "canceled" && (t.status === "refunded" || t.status === "canceled")) ||
      (tab === "failed" && t.status === "failed") ||
      (tab === "auth" && (t.authType === "auth" || t.authType === "void")) ||
      (tab === "risk" && t.risk);

    return tabMatched &&
      (!query || t.id.includes(query) || t.approvalNo.includes(query)) &&
      (status === "all" || t.status === status) &&
      (method === "all" || t.method === method);
  });

  const totals = rows.reduce((acc, t) => {
    if (t.status === "paid") {
      acc.paidCount += 1;
      acc.paid += t.amount;
    }
    if (t.status === "refunded" || t.status === "canceled") {
      acc.canceled += t.amount;
      acc.canceledCount += 1;
    }
    if (t.status === "failed" || t.risk) acc.riskCount += 1;
    return acc;
  }, {paid: 0, paidCount: 0, canceled: 0, canceledCount: 0, riskCount: 0});

  return (
    <div className="page merchant-transactions">
      <div className="row between">
        <div className="page-header">
          <h1 className="page-title">거래관리</h1>
          <p className="page-desc">전체 결제 내역과 승인, 실패, 취소 상태를 확인합니다.</p>
        </div>
        <Button kind="ghost"><Icons.Download size={14}/> 거래 내역 다운로드</Button>
      </div>

      <div className="merchant-summary-grid">
        <StatCard label="전체 거래 건수" value={fmtNum(rows.length)} unit="건" icon="Card" accent="#2FA084"/>
        <StatCard label="결제완료 금액" value={fmtKRW(totals.paid)} unit={`${totals.paidCount}건`} icon="Won" accent="#1F6F5F"/>
        <StatCard label="취소/환불 금액" value={fmtKRW(totals.canceled)} unit={`${totals.canceledCount}건`} icon="CircleX" accent="#FF662F"/>
        <StatCard label="실패/이상 거래" value={fmtNum(totals.riskCount)} unit="건" icon="Warning" accent="#EF5350"/>
      </div>

      <Card flush>
        <div style={{padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--border)"}}>
          <Tabs value={tab} onChange={setTab} items={[
            {value: "all", label: `전체 (${rows.length})`},
            {value: "approved", label: "승인"},
            {value: "canceled", label: "취소/환불"},
            {value: "failed", label: "실패"},
            {value: "auth", label: "가승인/Void"},
            {value: "risk", label: "이상거래"},
          ]}/>

          <div className="filter-bar" style={{gridTemplateColumns: "150px 150px 160px 150px 1fr auto auto"}}>
            <Field label="시작일">
              <DateInput value={dateFrom} onChange={setDateFrom}/>
            </Field>
            <Field label="종료일">
              <DateInput value={dateTo} onChange={setDateTo}/>
            </Field>
            <Field label="결제 상태">
              <Select value={status} onChange={setStatus} options={[
                {value: "all", label: "전체 상태"},
                {value: "paid", label: "결제완료"},
                {value: "refunded", label: "환불"},
                {value: "canceled", label: "취소"},
                {value: "failed", label: "실패"},
              ]}/>
            </Field>
            <Field label="결제 수단">
              <Select value={method} onChange={setMethod} options={[
                {value: "all", label: "전체 수단"},
                {value: "단말기", label: "단말기"},
                {value: "QR", label: "QR"},
              ]}/>
            </Field>
            <Field label="검색">
              <SearchInput placeholder="거래번호, 승인번호" value={query} onChange={setQuery}/>
            </Field>
            <div style={{display: "flex", gap: 8, alignItems: "end"}}>
              <Button kind="primary"><Icons.Search size={14}/> 검색</Button>
              <Button kind="ghost" onClick={() => { setQuery(""); setStatus("all"); setMethod("all"); setTab("all"); }}>초기화</Button>
            </div>
            <div></div>
          </div>
        </div>

        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{width: 170}}>거래번호</th>
                <th style={{width: 150}}>결제일시</th>
                <th style={{width: 90}}>결제수단</th>
                <th style={{width: 110}}>카드사</th>
                <th style={{width: 110}}>승인번호</th>
                <th className="right" style={{width: 130}}>결제 금액</th>
                <th className="center" style={{width: 90}}>상태</th>
                <th className="center" style={{width: 90}}>분류</th>
                <th style={{width: 70}}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="clickable" onClick={() => onOpen?.(t)}>
                  <td className="mono num">{t.id}</td>
                  <td className="num t-tertiary">{t.time}</td>
                  <td>{t.method}</td>
                  <td>{t.card}</td>
                  <td className="mono num">{t.approvalNo}</td>
                  <td className="right num" style={t.status === "refunded" || t.status === "canceled" ? {color: "var(--c-warning)"} : {}}>
                    {(t.status === "refunded" ? "- " : "") + fmtKRW(t.amount)}
                  </td>
                  <td className="center"><StatusTag status={t.status}/></td>
                  <td className="center">
                    {t.risk ? <Tag kind="danger">이상</Tag> : t.authType === "void" ? <Tag kind="warning">Void</Tag> : t.authType === "auth" ? <Tag kind="info">가승인</Tag> : <Tag kind="neutral">일반</Tag>}
                  </td>
                  <td><Button kind="text" size="sm" onClick={(e) => { e.stopPropagation(); onOpen?.(t); }}>상세 <Icons.Right size={12}/></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row between" style={{padding: "var(--s-4) var(--s-5)"}}>
          <div className="text t-tertiary">총 {filtered.length}건</div>
          <Pager page={page} total={12} onChange={setPage}/>
        </div>
      </Card>
    </div>
  );
};

const TransactionDrawer = ({ tx, onClose }) => {
  if (!tx) return null;
  const fee = Math.round(tx.amount * 0.025);

  return (
    <React.Fragment>
      <div className="drawer-mask" onClick={onClose}/>
      <aside className="drawer">
        <div className="drawer-head">
          <div>
            <div className="text t-tertiary">거래번호</div>
            <div className="mono" style={{fontSize: 16, fontWeight: 700, marginTop: 2}}>{tx.id}</div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icons.Close size={18}/></button>
        </div>
        <div className="drawer-body">
          <div style={{padding: 24, background: "var(--bg-subtle)", borderRadius: 12, textAlign: "center", marginBottom: 20}}>
            <StatusTag status={tx.status}/>
            <div className="h2" style={{margin: "12px 0 4px"}}>{fmtKRW(tx.amount)}</div>
            <div className="text t-tertiary">{tx.time}</div>
          </div>

          <div className="row" style={{gap: 8, marginBottom: 16}}>
            {tx.status === "paid" && <Button kind="danger" size="sm">결제 취소 요청</Button>}
            {tx.status === "paid" && <Button kind="ghost" size="sm">부분 환불 요청</Button>}
            <Button kind="ghost" size="sm">영수증 보기</Button>
            <Button kind="ghost" size="sm">처리 로그</Button>
          </div>

          <h3 style={{fontSize: 14, margin: "16px 0 8px"}}>거래 정보</h3>
          <InfoGrid rows={[
            ["결제 수단", tx.method, "단말기 ID", tx.terminalId],
            ["거래 분류", tx.risk ? "이상거래" : tx.authType === "void" ? "Void" : tx.authType === "auth" ? "가승인" : "일반 승인", "상태", <StatusTag status={tx.status}/>],
          ]}/>

          <h3 style={{fontSize: 14, margin: "24px 0 8px"}}>승인 정보</h3>
          <InfoGrid rows={[
            ["카드사", tx.card, "할부", "일시불"],
            ["승인번호", tx.approvalNo, "원거래번호", tx.status === "refunded" || tx.status === "canceled" ? "TX2024051300102" : "—"],
            ["승인금액", fmtKRW(tx.amount), "수수료", fmtKRW(fee)],
            ["부가세", fmtKRW(Math.round(tx.amount / 11)), "정산예정금", fmtKRW(tx.amount - fee)],
          ]}/>

          <h3 style={{fontSize: 14, margin: "24px 0 8px"}}>처리 이력</h3>
          <div className="col" style={{gap: 0, paddingLeft: 4}}>
            {[
              {t: tx.time, e: tx.status === "failed" ? "결제 승인 실패" : "결제 승인 완료", u: "ErumPay"},
              {t: "2024-05-14 14:00:32", e: "결제 요청 수신", u: tx.terminalId},
              ...(tx.risk ? [{t: "2024-05-14 14:00:35", e: "이상거래 모니터링 대상 지정", u: "시스템"}] : []),
            ].map((ev, i) => (
              <div key={i} className="row" style={{gap: 12, padding: "8px 0", borderLeft: "2px solid var(--c-main)", paddingLeft: 12}}>
                <div style={{fontSize: 12, color: "var(--text-tertiary)", width: 140}}>{ev.t}</div>
                <div style={{flex: 1}}>
                  <div style={{fontSize: 13, fontWeight: 600}}>{ev.e}</div>
                  <div className="text t-tertiary">{ev.u}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </React.Fragment>
  );
};

Object.assign(window, { Transactions, TransactionDrawer });
