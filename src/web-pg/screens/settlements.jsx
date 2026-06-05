/* Settlements */

const Settlements = () => {
  const [cycle, setCycle] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  const filtered = SETTLEMENTS.filter(s =>
    (cycle === "all" || s.cycle === cycle) &&
    (status === "all" || s.status === status) &&
    (!query || s.brand.name.includes(query))
  );

  const totals = filtered.reduce((acc, s) => ({
    gross: acc.gross + s.gross,
    fee:   acc.fee + s.fee,
    net:   acc.net + s.net,
  }), {gross: 0, fee: 0, net: 0});

  return (
    <div className="page">
      <div className="row between">
        <div className="page-header">
          <h1 className="page-title">정산관리</h1>
          <p className="page-desc">주차/월 단위 정산을 검토하고 처리합니다.</p>
        </div>
        <div className="row" style={{gap: 8}}>
          <Button kind="ghost"><Icons.Download size={14}/> 정산 명세 일괄 다운로드</Button>
          <Button kind="primary">정산 일괄 처리</Button>
        </div>
      </div>

      <div className="stat-grid" style={{gridTemplateColumns: "repeat(4, 1fr)"}}>
        <StatCard label="이번 주 정산 대상" value="86" unit="건" icon="Calc" accent="#1F6F5F"/>
        <StatCard label="총 매출액"         value={fmtKRW(totals.gross)} icon="Won" accent="#2FB484"/>
        <StatCard label="총 수수료"         value={fmtKRW(totals.fee)}   icon="Card" accent="#C5A95F"/>
        <StatCard label="정산 예정 금액"    value={fmtKRW(totals.net)}   icon="Wallet" accent="#67B173"/>
      </div>

      <Card flush>
        <div style={{padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--border)"}}>
          <div className="filter-bar" style={{gridTemplateColumns: "200px 200px 1fr auto auto"}}>
            <Field label="정산 주차">
              <Select value={cycle} onChange={setCycle} options={[
                {value: "all", label: "전체 주차"},
                {value: "2024-W20", label: "2024-W20 (5/13–5/19)"},
                {value: "2024-W19", label: "2024-W19 (5/6–5/12)"},
                {value: "2024-W18", label: "2024-W18 (4/29–5/5)"},
              ]}/>
            </Field>
            <Field label="정산 상태">
              <Select value={status} onChange={setStatus} options={[
                {value: "all", label: "전체 상태"},
                {value: "paid", label: "지급완료"},
                {value: "pending", label: "지급대기"},
              ]}/>
            </Field>
            <Field label="검색">
              <SearchInput placeholder="가맹점명 입력" value={query} onChange={setQuery}/>
            </Field>
            <div style={{display: "flex", gap: 8, alignItems: "end"}}>
              <Button kind="primary"><Icons.Search size={14}/> 검색</Button>
              <Button kind="ghost" onClick={() => { setQuery(""); setCycle("all"); setStatus("all"); }}>초기화</Button>
            </div>
            <div></div>
          </div>
        </div>

        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{width: 36}}><input type="checkbox"/></th>
                <th style={{width: 130}}>정산 주차</th>
                <th>가맹점</th>
                <th className="right" style={{width: 140}}>매출액</th>
                <th className="right" style={{width: 120}}>수수료</th>
                <th className="right" style={{width: 140}}>정산 금액</th>
                <th className="center" style={{width: 90}}>상태</th>
                <th style={{width: 110}}>지급일</th>
                <th style={{width: 80}}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={i}>
                  <td><input type="checkbox"/></td>
                  <td className="mono num">{s.cycle}</td>
                  <td><BrandCell {...s.brand}/></td>
                  <td className="right num">{fmtKRW(s.gross)}</td>
                  <td className="right num t-tertiary">{fmtKRW(s.fee)}</td>
                  <td className="right num" style={{fontWeight: 700}}>{fmtKRW(s.net)}</td>
                  <td className="center"><StatusTag status={s.status}/></td>
                  <td className="num t-tertiary">{s.settleAt}</td>
                  <td>
                    <Button kind="text" size="sm">명세서 <Icons.Right size={12}/></Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{background: "var(--bg-subtle)", fontWeight: 700}}>
                <td colSpan={3} style={{padding: "var(--s-3) var(--s-4)"}}>합계</td>
                <td className="right num" style={{padding: "var(--s-3) var(--s-4)"}}>{fmtKRW(totals.gross)}</td>
                <td className="right num" style={{padding: "var(--s-3) var(--s-4)"}}>{fmtKRW(totals.fee)}</td>
                <td className="right num" style={{padding: "var(--s-3) var(--s-4)"}}>{fmtKRW(totals.net)}</td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="row between" style={{padding: "var(--s-4) var(--s-5)"}}>
          <div className="text t-tertiary">총 {filtered.length}건</div>
          <Pager page={page} total={6} onChange={setPage}/>
        </div>
      </Card>
    </div>
  );
};

window.Settlements = Settlements;
