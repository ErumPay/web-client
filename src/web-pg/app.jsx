/* Main App */

const ROUTES = {
  dashboard:    { title: "대시보드",          crumbs: ["대시보드"] },
  approvals:    { title: "가맹점 가입 대기", crumbs: ["가맹점 가입 대기"] },
  merchants:    { title: "가맹점 관리",        crumbs: ["가맹점 관리"] },
  transactions: { title: "결제관리",           crumbs: ["결제관리"] },
  settlements:  { title: "정산관리",           crumbs: ["정산관리"] },
  benefits:     { title: "카드 혜택/수집 관리", crumbs: ["카드 혜택/수집 관리"] },
  notices:      { title: "알림/공지 관리",     crumbs: ["알림/공지 관리"] },
  audit:        { title: "감사 로그",          crumbs: ["SYSTEM", "감사 로그"] },
  admins:       { title: "관리자 관리",        crumbs: ["SYSTEM", "관리자 관리"] },
  design:       { title: "디자인 시스템",      crumbs: ["SYSTEM", "디자인 시스템"] },
};

const App = () => {
  const [page, setPage] = React.useState("dashboard");
  const [collapsed, setCollapsed] = React.useState(false);
  const [authed, setAuthed] = React.useState(() => window.PgSession.isAuthenticated());
  const [merchant, setMerchant] = React.useState(null);
  const [tx, setTx] = React.useState(null);

  React.useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace("#", "");
      if (h === "login") { setAuthed(false); return; }
      if (ROUTES[h]) setPage(h);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const nav = async (id) => {
    if (id === "login") {
      try {
        await window.PgAdminApi.logout();
      } catch (error) {
        console.error("PG logout failed", error);
      }
      setAuthed(false);
      window.location.hash = "login";
      return;
    }
    setPage(id);
    setMerchant(null); setTx(null);
    window.location.hash = id;
  };

  if (!authed) {
    return <Login onLogin={async form => {
      await window.PgAdminApi.login(form);
      setAuthed(true);
      setPage("approvals");
      window.location.hash = "approvals";
    }}/>;
  }

  const route = ROUTES[page] || ROUTES.dashboard;

  return (
    <div className={`app ${collapsed ? "collapsed" : ""}`}>
      <Sidebar current={page} onNav={nav} collapsed={collapsed}/>
      <main>
        <Header
          onToggleSidebar={() => setCollapsed(!collapsed)}
          crumbs={route.crumbs}
          onBell={() => nav("notices")}
          onUser={() => nav("admins")}
          unread={3}
        />
        {page === "dashboard"    && <Dashboard onOpenMerchant={setMerchant}/>}
        {page === "approvals"    && <MerchantApprovals/>}
        {page === "merchants"    && <Merchants onOpen={setMerchant}/>}
        {page === "transactions" && <Transactions onOpen={setTx}/>}
        {page === "settlements"  && <Settlements/>}
        {page === "benefits"     && <Benefits/>}
        {page === "notices"      && <Notices/>}
        {page === "audit"        && <AuditLog/>}
        {page === "admins"       && <Admins/>}
        {page === "design"       && <DesignSystem/>}
        <div className="page-footer">© 2024 ErumPay. All rights reserved.</div>
      </main>
      {merchant && <MerchantDrawer merchant={merchant} onClose={() => setMerchant(null)}/>}
      {tx       && <TransactionDrawer tx={tx}             onClose={() => setTx(null)}/>}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
