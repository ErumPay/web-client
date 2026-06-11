/* Transactions list */

const Transactions = ({ onOpen }) => {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [method, setMethod] = React.useState("all");
  const [dateFrom, setDateFrom] = React.useState("2024-05-14");
  const [dateTo, setDateTo] = React.useState("2024-05-14");
  const [page, setPage] = React.useState(1);

  const filtered = TRANSACTIONS.filter(t =>
    (!query || t.id.includes(query) || t.brand.name.includes(query) || t.brand.mid.includes(query)) &&
    (status === "all" || t.status === status) &&
    (method === "all" || t.method === method)
  );

  const totals = filtered.reduce((acc, t) => {
    if (t.status === "paid") acc.paid += t.amount;
    if (t.status === "refunded" || t.status === "canceled") acc.refunded += t.amount;
    return acc;
  }, {paid: 0, refunded: 0});

  return (
    <div className="page">
      <div className="row between">
        <div className="page-header">
          <h1 className="page-title">결제관리</h1>
          <p className="page-desc">실시간 결제 내역과 결제 상태를 조회·관리합니다.</p>
        </div>
        <div className="row" style={{gap: 8}}>
          <Button kind="ghost"><Icons.Download size={14}/> 엑셀 다운로드</Button>
          <Button kind="primary">강제 취소 처리</Button>
        </div>
      </div>

      {/* Summary chips */}
      <div className="stat-grid" style={{gridTemplateColumns: "repeat(4, 1fr)"}}>
        <StatCard label="결제 건수"      value={fmtNum(filtered.length)} unit="건" icon="Card"   accent="#2FB484"/>
        <StatCard label="결제 금액"      value={fmtKRW(totals.paid)}               icon="Won"    accent="#1F6F5F"/>
        <StatCard label="환불/취소 금액" value={fmtKRW(totals.refunded)}           icon="CircleX" accent="#FF9F2F"/>
        <StatCard label="실패 건수"      value="2" unit="건"                       icon="Warning" accent="#EF5350"/>
      </div>

      <Card flush>
        <div style={{padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--border)"}}>
          <div className="filter-bar" style={{gridTemplateColumns: "180px 180px 180px 1fr auto auto"}}>
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
            <Field label="검색">
              <SearchInput placeholder="거래번호, 가맹점명, MID" value={query} onChange={setQuery}/>
            </Field>
            <div style={{display: "flex", gap: 8, alignItems: "end"}}>
              <Button kind="primary"><Icons.Search size={14}/> 검색</Button>
              <Button kind="ghost" onClick={() => { setQuery(""); setStatus("all"); }}>초기화</Button>
            </div>
            <div></div>
          </div>
          <div className="row" style={{marginTop: 12, gap: 4, flexWrap: "wrap"}}>
            <Button kind={method === "all" ? "primary" : "ghost"} size="sm" onClick={() => setMethod("all")}>전체</Button>
            <Button kind={method === "단말기" ? "primary" : "ghost"} size="sm" onClick={() => setMethod("단말기")}>단말기</Button>
            <Button kind={method === "QR" ? "primary" : "ghost"} size="sm" onClick={() => setMethod("QR")}>QR</Button>
            <Button kind="ghost" size="sm">온라인</Button>
            <Button kind="ghost" size="sm">현장결제</Button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{width: 36}}><input type="checkbox"/></th>
                <th style={{width: 170}}>거래번호</th>
                <th style={{width: 150}}>결제일시</th>
                <th>가맹점</th>
                <th style={{width: 110}}>카드사</th>
                <th style={{width: 70}}>수단</th>
                <th className="right" style={{width: 120}}>결제 금액</th>
                <th className="center" style={{width: 90}}>상태</th>
                <th style={{width: 60}}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="clickable" onClick={() => onOpen?.(t)}>
                  <td onClick={e => e.stopPropagation()}><input type="checkbox"/></td>
                  <td className="mono num">{t.id}</td>
                  <td className="num t-tertiary">{t.time}</td>
                  <td><BrandCell {...t.brand}/></td>
                  <td>{t.card}</td>
                  <td>{t.method}</td>
                  <td className="right num" style={t.status === "refunded" || t.status === "canceled" ? {color: "var(--c-warning)"} : {}}>
                    {(t.status === "refunded" ? "- " : "") + fmtKRW(t.amount)}
                  </td>
                  <td className="center"><StatusTag status={t.status}/></td>
                  <td><Button kind="text" size="sm" onClick={(e) => { e.stopPropagation(); onOpen?.(t); }}>상세 <Icons.Right size={12}/></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row between" style={{padding: "var(--s-4) var(--s-5)"}}>
          <div className="text t-tertiary">총 {filtered.length}건</div>
          <Pager page={page} total={28} onChange={setPage}/>
        </div>
      </Card>
    </div>
  );
};

const TransactionDrawer = ({ tx, onClose }) => {
  if (!tx) return null;
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
            {tx.status === "paid" && <Button kind="danger" size="sm">결제 취소</Button>}
            {tx.status === "paid" && <Button kind="ghost" size="sm">부분 환불</Button>}
            <Button kind="ghost" size="sm">영수증 보기</Button>
            <Button kind="ghost" size="sm">로그 보기</Button>
          </div>

          <h3 style={{fontSize: 14, margin: "16px 0 8px"}}>가맹점 정보</h3>
          <InfoGrid rows={[
            ["가맹점명", tx.brand.name, "MID", tx.brand.mid],
            ["단말기 ID", "TML-A001", "결제 수단", tx.method],
          ]}/>

          <h3 style={{fontSize: 14, margin: "24px 0 8px"}}>결제 정보</h3>
          <InfoGrid rows={[
            ["카드사", tx.card, "할부", "일시불"],
            ["승인번호", "30482817", "원거래번호", "—"],
            ["승인금액", fmtKRW(tx.amount), "수수료", fmtKRW(Math.round(tx.amount * 0.025))],
            ["부가세", fmtKRW(Math.round(tx.amount / 11)), "정산예정금", fmtKRW(tx.amount - Math.round(tx.amount * 0.025))],
          ]}/>

          <h3 style={{fontSize: 14, margin: "24px 0 8px"}}>처리 이력</h3>
          <div className="col" style={{gap: 0, paddingLeft: 4}}>
            {[
              {t: tx.time, e: "결제 승인 완료",   u: "시스템"},
              {t: "2024-05-14 14:00:32", e: "결제 요청 수신", u: "단말 TML-A001"},
            ].map((ev, i) => (
              <div key={i} className="row" style={{gap: 12, padding: "8px 0", borderLeft: "2px solid var(--c-primary)", paddingLeft: 12}}>
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
