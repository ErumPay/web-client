/* Sidebar + Header */

const NAV_MAIN = [
  { id: "dashboard",    label: "대시보드",        icon: "Dashboard" },
  { id: "merchants",    label: "가맹점 관리",      icon: "Store" },
  { id: "transactions", label: "결제관리",         icon: "Card" },
  { id: "settlements",  label: "정산관리",         icon: "Calc" },
  { id: "benefits",     label: "카드 혜택/수집 관리", icon: "Gift" },
  { id: "notices",      label: "알림/공지 관리",   icon: "Speaker" },
];
const NAV_SYS = [
  { id: "audit",  label: "감사 로그",   icon: "Shield" },
  { id: "admins", label: "관리자 관리", icon: "Users" },
  { id: "design", label: "디자인 시스템", icon: "Eye" },
];

const Sidebar = ({ current, onNav, collapsed }) => {
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
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-brand">
        <div className="logo-mark">E</div>
        <div className="brand-name">ErumPay</div>
      </div>
      <nav className="sidebar-nav">
        {NAV_MAIN.map(item)}
        <div className="nav-section">SYSTEM</div>
        {NAV_SYS.map(item)}
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

const Header = ({ onToggleSidebar, crumbs, onBell, onUser, unread }) => (
  <header className="header">
    <button className="icon-btn" onClick={onToggleSidebar} title="메뉴 접기">
      <Icons.Menu size={20}/>
    </button>
    <div className="crumbs">
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{margin: "0 8px", color: "var(--text-disabled)"}}>›</span>}
          {i === crumbs.length - 1 ? <strong>{c}</strong> : <span>{c}</span>}
        </React.Fragment>
      ))}
    </div>
    <div className="spacer"></div>
    <div className="bell-wrap">
      <button className="icon-btn" onClick={onBell} title="알림"><Icons.Bell size={20}/></button>
      {unread > 0 && <span className="bell-dot"/>}
    </div>
    <button className="user-chip" onClick={onUser}>
      <span className="avatar">김</span>
      <span>김이름</span>
      <Icons.Down size={14}/>
    </button>
  </header>
);

Object.assign(window, { Sidebar, Header, NAV_MAIN, NAV_SYS });
