/* Common UI components for ErumPay Admin */

const Tag = ({ kind = "neutral", dot = false, children }) => (
  <span className={`tag ${kind} ${dot ? "dot" : ""}`}>{children}</span>
);

const Button = ({ kind = "ghost", size, icon, children, onClick, type = "button", ...buttonProps }) => (
  <button
    type={type}
    onClick={onClick}
    className={`btn ${kind} ${size || ""}`.trim()}
    {...buttonProps}
  >
    {icon}
    {children}
  </button>
);

const Card = ({ title, action, children, flush }) => (
  <section className={`card ${flush ? "flush" : ""}`}>
    {(title || action) && (
      <div className="card-head">
        {title && <h3>{title}</h3>}
        {action}
      </div>
    )}
    <div className={title ? "card-body" : ""} style={title ? {} : {padding: 0}}>{children}</div>
  </section>
);

const Field = ({ label, children }) => (
  <div className="field">
    {label && <label className="field-label">{label}</label>}
    {children}
  </div>
);

const SearchInput = ({ placeholder = "검색", value, onChange }) => (
  <div className="input-with-icon">
    <span className="lead-icon"><Icons.Search size={16}/></span>
    <input className="input" placeholder={placeholder} value={value||""} onChange={e=>onChange?.(e.target.value)}/>
  </div>
);

const DateInput = ({ value, onChange, placeholder }) => (
  <div className="input-with-icon">
    <span className="lead-icon"><Icons.Calendar size={16}/></span>
    <input className="input" placeholder={placeholder || "YYYY-MM-DD"} value={value||""} onChange={e=>onChange?.(e.target.value)} />
  </div>
);

const Select = ({ value, onChange, options }) => (
  <select className="select" value={value} onChange={e=>onChange?.(e.target.value)}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const Pager = ({ page = 1, total = 13, onChange }) => {
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(total, start + 4);
  for (let p = start; p <= end; p++) pages.push(p);
  return (
    <div className="pager">
      <button className="pg-btn" disabled={page === 1} onClick={() => onChange?.(page - 1)}>
        <Icons.Left size={14}/>
      </button>
      {pages.map(p => (
        <button key={p} className={`pg-btn ${p === page ? "active" : ""}`} onClick={() => onChange?.(p)}>{p}</button>
      ))}
      {end < total && <span className="pg-btn" style={{border:"none", background:"transparent"}}>…</span>}
      {end < total && <button className="pg-btn" onClick={() => onChange?.(total)}>{total}</button>}
      <button className="pg-btn" disabled={page === total} onClick={() => onChange?.(page + 1)}>
        <Icons.Right size={14}/>
      </button>
    </div>
  );
};

const StatusTag = ({ status }) => {
  const map = {
    normal:    { kind: "success", label: "정상" },
    caution:   { kind: "warning", label: "주의" },
    suspended: { kind: "danger",  label: "정지" },
    pending:   { kind: "info",    label: "대기" },
    waiting:   { kind: "neutral", label: "심사중" },
    approved:  { kind: "success", label: "승인" },
    rejected:  { kind: "danger",  label: "반려" },
    paid:      { kind: "success", label: "결제완료" },
    refunded:  { kind: "warning", label: "환불" },
    failed:    { kind: "danger",  label: "실패" },
    canceled:  { kind: "neutral", label: "취소" },
  };
  const m = map[status] || { kind: "neutral", label: status };
  return <Tag kind={m.kind} dot>{m.label}</Tag>;
};

const BrandCell = ({ name, mid, mark, color }) => (
  <div className="brand-cell">
    <div className="brand-avatar" style={color ? {background: color, color: "#fff", border: "none"} : {}}>{mark || name?.[0]}</div>
    <div className="mid-row">
      <div className="name">{name}</div>
      <div className="mid">MID: {mid}</div>
    </div>
  </div>
);

const Empty = ({ title = "데이터가 없습니다", desc }) => (
  <div className="empty">
    <div className="ico"><Icons.Search size={24}/></div>
    <div style={{fontSize: 13, color: "var(--text-secondary)", fontWeight: 600}}>{title}</div>
    {desc && <div style={{fontSize: 12, marginTop: 4}}>{desc}</div>}
  </div>
);

const InfoGrid = ({ rows }) => (
  <div className="info-grid">
    {rows.map((r, i) => (
      <React.Fragment key={i}>
        <div className="lbl">{r[0]}</div>
        <div className="val">{r[1]}</div>
        <div className="lbl">{r[2] || ""}</div>
        <div className="val">{r[3] || ""}</div>
      </React.Fragment>
    ))}
  </div>
);

const Tabs = ({ value, onChange, items }) => (
  <div className="tabs">
    {items.map(it => (
      <button key={it.value} className={`tab ${value === it.value ? "active" : ""}`} onClick={() => onChange?.(it.value)}>
        {it.label}
      </button>
    ))}
  </div>
);

const fmtKRW = (n) => "₩ " + n.toLocaleString("ko-KR");
const fmtNum = (n) => n.toLocaleString("ko-KR");

Object.assign(window, {
  Tag, Button, Card, Field, SearchInput, DateInput, Select, Pager,
  StatusTag, BrandCell, Empty, InfoGrid, Tabs, fmtKRW, fmtNum,
});
