/* Dashboard screen */

const StatCard = ({ label, value, unit, delta, deltaDir, icon, accent }) => {
  const Ico = icon ? Icons[icon] : null;
  return (
    <div className={`stat ${accent === "cta" ? "cta" : ""}`}>
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
          <span>어제 대비</span>
          {deltaDir === "up" && <Icons.Up size={12}/>}
          {deltaDir === "down" && <Icons.Down size={12}/>}
          <strong>{delta}</strong>
        </div>
      )}
      {accent === "cta" && (
        <div className="stat-delta">
          <span>전체 대기 가맹점 수</span>
          <a className="row" style={{marginLeft: "auto", color: "var(--c-secondary)", fontWeight: 600}}>대기 목록 보기 <Icons.Right size={12}/></a>
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

const Dashboard = ({ onOpenMerchant }) => {
  const [sort, setSort] = React.useState("today_desc");
  const [date, setDate] = React.useState("2024-05-14");
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  const filtered = DASHBOARD_TABLE.filter(r =>
    !query || r.brand.name.includes(query) || r.brand.mid.includes(query)
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">대시보드</h1>
        <p className="page-desc">가맹점별 운영 현황을 한눈에 확인할 수 있습니다.</p>
      </div>

      {/* Stat row */}
      <div className="stat-grid">
        <StatCard label="오늘 결제 건수 (합계)"   value={fmtNum(12248)} unit="건"  delta="12.5%" deltaDir="up" icon="Calendar" accent="#1F6F5F"/>
        <StatCard label="오늘 결제 금액 (합계)"   value={fmtKRW(1286230000)}      delta="8.6%"  deltaDir="up" icon="Won"      accent="#2FB484"/>
        <StatCard label="실패/취소 건수 (합계)"   value={fmtNum(236)}   unit="건"  delta="18.7%" deltaDir="up" icon="CircleX"  accent="#EF5350"/>
        <StatCard label="장애/지연 알림 (발생 중)" value="3"             unit="건"  delta="최근 24시간 기준"  icon="Warning"  accent="#FF9F2F"/>
        <StatCard label="가맹점 가입 대기"         value="45"            unit="건"  accent="cta"   icon="Users"/>
      </div>

      {/* Filter + Table + Waiting */}
      <div style={{display: "grid", gridTemplateColumns: "1fr 280px", gap: "var(--s-4)", alignItems: "start"}}>
        <Card flush>
          <div style={{padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--border)"}}>
            <div className="filter-bar">
              <Field label="정렬 기준">
                <Select value={sort} onChange={setSort} options={[
                  {value: "today_desc", label: "오늘 결제 많은 순"},
                  {value: "today_asc",  label: "오늘 결제 적은 순"},
                  {value: "amount_desc",label: "결제 금액 높은 순"},
                  {value: "fail_desc",  label: "실패율 높은 순"},
                ]}/>
              </Field>
              <Field label="기간">
                <DateInput value={date} onChange={setDate}/>
              </Field>
              <Field label="가맹점명 검색">
                <SearchInput placeholder="가맹점명 입력" value={query} onChange={setQuery}/>
              </Field>
              <div style={{display: "flex", gap: 8, alignItems: "end", height: "100%"}}>
                <Button kind="primary"><Icons.Search size={14}/> 검색</Button>
                <Button kind="ghost" onClick={() => { setQuery(""); setSort("today_desc"); }}>초기화</Button>
              </div>
              <div style={{display: "flex", alignItems: "end"}}>
                <Button kind="ghost"><Icons.Download size={14}/> 엑셀 다운로드</Button>
              </div>
            </div>
          </div>

          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{width: 56}} className="center">순위</th>
                  <th>가맹점명 (MID)</th>
                  <th style={{width: 80}}>상태</th>
                  <th className="right" style={{width: 110}}>오늘 결제 건수</th>
                  <th className="right" style={{width: 140}}>오늘 결제 금액</th>
                  <th className="right" style={{width: 130}}>실패/취소 건수</th>
                  <th className="right" style={{width: 130}}>장애/지연 알림</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.brand.mid} className="clickable" onClick={() => onOpenMerchant?.(r.brand)}>
                    <td className="center num t-tertiary">{r.rank}</td>
                    <td><BrandCell {...r.brand}/></td>
                    <td><StatusTag status={r.status}/></td>
                    <td className="right num">{fmtNum(r.count)} 건</td>
                    <td className="right num">{fmtKRW(r.amount)}</td>
                    <td className="right num">
                      <span className={r.failure.n > 20 ? "t-danger" : ""}>
                        {r.failure.n} 건 <span className="t-tertiary">({r.failure.pct})</span>
                      </span>
                    </td>
                    <td className="right num">
                      {r.alert > 0
                        ? <span className="t-warning">{r.alert} 건 <Icons.Warning size={12}/></span>
                        : <span className="t-success">0 건 <Icons.CircleCheck size={12}/></span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row between" style={{padding: "var(--s-4) var(--s-5)"}}>
            <div className="text t-tertiary">총 125개 가맹점</div>
            <Pager page={page} total={13} onChange={setPage}/>
          </div>
        </Card>

        <Card title="가맹점 가입 대기 목록" action={<Tag kind="info">{WAITING_MERCHANTS.length}</Tag>}>
          <div className="col" style={{gap: 0}}>
            <div className="row" style={{padding: "8px 0", color: "var(--text-tertiary)", fontSize: 12, borderBottom: "1px solid var(--border)"}}>
              <div style={{flex: 1}}>가맹점명</div>
              <div style={{width: 90}}>신청일</div>
            </div>
            {WAITING_MERCHANTS.map((w, i) => (
              <div key={i} className="row" style={{padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: 13}}>
                <div style={{flex: 1}}>{w.name}</div>
                <div style={{width: 90}} className="t-tertiary">{w.date}</div>
              </div>
            ))}
            <div className="row" style={{justifyContent: "center", padding: "12px 0 0"}}>
              <Button kind="text">전체 대기 목록 보기 <Icons.Right size={12}/></Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid-3">
        <Card title="시간대별 결제 추이" action={<span className="text t-tertiary">최근 24시간</span>}>
          <Sparkbars data={[0.3,0.4,0.35,0.5,0.45,0.6,0.55,0.7,0.65,0.8,0.7,0.85,0.9,0.75,0.8,0.95,0.85,0.7,0.65,0.55,0.6,0.7,0.6,0.65]}/>
          <div className="row between" style={{marginTop: 8, fontSize: 11, color: "var(--text-tertiary)"}}>
            <span>00시</span><span>06시</span><span>12시</span><span>18시</span><span>현재</span>
          </div>
        </Card>
        <Card title="카드사별 결제 비중">
          <div className="col" style={{gap: 8}}>
            {[
              {n: "신한카드",   pct: 28, c: "#1F6F5F"},
              {n: "KB국민카드", pct: 22, c: "#2FB484"},
              {n: "삼성카드",   pct: 18, c: "#6FCF97"},
              {n: "현대카드",   pct: 14, c: "#C5A95F"},
              {n: "기타",       pct: 18, c: "#B6B4B4"},
            ].map(b => (
              <div key={b.n}>
                <div className="row between" style={{fontSize: 12, marginBottom: 4}}>
                  <span>{b.n}</span><span className="num t-tertiary">{b.pct}%</span>
                </div>
                <div style={{height: 6, background: "var(--c-grey-3)", borderRadius: 999}}>
                  <div style={{width: b.pct * 3 + "%", height: "100%", background: b.c, borderRadius: 999}}/>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="장애/지연 알림" action={<Tag kind="warning" dot>발생 중 3</Tag>}>
          <div className="col" style={{gap: 8}}>
            {[
              {sev: "warning", t: "리빙스토어 단말기 연결 지연", time: "12분 전", desc: "MID:10000004 · 단말 3대"},
              {sev: "warning", t: "스포츠라인 결제 지연 발생",    time: "32분 전", desc: "MID:10000007 · 평균 8초"},
              {sev: "danger",  t: "BC카드 게이트웨이 5xx 증가",   time: "1시간 전", desc: "전체 가맹점 · 자동 알림"},
            ].map((a, i) => (
              <div key={i} className="row" style={{padding: 8, borderRadius: 8, background: "var(--bg-subtle)", gap: 12}}>
                <span className={`tag ${a.sev}`} style={{height: 22, width: 22, padding: 0, justifyContent: "center"}}>
                  {a.sev === "danger" ? <Icons.Warning size={12}/> : <Icons.Warning size={12}/>}
                </span>
                <div style={{flex: 1}}>
                  <div style={{fontSize: 13, fontWeight: 600}}>{a.t}</div>
                  <div className="text t-tertiary">{a.desc}</div>
                </div>
                <div className="text t-tertiary" style={{whiteSpace: "nowrap"}}>{a.time}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

Object.assign(window, { Dashboard, StatCard, Sparkbars });
