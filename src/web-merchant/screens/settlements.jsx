/* Merchant settlements */

const settlementNet = (s) => s.gross - s.canceled - s.fee;

const Settlements = () => {
  const [period, setPeriod] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState(null);

  const settlements = window.MerchantApi.getSettlements();
  const filtered = settlements.filter(s =>
    (status === "all" || s.status === status) &&
    (!query || s.id.includes(query) || s.period.includes(query)) &&
    (period === "all" || s.id.includes(period))
  );

  const totals = filtered.reduce((acc, s) => {
    acc.gross += s.gross;
    acc.canceled += s.canceled;
    acc.fee += s.fee;
    acc.net += settlementNet(s);
    if (s.status === "pending") acc.pending += settlementNet(s);
    if (s.status === "paid") acc.paid += settlementNet(s);
    return acc;
  }, {gross: 0, canceled: 0, fee: 0, net: 0, pending: 0, paid: 0});

  return (
    <div className="page merchant-settlements">
      <div className="row between">
        <div className="page-header">
          <h1 className="page-title">정산관리</h1>
          <p className="page-desc">정산 예정/완료 상태와 수수료, 실지급액을 확인합니다.</p>
        </div>
        <Button kind="ghost"><Icons.Download size={14}/> 정산 명세 다운로드</Button>
      </div>

      <div className="merchant-summary-grid">
        <StatCard label="정산 예정 금액" value={fmtKRW(totals.pending)} icon="Wallet" accent="#2FA084"/>
        <StatCard label="지급 완료 금액" value={fmtKRW(totals.paid)} icon="CircleCheck" accent="#67B173"/>
        <StatCard label="총 수수료" value={fmtKRW(totals.fee)} icon="Card" accent="#C5A86F"/>
        <StatCard label="취소/환불 금액" value={fmtKRW(totals.canceled)} icon="CircleX" accent="#EF5350"/>
      </div>

      <Card flush>
        <div style={{padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--border)"}}>
          <div className="filter-bar" style={{gridTemplateColumns: "180px 180px 1fr auto auto"}}>
            <Field label="정산 기간">
              <Select value={period} onChange={setPeriod} options={[
                {value: "all", label: "전체 기간"},
                {value: "202405", label: "2024년 5월"},
                {value: "202404", label: "2024년 4월"},
              ]}/>
            </Field>
            <Field label="정산 상태">
              <Select value={status} onChange={setStatus} options={[
                {value: "all", label: "전체 상태"},
                {value: "pending", label: "지급대기"},
                {value: "paid", label: "지급완료"},
              ]}/>
            </Field>
            <Field label="검색">
              <SearchInput placeholder="정산번호, 정산 기간" value={query} onChange={setQuery}/>
            </Field>
            <div style={{display: "flex", gap: 8, alignItems: "end"}}>
              <Button kind="primary"><Icons.Search size={14}/> 검색</Button>
              <Button kind="ghost" onClick={() => { setQuery(""); setPeriod("all"); setStatus("all"); }}>초기화</Button>
            </div>
            <div></div>
          </div>
        </div>

        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{width: 150}}>정산번호</th>
                <th>정산 기간</th>
                <th style={{width: 120}}>지급 예정일</th>
                <th className="right" style={{width: 130}}>매출액</th>
                <th className="right" style={{width: 130}}>취소/환불액</th>
                <th className="right" style={{width: 120}}>수수료</th>
                <th className="right" style={{width: 140}}>실지급액</th>
                <th className="center" style={{width: 90}}>상태</th>
                <th style={{width: 92}}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="clickable" onClick={() => setSelected(s)}>
                  <td className="mono num">{s.id}</td>
                  <td className="num t-tertiary">{s.period}</td>
                  <td className="num">{s.payDate}</td>
                  <td className="right num">{fmtKRW(s.gross)}</td>
                  <td className="right num t-danger">{fmtKRW(s.canceled)}</td>
                  <td className="right num t-tertiary">{fmtKRW(s.fee)}</td>
                  <td className="right num" style={{fontWeight: 700}}>{fmtKRW(settlementNet(s))}</td>
                  <td className="center"><StatusTag status={s.status}/></td>
                  <td>
                    <Button kind="text" size="sm" onClick={(e) => { e.stopPropagation(); setSelected(s); }}>상세 <Icons.Right size={12}/></Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{background: "var(--bg-subtle)", fontWeight: 700}}>
                <td colSpan={3} style={{padding: "var(--s-3) var(--s-4)"}}>합계</td>
                <td className="right num" style={{padding: "var(--s-3) var(--s-4)"}}>{fmtKRW(totals.gross)}</td>
                <td className="right num" style={{padding: "var(--s-3) var(--s-4)"}}>{fmtKRW(totals.canceled)}</td>
                <td className="right num" style={{padding: "var(--s-3) var(--s-4)"}}>{fmtKRW(totals.fee)}</td>
                <td className="right num" style={{padding: "var(--s-3) var(--s-4)"}}>{fmtKRW(totals.net)}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="row between" style={{padding: "var(--s-4) var(--s-5)"}}>
          <div className="text t-tertiary">총 {filtered.length}건</div>
          <Pager page={page} total={4} onChange={setPage}/>
        </div>
      </Card>

      {selected && <SettlementDrawer settlement={selected} onClose={() => setSelected(null)}/>}
    </div>
  );
};

