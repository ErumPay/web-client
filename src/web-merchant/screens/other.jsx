/* Notices / Audit / Admins / Benefits / Design system / Login */

/* ============= Notices ============= */
const Notices = () => {
  const [type, setType] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const filtered = NOTICES.filter(n =>
    (type === "all" || n.type === type) &&
    (!query || n.title.includes(query))
  );

  const typeMap = {
    system: { kind: "info",    label: "시스템" },
    policy: { kind: "neutral", label: "정책" },
    event:  { kind: "success", label: "이벤트" },
    alert:  { kind: "warning", label: "장애" },
  };
  const stMap = {
    published: { kind: "success", label: "게시됨" },
    scheduled: { kind: "info",    label: "예약" },
    draft:     { kind: "neutral", label: "임시저장" },
  };

  return (
    <div className="page">
      <div className="row between">
        <div className="page-header">
          <h1 className="page-title">알림 / 공지 관리</h1>
          <p className="page-desc">가맹점과 내부 사용자에게 보내는 공지·알림을 관리합니다.</p>
        </div>
        <Button kind="primary"><Icons.Plus size={14}/> 새 공지 작성</Button>
      </div>

      <Card flush>
        <div style={{padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--border)"}}>
          <Tabs value={type} onChange={setType} items={[
            {value: "all", label: `전체 (${NOTICES.length})`},
            {value: "system", label: "시스템"},
            {value: "policy", label: "정책"},
            {value: "event", label: "이벤트"},
            {value: "alert", label: "장애"},
          ]}/>
          <div className="row" style={{gap: 12, marginTop: 0}}>
            <div style={{width: 360}}>
              <SearchInput placeholder="제목 검색" value={query} onChange={setQuery}/>
            </div>
          </div>
        </div>

        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{width: 36}}><input type="checkbox"/></th>
                <th style={{width: 70}}>ID</th>
                <th style={{width: 80}}>유형</th>
                <th>제목</th>
                <th style={{width: 100}}>대상</th>
                <th className="center" style={{width: 90}}>상태</th>
                <th className="right" style={{width: 90}}>조회수</th>
                <th style={{width: 110}}>게시일</th>
                <th style={{width: 80}}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(n => (
                <tr key={n.id}>
                  <td><input type="checkbox"/></td>
                  <td className="num mono">{n.id}</td>
                  <td><Tag kind={typeMap[n.type].kind}>{typeMap[n.type].label}</Tag></td>
                  <td>
                    <div style={{fontSize: 13, fontWeight: 600}}>{n.title}</div>
                  </td>
                  <td>{n.audience}</td>
                  <td className="center"><Tag kind={stMap[n.status].kind} dot>{stMap[n.status].label}</Tag></td>
                  <td className="right num">{fmtNum(n.views)}</td>
                  <td className="num t-tertiary">{n.pub}</td>
                  <td>
                    <Button kind="text" size="sm"><Icons.Edit size={12}/> 편집</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

/* ============= Audit ============= */
const AuditLog = () => {
  const [query, setQuery] = React.useState("");
  const [user, setUser] = React.useState("all");
  const [result, setResult] = React.useState("all");
  const filtered = AUDITS.filter(a =>
    (!query || a.action.includes(query) || (a.target && a.target.includes(query))) &&
    (user === "all" || a.user === user) &&
    (result === "all" || a.result === result)
  );
  const users = ["all", ...new Set(AUDITS.map(a => a.user))];

  return (
    <div className="page">
      <div className="row between">
        <div className="page-header">
          <h1 className="page-title">감사 로그</h1>
          <p className="page-desc">관리자 행위와 시스템 이벤트의 변경 이력을 추적합니다.</p>
        </div>
        <Button kind="ghost"><Icons.Download size={14}/> 로그 다운로드</Button>
      </div>

      <Card flush>
        <div style={{padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--border)"}}>
          <div className="filter-bar" style={{gridTemplateColumns: "180px 180px 1fr auto auto"}}>
            <Field label="사용자">
              <Select value={user} onChange={setUser} options={users.map(u => ({value: u, label: u === "all" ? "전체 사용자" : u}))}/>
            </Field>
            <Field label="처리 결과">
              <Select value={result} onChange={setResult} options={[
                {value: "all", label: "전체"},
                {value: "성공", label: "성공"},
                {value: "실패", label: "실패"},
              ]}/>
            </Field>
            <Field label="검색">
              <SearchInput placeholder="행위, 대상, IP 등" value={query} onChange={setQuery}/>
            </Field>
            <div style={{display: "flex", gap: 8, alignItems: "end"}}>
              <Button kind="primary"><Icons.Search size={14}/> 검색</Button>
              <Button kind="ghost" onClick={() => { setQuery(""); setUser("all"); setResult("all"); }}>초기화</Button>
            </div>
            <div></div>
          </div>
        </div>

        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{width: 170}}>발생 시각</th>
                <th style={{width: 110}}>사용자</th>
                <th style={{width: 100}}>역할</th>
                <th>행위</th>
                <th>대상</th>
                <th style={{width: 130}}>IP</th>
                <th className="center" style={{width: 80}}>결과</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={i}>
                  <td className="num t-tertiary">{a.ts}</td>
                  <td style={{fontWeight: 600}}>{a.user}</td>
                  <td>{a.role}</td>
                  <td>{a.action}</td>
                  <td className="mono t-tertiary">{a.target}</td>
                  <td className="mono num">{a.ip}</td>
                  <td className="center">
                    {a.result === "성공"
                      ? <Tag kind="success" dot>성공</Tag>
                      : <Tag kind="danger" dot>실패</Tag>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row between" style={{padding: "var(--s-4) var(--s-5)"}}>
          <div className="text t-tertiary">총 {filtered.length}건 (최근 12건 표시)</div>
          <Pager page={1} total={48} onChange={()=>{}}/>
        </div>
      </Card>
    </div>
  );
};

/* ============= Admins ============= */
const Admins = () => {
  const stMap = {
    active:   { kind: "success", label: "활성" },
    locked:   { kind: "danger",  label: "잠금" },
    invited:  { kind: "info",    label: "초대됨" },
    inactive: { kind: "neutral", label: "휴면" },
  };
  return (
    <div className="page">
      <div className="row between">
        <div className="page-header">
          <h1 className="page-title">관리자 관리</h1>
          <p className="page-desc">시스템 사용자의 계정·역할·접근 권한을 관리합니다.</p>
        </div>
        <div className="row" style={{gap: 8}}>
          <Button kind="ghost"><Icons.Shield size={14}/> 역할 정책</Button>
          <Button kind="primary"><Icons.Plus size={14}/> 관리자 초대</Button>
        </div>
      </div>

      <div className="stat-grid" style={{gridTemplateColumns: "repeat(4, 1fr)"}}>
        <StatCard label="총 관리자"   value={ADMINS.length} unit="명" icon="Users" accent="#1F6F5F"/>
        <StatCard label="활성 사용자" value={ADMINS.filter(a=>a.status==="active").length} unit="명" icon="CircleCheck" accent="#67B173"/>
        <StatCard label="잠긴 계정"   value={ADMINS.filter(a=>a.status==="locked").length} unit="명" icon="Lock" accent="#EF5350"/>
        <StatCard label="대기 초대"   value={ADMINS.filter(a=>a.status==="invited").length} unit="명" icon="Plus" accent="#FF9F2F"/>
      </div>

      <Card flush>
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{width: 36}}><input type="checkbox"/></th>
                <th>관리자</th>
                <th style={{width: 200}}>이메일</th>
                <th style={{width: 100}}>역할</th>
                <th style={{width: 90}}>부서</th>
                <th style={{width: 140}}>연락처</th>
                <th className="center" style={{width: 90}}>상태</th>
                <th style={{width: 150}}>최근 접속</th>
                <th style={{width: 120}}></th>
              </tr>
            </thead>
            <tbody>
              {ADMINS.map(a => (
                <tr key={a.id}>
                  <td><input type="checkbox"/></td>
                  <td>
                    <div className="row" style={{gap: 12}}>
                      <div className="brand-avatar" style={{background: "var(--c-main-50)", color: "var(--c-secondary)", border: "1px solid var(--c-main-100)"}}>
                        {a.name[0]}
                      </div>
                      <div className="mid-row">
                        <div className="name">{a.name}</div>
                        <div className="mid">{a.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="t-secondary">{a.email}</td>
                  <td>
                    <Tag kind={a.role === "슈퍼바이저" ? "info" : a.role === "감독자" ? "warning" : "neutral"}>
                      {a.role}
                    </Tag>
                  </td>
                  <td>{a.dept}</td>
                  <td className="num">{a.phone}</td>
                  <td className="center"><Tag kind={stMap[a.status].kind} dot>{stMap[a.status].label}</Tag></td>
                  <td className="num t-tertiary">{a.last}</td>
                  <td>
                    <div className="row" style={{gap: 4}}>
                      <Button kind="text" size="sm"><Icons.Edit size={12}/></Button>
                      <Button kind="text" size="sm"><Icons.Lock size={12}/></Button>
                      <Button kind="text" size="sm"><Icons.Trash size={12}/></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

/* ============= Benefits ============= */
const Benefits = () => (
  <div className="page">
    <div className="row between">
      <div className="page-header">
        <h1 className="page-title">카드 혜택 / 수집 관리</h1>
        <p className="page-desc">카드사 프로모션과 혜택 데이터 수집 현황을 관리합니다.</p>
      </div>
      <Button kind="primary"><Icons.Plus size={14}/> 혜택 등록</Button>
    </div>

    <div className="grid-3">
      {[
        { card: "신한카드", color: "#1F6F5F", t: "여름 외식 5% 캐시백",   period: "2024.06.01 - 06.30", status: "active",   uses: 2480 },
        { card: "KB국민",   color: "#C5A95F", t: "주말 카페 10% 할인",     period: "2024.05.01 - 05.31", status: "active",   uses: 1218 },
        { card: "현대카드", color: "#1C1D1F", t: "온라인 쇼핑 무이자 3개월", period: "2024.05.15 - 06.15", status: "pending",  uses: 0    },
        { card: "삼성카드", color: "#2FB484", t: "주유 리터당 60원 할인",   period: "2024.04.01 - 04.30", status: "active",   uses: 5320 },
        { card: "롯데카드", color: "#EF5350", t: "백화점 5만원 이상 결제 5% 적립", period: "2024.05.10 - 05.25", status: "active", uses: 892 },
        { card: "BC카드",   color: "#6FCF97", t: "QR 결제 첫 결제 3,000원 할인", period: "상시", status: "active", uses: 4128 },
      ].map((b, i) => (
        <div key={i} className="card" style={{padding: 0, overflow: "hidden"}}>
          <div style={{height: 64, background: b.color, padding: "12px 16px", color: "#fff", display: "flex", alignItems: "flex-end"}}>
            <span style={{fontSize: 13, fontWeight: 700}}>{b.card}</span>
          </div>
          <div style={{padding: 16}}>
            <div style={{fontSize: 14, fontWeight: 700, marginBottom: 4}}>{b.t}</div>
            <div className="text t-tertiary" style={{marginBottom: 12}}>{b.period}</div>
            <div className="row between">
              <Tag kind={b.status === "active" ? "success" : "neutral"} dot>{b.status === "active" ? "진행중" : "검토중"}</Tag>
              <span className="text t-tertiary">사용 {fmtNum(b.uses)}회</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    <Card title="혜택 수집 현황" action={<Button kind="text" size="sm">새로고침</Button>}>
      <table className="tbl">
        <thead>
          <tr>
            <th>카드사</th>
            <th>마지막 수집</th>
            <th className="right">수집 건수</th>
            <th className="center">상태</th>
            <th style={{width: 80}}></th>
          </tr>
        </thead>
        <tbody>
          {[
            ["신한카드","2024-05-14 14:00",1280,"success"],
            ["KB국민카드","2024-05-14 13:55",1102,"success"],
            ["현대카드","2024-05-14 13:50",964,"success"],
            ["삼성카드","2024-05-14 12:00",812,"caution"],
            ["롯데카드","2024-05-14 02:10",640,"danger"],
          ].map((r, i) => (
            <tr key={i}>
              <td style={{fontWeight: 600}}>{r[0]}</td>
              <td className="num t-tertiary">{r[1]}</td>
              <td className="right num">{fmtNum(r[2])}</td>
              <td className="center">
                <StatusTag status={r[3] === "danger" ? "suspended" : r[3]}/>
              </td>
              <td><Button kind="text" size="sm">재시도</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

/* ============= Support ============= */
const Support = () => (
  <div className="page">
    <div className="row between">
      <div className="page-header">
        <h1 className="page-title">고객센터</h1>
        <p className="page-desc">가맹점 운영 문의와 처리 현황을 확인합니다.</p>
      </div>
      <Button kind="primary"><Icons.Plus size={14}/> 문의 등록</Button>
    </div>

    <div className="stat-grid" style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
      <StatCard label="접수된 문의" value="8" unit="건" icon="Speaker" accent="#1F6F5F"/>
      <StatCard label="처리 중" value="3" unit="건" icon="Warning" accent="#FF662F"/>
      <StatCard label="처리 완료" value="21" unit="건" icon="CircleCheck" accent="#67B173"/>
    </div>

    <Card flush>
      <div className="table-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{width: 120}}>접수번호</th>
              <th>제목</th>
              <th style={{width: 110}}>유형</th>
              <th className="center" style={{width: 90}}>상태</th>
              <th style={{width: 130}}>접수일</th>
              <th style={{width: 80}}></th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Q24051401", "정산 예정금 확인 요청", "정산", "pending", "2024-05-14"],
              ["Q24051308", "단말기 영수증 재출력 문의", "단말기", "approved", "2024-05-13"],
              ["Q24051203", "거래 취소 처리 방법 문의", "거래", "approved", "2024-05-12"],
            ].map(q => (
              <tr key={q[0]}>
                <td className="mono num">{q[0]}</td>
                <td style={{fontWeight: 600}}>{q[1]}</td>
                <td>{q[2]}</td>
                <td className="center"><StatusTag status={q[3]}/></td>
                <td className="num t-tertiary">{q[4]}</td>
                <td><Button kind="text" size="sm">상세 <Icons.Right size={12}/></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

/* ============= Design System ============= */
const DesignSystem = () => {
  const palette = [
    { group: "메인 색상",   items: [
      { name: "Main",      hex: "#2FB484", rgb: "47, 180, 132" },
      { name: "Secondary", hex: "#1F6F5F", rgb: "31, 111, 95" },
      { name: "Primary",   hex: "#6FCF97", rgb: "111, 207, 151" },
    ]},
    { group: "상태별 색상", items: [
      { name: "Gold",        hex: "#C5A95F", rgb: "197, 169, 95" },
      { name: "Silver",      hex: "#B6B4B4", rgb: "182, 180, 180" },
      { name: "Error/Danger",hex: "#EF5350", rgb: "239, 83, 80"  },
      { name: "Success",     hex: "#67B173", rgb: "103, 177, 115"},
      { name: "Warning",     hex: "#FF9F2F", rgb: "255, 159, 47" },
      { name: "Info",        hex: "#A1CFFA", rgb: "161, 207, 250"},
    ]},
    { group: "흑백 색상",   items: [
      { name: "Black 1", hex: "#1C1D1F", rgb: "28, 29, 31",   text: "#fff" },
      { name: "Black 2", hex: "#45565C", rgb: "69, 86, 92",   text: "#fff" },
      { name: "Black 3", hex: "#6B7378", rgb: "107, 115, 120",text: "#fff" },
      { name: "Grey 1",  hex: "#B3B5B6", rgb: "179, 181, 182" },
      { name: "Grey 2",  hex: "#D4D6D7", rgb: "212, 214, 215" },
      { name: "Grey 3",  hex: "#E9EBEC", rgb: "233, 235, 236" },
      { name: "Grey 4",  hex: "#F3F4F5", rgb: "243, 244, 245" },
      { name: "White",   hex: "#FFFFFF", rgb: "255, 255, 255", border: true },
    ]},
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">디자인 시스템</h1>
        <p className="page-desc">ErumPay 어드민에서 사용하는 색상·타이포·컴포넌트 가이드.</p>
      </div>

      {palette.map(g => (
        <Card key={g.group} title={g.group}>
          <div className="chip-grid">
            {g.items.map(c => (
              <div key={c.name} className="chip">
                <div className="swatch" style={{background: c.hex, borderBottom: c.border ? "1px solid var(--border)" : "none"}}></div>
                <div className="meta">
                  <div className="name">{c.name}</div>
                  <div className="hex">{c.hex} · rgba({c.rgb}, 100)</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Card title="타이포그래피 — Pretendard">
        <div style={{display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "start"}}>
          <div style={{fontSize: 200, fontWeight: 800, color: "var(--c-grey-3)", lineHeight: 1, fontFamily: "Pretendard"}}>Aa</div>
          <div>
            <div className="type-row">
              <div><span className="label">텍스트 유형</span></div>
              <div className="label">글씨 크기</div>
              <div className="label">행간 높이</div>
            </div>
            <div className="type-row">
              <div className="h1 t-main">Heading 1</div>
              <div className="num">36 px</div><div className="num">54 px</div>
            </div>
            <div className="type-row">
              <div className="h2 t-main">Heading 2</div>
              <div className="num">24 px</div><div className="num">36 px</div>
            </div>
            <div className="type-row">
              <div className="h3 t-main">Heading 3</div>
              <div className="num">16 px</div><div className="num">24 px</div>
            </div>
            <div className="type-row">
              <div>
                <div className="text-l-b t-main">Large Text Bold</div>
                <div className="text-l t-main">Large Text Regular</div>
              </div>
              <div className="num">15 px</div><div className="num">22 px</div>
            </div>
            <div className="type-row">
              <div>
                <div className="text-b t-main">Normal Text Bold</div>
                <div className="text t-main">Normal Text Regular</div>
              </div>
              <div className="num">12 px</div><div className="num">18 px</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid-2">
        <Card title="버튼">
          <div className="col">
            <div className="row" style={{gap: 8}}>
              <Button kind="primary">기본 버튼</Button>
              <Button kind="secondary">보조</Button>
              <Button kind="ghost">고스트</Button>
              <Button kind="danger">위험</Button>
              <Button kind="text">텍스트</Button>
            </div>
            <div className="row" style={{gap: 8}}>
              <Button kind="primary" size="sm">Small</Button>
              <Button kind="primary">Default</Button>
              <Button kind="primary" size="lg">Large</Button>
            </div>
            <div className="row" style={{gap: 8}}>
              <Button kind="primary" icon={<Icons.Plus size={14}/>}>등록</Button>
              <Button kind="ghost" icon={<Icons.Download size={14}/>}>다운로드</Button>
            </div>
          </div>
        </Card>
        <Card title="태그 / 상태">
          <div className="row" style={{flexWrap: "wrap", gap: 8}}>
            <Tag kind="success" dot>정상</Tag>
            <Tag kind="warning" dot>주의</Tag>
            <Tag kind="danger" dot>정지</Tag>
            <Tag kind="info" dot>대기</Tag>
            <Tag kind="neutral" dot>심사중</Tag>
          </div>
          <div style={{height: 16}}/>
          <div className="row" style={{gap: 8, flexWrap: "wrap"}}>
            <Tag kind="success">결제완료</Tag>
            <Tag kind="warning">환불</Tag>
            <Tag kind="danger">실패</Tag>
            <Tag kind="neutral">취소</Tag>
          </div>
        </Card>
      </div>

      <Card title="간격 (4px 그리드)">
        <div className="row" style={{gap: 16, flexWrap: "wrap"}}>
          {[4,8,12,16,20,24,32,40,48,64].map(s => (
            <div key={s} className="col" style={{alignItems: "center", gap: 4}}>
              <div style={{width: s, height: s, background: "var(--c-main)", borderRadius: 2}}/>
              <div className="text t-tertiary">{s} px</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

/* ============= Login ============= */
const Login = ({ onLogin }) => {
  const [email, setEmail] = React.useState("kim@erumpay.kr");
  const [password, setPassword] = React.useState("••••••••");
  const [remember, setRemember] = React.useState(true);
  return (
    <div className="login-shell">
      <div className="login-art">
        <div className="row" style={{gap: 12}}>
          <div className="logo-mark" style={{background: "#fff", color: "var(--c-secondary)"}}>E</div>
          <div style={{fontSize: 20, fontWeight: 800}}>ErumPay</div>
        </div>
        <div>
          <h1>가맹점 운영을<br/>한 화면에서.</h1>
          <p>ErumPay 슈퍼바이저 어드민은 가맹점·결제·정산을 통합 관리하는 PG 운영 콘솔입니다.</p>
        </div>
        <div className="text" style={{opacity: 0.8}}>© 2024 ErumPay. All rights reserved.</div>
      </div>
      <div className="login-card">
        <div>
          <h2 className="h2">로그인</h2>
          <p className="text t-tertiary" style={{marginTop: 4}}>슈퍼바이저 계정으로 로그인하세요.</p>
        </div>
        <Field label="이메일">
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)}/>
        </Field>
        <Field label="비밀번호">
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
        </Field>
        <div className="row between">
          <label className="row" style={{gap: 8, fontSize: 13, cursor: "pointer"}}>
            <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/>
            <span>아이디 저장</span>
          </label>
          <a style={{fontSize: 13, color: "var(--c-secondary)"}}>비밀번호 찾기</a>
        </div>
        <Button kind="primary" size="lg" onClick={onLogin}>로그인</Button>
        <div className="text t-tertiary" style={{textAlign: "center"}}>
          5회 이상 로그인 실패 시 계정이 일시 잠금됩니다.
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Notices, AuditLog, Admins, Benefits, Support, DesignSystem, Login });
