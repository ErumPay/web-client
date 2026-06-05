/* Merchants list + detail drawer */

const MERCHANTS = MERCHANT_BRANDS.map((b, i) => ({
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

const Merchants = ({ onOpen }) => {
  const [tab, setTab] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [page, setPage] = React.useState(1);

  const filtered = MERCHANTS.filter(m =>
    (!query || m.name.includes(query) || m.mid.includes(query) || m.bizNo.includes(query)) &&
    (category === "all" || m.category === category) &&
    (status === "all" || m.status === status) &&
    (tab === "all" || tab === m.status)
  );

  return (
    <div className="page">
      <div className="row between">
        <div className="page-header">
          <h1 className="page-title">가맹점 관리</h1>
          <p className="page-desc">가맹점 정보, 상태, 단말, 정산 조건을 관리합니다.</p>
        </div>
        <div className="row" style={{gap: 8}}>
          <Button kind="ghost"><Icons.Download size={14}/> 엑셀 다운로드</Button>
          <Button kind="primary"><Icons.Plus size={14}/> 가맹점 등록</Button>
        </div>
      </div>

      <Card flush>
        <div style={{padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--border)"}}>
          <Tabs value={tab} onChange={setTab} items={[
            {value: "all",       label: `전체 (${MERCHANTS.length})`},
            {value: "normal",    label: "정상"},
            {value: "caution",   label: "주의"},
            {value: "suspended", label: "정지"},
            {value: "pending",   label: "심사중 (45)"},
          ]}/>
          <div className="filter-bar" style={{marginTop: 0}}>
            <Field label="업종">
              <Select value={category} onChange={setCategory} options={[
                {value: "all", label: "전체 업종"},
                {value: "리테일", label: "리테일"},
                {value: "F&B", label: "F&B"},
                {value: "서비스", label: "서비스"},
              ]}/>
            </Field>
            <Field label="상태">
              <Select value={status} onChange={setStatus} options={[
                {value: "all", label: "전체 상태"},
                {value: "normal", label: "정상"},
                {value: "caution", label: "주의"},
                {value: "suspended", label: "정지"},
              ]}/>
            </Field>
            <Field label="검색">
              <SearchInput placeholder="가맹점명, MID, 사업자번호" value={query} onChange={setQuery}/>
            </Field>
            <div style={{display: "flex", gap: 8, alignItems: "end"}}>
              <Button kind="primary"><Icons.Search size={14}/> 검색</Button>
              <Button kind="ghost" onClick={() => { setQuery(""); setStatus("all"); setCategory("all"); }}>초기화</Button>
            </div>
            <div></div>
          </div>
        </div>

        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{width: 36}}><input type="checkbox"/></th>
                <th>가맹점명 (MID)</th>
                <th style={{width: 110}}>사업자번호</th>
                <th style={{width: 80}}>대표자</th>
                <th style={{width: 90}}>업종</th>
                <th className="center" style={{width: 80}}>상태</th>
                <th className="right" style={{width: 80}}>단말 수</th>
                <th className="right" style={{width: 150}}>이번 달 결제</th>
                <th className="right" style={{width: 80}}>수수료</th>
                <th style={{width: 110}}>가입일</th>
                <th style={{width: 60}}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.mid} className="clickable" onClick={() => onOpen?.(m)}>
                  <td onClick={e => e.stopPropagation()}><input type="checkbox"/></td>
                  <td><BrandCell {...m}/></td>
                  <td className="num">{m.bizNo}</td>
                  <td>{m.rep}</td>
                  <td>{m.category}</td>
                  <td className="center"><StatusTag status={m.status}/></td>
                  <td className="right num">{m.terminals}</td>
                  <td className="right num">{fmtKRW(m.mtdAmount)}</td>
                  <td className="right num">{m.fee}%</td>
                  <td className="num t-tertiary">{m.joined}</td>
                  <td><Button kind="text" size="sm" onClick={(e) => { e.stopPropagation(); onOpen?.(m); }}>상세 <Icons.Right size={12}/></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row between" style={{padding: "var(--s-4) var(--s-5)"}}>
          <div className="text t-tertiary">총 {filtered.length}개</div>
          <Pager page={page} total={13} onChange={setPage}/>
        </div>
      </Card>
    </div>
  );
};

const MerchantDrawer = ({ merchant, onClose }) => {
  if (!merchant) return null;
  return (
    <React.Fragment>
      <div className="drawer-mask" onClick={onClose}/>
      <aside className="drawer">
        <div className="drawer-head">
          <div className="row" style={{gap: 12}}>
            <BrandCell {...merchant}/>
            <StatusTag status={merchant.status || "normal"}/>
          </div>
          <button className="icon-btn" onClick={onClose}><Icons.Close size={18}/></button>
        </div>
        <div className="drawer-body">
          <div className="row" style={{gap: 8, marginBottom: 16}}>
            <Button kind="primary" size="sm"><Icons.Edit size={12}/> 정보 수정</Button>
            <Button kind="ghost" size="sm">상태 변경</Button>
            <Button kind="ghost" size="sm">메모 추가</Button>
            <div style={{flex: 1}}/>
            <Button kind="text" size="sm">전체 페이지로 보기 <Icons.Right size={12}/></Button>
          </div>

          <h3 style={{fontSize: 14, margin: "16px 0 8px"}}>기본 정보</h3>
          <InfoGrid rows={[
            ["MID", merchant.mid, "가입일", merchant.joined || "—"],
            ["사업자번호", merchant.bizNo || "—", "대표자", merchant.rep || "—"],
            ["업종", merchant.category || "—", "수수료율", (merchant.fee || 2.5) + "%"],
            ["주소", "서울특별시 강남구 테헤란로 123", "전화번호", "02-1234-5678"],
            ["정산 계좌", "신한은행 110-***-******", "정산 주기", "주 1회 (월요일)"],
          ]}/>

          <h3 style={{fontSize: 14, margin: "24px 0 8px"}}>최근 30일 운영 지표</h3>
          <div className="grid-3" style={{gap: 8}}>
            <div className="card" style={{padding: 16}}>
              <div className="text t-tertiary">결제 건수</div>
              <div className="h3" style={{marginTop: 4}}>{fmtNum(34280)} 건</div>
            </div>
            <div className="card" style={{padding: 16}}>
              <div className="text t-tertiary">결제 금액</div>
              <div className="h3" style={{marginTop: 4}}>{fmtKRW(merchant.mtdAmount || 0)}</div>
            </div>
            <div className="card" style={{padding: 16}}>
              <div className="text t-tertiary">실패율</div>
              <div className="h3 t-danger" style={{marginTop: 4}}>0.92%</div>
            </div>
          </div>

          <h3 style={{fontSize: 14, margin: "24px 0 8px"}}>단말기 ({merchant.terminals || 0}대)</h3>
          <table className="tbl">
            <thead>
              <tr><th>단말기 ID</th><th>모델</th><th>상태</th><th>최근 결제</th></tr>
            </thead>
            <tbody>
              <tr><td className="mono">TML-A001</td><td>K-2000 Pro</td><td><StatusTag status="normal"/></td><td className="t-tertiary">14:32:11</td></tr>
              <tr><td className="mono">TML-A002</td><td>K-2000 Pro</td><td><StatusTag status="normal"/></td><td className="t-tertiary">14:28:55</td></tr>
              <tr><td className="mono">TML-A003</td><td>K-1500</td><td><StatusTag status="caution"/></td><td className="t-tertiary">11:02:18</td></tr>
            </tbody>
          </table>

          <h3 style={{fontSize: 14, margin: "24px 0 8px"}}>최근 메모</h3>
          <div className="col" style={{gap: 8}}>
            <div style={{padding: 12, background: "var(--bg-subtle)", borderRadius: 8, fontSize: 13}}>
              단말기 펌웨어 v2.4.1 업데이트 완료 확인 — <span className="t-tertiary">2024-05-13 · 이재현</span>
            </div>
            <div style={{padding: 12, background: "var(--bg-subtle)", borderRadius: 8, fontSize: 13}}>
              주말 매출 급증 모니터링 필요 — <span className="t-tertiary">2024-05-10 · 김이름</span>
            </div>
          </div>
        </div>
      </aside>
    </React.Fragment>
  );
};

Object.assign(window, { MERCHANTS, Merchants, MerchantDrawer });
