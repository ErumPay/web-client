/* Merchant settlement management */

const SETTLEMENT_ROWS = [
  ["2025.05.23 (금)", "2025-20주차", 12850000, 385500, 12464500, "2025.05.23 (D+0)"],
  ["2025.05.16 (금)", "2025-19주차", 11420000, 342600, 11077400, "2025.05.16 (D+0)"],
  ["2025.05.09 (금)", "2025-18주차", 10980000, 329400, 10650600, "2025.05.09 (D+0)"],
  ["2025.05.02 (금)", "2025-17주차", 9850000, 295500, 9554500, "2025.05.02 (D+0)"],
  ["2025.04.25 (금)", "2025-16주차", 8790000, 263700, 8497200, "2025.04.25 (D+0)"],
  ["2025.04.18 (금)", "2025-15주차", 9420000, 282600, 9137400, "2025.04.18 (D+0)"],
  ["2025.04.11 (금)", "2025-14주차", 10250000, 307500, 9942500, "2025.04.11 (D+0)"],
  ["2025.04.04 (금)", "2025-13주차", 8950000, 268500, 8681500, "2025.04.04 (D+0)"],
];

const Settlements = () => {
  const [selected, setSelected] = React.useState(null);
  const [page, setPage] = React.useState(1);

  if (selected) return <SettlementDetail settlement={selected} onBack={() => setSelected(null)}/>;

  return (
    <div className="page merchant-settlements final-list-page">
      <div className="row between">
        <h1 className="page-title">정산 관리</h1>
        <Button kind="ghost"><Icons.Download size={14}/> 엑셀 다운로드</Button>
      </div>

      <div className="settlement-top-cards">
        <div><span className="red"><Icons.Wallet size={22}/></span><p>정산 예정 금액<strong>₩0</strong><small>D+N 예정일<br/>2025.05.27 (D+2)</small></p></div>
        <div><span className="teal"><Icons.Up size={22}/></span><p>정산 완료 금액<strong>₩80,005,600</strong><small>최근 정산일<br/>2025.05.23</small></p></div>
        <div><span className="mint"><Icons.Card size={22}/></span><p>이번 달 정산 금액<strong>₩43,747,000</strong><small>정산 건수<br/>900건</small></p></div>
      </div>

      <section className="final-table-card settlement-table">
        <div className="final-table-title"><h2>정산 내역</h2></div>
        <div className="settlement-filter">
          <SearchInput placeholder="정산일 또는 주차로 검색"/>
          <button className="date-filter"><Icons.Calendar size={16}/></button>
          <Select value="all" onChange={() => {}} options={[{value: "all", label: "전체 상태"}]}/>
          <button className="reset-filter">초기화</button>
        </div>
        <div className="settlement-table-head">
          <span>정산일</span><span>정산 주차</span><span>정산 금액(원)</span><span>수수료(원)</span><span>정산 후 금액(원)</span><span>지급 예정일</span><span>상태</span><span>상세보기</span>
        </div>
        {SETTLEMENT_ROWS.map((row, index) => (
          <div key={row[0]} className="settlement-table-row">
            <span>{row[0]}</span><span>{row[1]}</span><strong>{fmtNum(row[2])}</strong><span className="t-danger">{fmtNum(row[3])}</span>
            <strong className="t-main">{fmtNum(row[4])}</strong><span>{row[5]}</span><Tag kind="success">정산 완료</Tag>
            <button onClick={() => setSelected({ row, index })}>조회</button>
          </div>
        ))}
        <div className="final-table-footer"><span>총 8건</span><Pager page={page} total={3} onChange={setPage}/></div>
      </section>
    </div>
  );
};

const SettlementDetail = ({ onBack }) => {
  const cards = [
    ["신한카드", 5240000, 157200, 5082800],
    ["삼성카드", 3850000, 115500, 3734500],
    ["현대카드", 2680000, 80400, 2599600],
    ["국민카드", 1840000, 46800, 1513200],
    ["카카오페이", 1520000, 45600, 1474400],
    ["기타 카드", 720000, 21600, 698400],
  ];

  return (
    <div className="page settlement-detail-page">
      <div className="settlement-detail-heading">
        <button onClick={onBack}><Icons.Left size={20}/></button>
        <h1 className="page-title">정산 상세 조회 <small>(2025.05)</small></h1>
      </div>

      <div className="settlement-detail-summary">
        <div><span>총 매출액</span><strong>₩45,100,000</strong></div>
        <div><span>총 수수료</span><strong className="t-danger">₩1,353,000</strong></div>
        <div className="active"><span>총 정산액</span><strong className="t-main">₩43,747,000</strong></div>
      </div>

      <div className="settlement-detail-columns">
        <section className="settlement-detail-card">
          <h2><span><Icons.Card size={20}/></span>카드사별 정산 내역</h2>
          <div className="detail-table-head"><span>카드사</span><span>매출 금액(원)</span><span>수수료(원)</span><span>정산 금액(원)</span></div>
          {cards.map(row => <div key={row[0]} className="detail-table-row"><span>{row[0]}</span><span>{fmtNum(row[1])}</span><span>{fmtNum(row[2])}</span><span className="t-main">{fmtNum(row[3])}</span></div>)}
          <div className="detail-table-row total"><strong>합계</strong><strong>15,850,000</strong><strong>467,100</strong><strong className="t-main">15,102,900</strong></div>
        </section>

        <section className="settlement-detail-card">
          <h2><span className="orange"><Icons.Won size={20}/></span>수수료 상세 내역</h2>
          <div className="fee-row head"><span>항목</span><span>금액(원)</span></div>
          {[["카드 수수료", "356,400"], ["법카", "35,640"], ["정산 수수료", "23,460"], ["기타 수수료", "30,000"]].map(row => <div className="fee-row" key={row[0]}><span>{row[0]}</span><span>{row[1]}</span></div>)}
          <div className="fee-row total"><strong>합계</strong><strong>445,500</strong></div>
          <div className="total-fee"><strong>총 수수료</strong><b>₩445,500</b></div>
        </section>
      </div>
    </div>
  );
};

Object.assign(window, { Settlements, SettlementDetail });
