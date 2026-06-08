/* Sidebar + Header */

const NAV_MAIN = [
  { id: "dashboard",    label: "대시보드",        icon: "Dashboard" },
  { id: "sales",        label: "매출관리",        icon: "Up" },
  { id: "transactions", label: "거래관리",        icon: "Card" },
  { id: "settlements",  label: "정산관리",        icon: "Won" },
];
const NAV_STORE = [
  { id: "store-info",      label: "가게 정보",   icon: "Store" },
  { id: "business-info",   label: "사업자 정보", icon: "Doc" },
  { id: "settlement-info", label: "정산 정보",   icon: "Wallet" },
];

const Sidebar = ({ current, onNav, collapsed, onToggle }) => {
  const isStoreActive = NAV_STORE.some(it => it.id === current);
  const [storeOpen, setStoreOpen] = React.useState(isStoreActive);

  React.useEffect(() => {
    if (isStoreActive) setStoreOpen(true);
  }, [isStoreActive]);

  const item = (it) => {
    const Ico = Icons[it.icon];
    return (
      <button
        key={it.id}
        className={`nav-item ${current === it.id ? "active" : ""}`}
        onClick={() => onNav(it.id)}
        title={it.label}
      >
        <span className="nav-icon"><Ico size={18}/></span>
        <span className="nav-label">{it.label}</span>
      </button>
    );
  };

  const childItem = (it) => {
    const Ico = Icons[it.icon];
    return (
      <button
        key={it.id}
        className={`nav-sub-item ${current === it.id ? "active" : ""}`}
        onClick={() => onNav(it.id)}
        title={it.label}
      >
        <span className="nav-icon"><Ico size={16}/></span>
        <span className="nav-label">{it.label}</span>
      </button>
    );
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-brand">
        <img className="brand-ci" src="/assets/erumpay-ci.png" alt="ErumPay" />
        <button
          className="sidebar-menu-btn"
          onClick={onToggle}
          title={collapsed ? "메뉴 펼치기" : "메뉴 접기"}
          aria-label={collapsed ? "메뉴 펼치기" : "메뉴 접기"}
        >
          <Icons.Menu size={20}/>
        </button>
      </div>
      <nav className="sidebar-nav">
        {NAV_MAIN.map(item)}
        <div className={`nav-group ${isStoreActive ? "active" : ""} ${storeOpen ? "open" : ""}`}>
          <button
            className="nav-item nav-parent"
            onClick={() => setStoreOpen(open => !open)}
            title="내 가게 정보 관리"
            aria-expanded={storeOpen}
          >
            <span className="nav-icon"><Icons.Store size={18}/></span>
            <span className="nav-label">내 가게 정보 관리</span>
            <span className="nav-caret"><Icons.Down size={14}/></span>
          </button>
          {storeOpen && (
            <div className="nav-sub-list">
              {NAV_STORE.map(childItem)}
            </div>
          )}
        </div>
      </nav>
      <div className="sidebar-footer">
        <button className="nav-item" onClick={() => onNav("login")}>
          <span className="nav-icon"><Icons.Logout size={18}/></span>
          <span className="nav-label">로그아웃</span>
        </button>
      </div>
    </aside>
  );
};

const Header = ({ crumbs, onUser }) => (
  <header className="header">
    <div className="crumbs">
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{margin: "0 8px", color: "var(--text-disabled)"}}>›</span>}
          {i === crumbs.length - 1 ? <strong>{c}</strong> : <span>{c}</span>}
        </React.Fragment>
      ))}
    </div>
    <div className="spacer"></div>
    <button className="user-chip" onClick={onUser}>
      <span className="avatar">김</span>
      <span>김이름</span>
      <Icons.Down size={14}/>
    </button>
  </header>
);

Object.assign(window, { Sidebar, Header, NAV_MAIN, NAV_STORE });