const SettlementDrawer = ({ settlement, onClose }) => (
  <React.Fragment>
    <div className="drawer-mask" onClick={onClose}/>
    <aside className="drawer">
      <div className="drawer-head">
        <div>
          <div className="text t-tertiary">정산번호</div>
          <div className="mono" style={{fontSize: 16, fontWeight: 700, marginTop: 2}}>{settlement.id}</div>
        </div>
        <button className="icon-btn" onClick={onClose}><Icons.Close size={18}/></button>
      </div>
      <div className="drawer-body">
        <div style={{padding: 24, background: "var(--bg-subtle)", borderRadius: 12, textAlign: "center", marginBottom: 20}}>
          <StatusTag status={settlement.status}/>
          <div className="h2" style={{margin: "12px 0 4px"}}>{fmtKRW(settlementNet(settlement))}</div>
          <div className="text t-tertiary">실지급액</div>
        </div>

        <div className="row" style={{gap: 8, marginBottom: 16}}>
          <Button kind="primary" size="sm"><Icons.Download size={12}/> 명세서 다운로드</Button>
          <Button kind="ghost" size="sm">정산 문의</Button>
        </div>

        <h3 style={{fontSize: 14, margin: "16px 0 8px"}}>정산 정보</h3>
        <InfoGrid rows={[
          ["정산 기간", settlement.period, "지급 예정일", settlement.payDate],
          ["입금 계좌", settlement.account, "상태", <StatusTag status={settlement.status}/>],
        ]}/>

        <h3 style={{fontSize: 14, margin: "24px 0 8px"}}>금액 상세</h3>
        <InfoGrid rows={[
          ["매출액", fmtKRW(settlement.gross), "취소/환불액", fmtKRW(settlement.canceled)],
          ["수수료", fmtKRW(settlement.fee), "실지급액", fmtKRW(settlementNet(settlement))],
        ]}/>

        <h3 style={{fontSize: 14, margin: "24px 0 8px"}}>처리 이력</h3>
        <div className="col" style={{gap: 0, paddingLeft: 4}}>
          {[
            [settlement.payDate, settlement.status === "paid" ? "정산 지급 완료" : "정산 지급 예정", "ErumPay"],
            [settlement.period.split(" ~ ")[1], "정산 집계 완료", "시스템"],
            [settlement.period.split(" ~ ")[0], "정산 기간 시작", "시스템"],
          ].map((ev, i) => (
            <div key={i} className="row" style={{gap: 12, padding: "8px 0", borderLeft: "2px solid var(--c-main)", paddingLeft: 12}}>
              <div className="num t-tertiary" style={{width: 96}}>{ev[0]}</div>
              <div style={{flex: 1}}>
                <div style={{fontSize: 13, fontWeight: 600}}>{ev[1]}</div>
                <div className="text t-tertiary">{ev[2]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  </React.Fragment>
);

Object.assign(window, { Settlements, SettlementDrawer });
