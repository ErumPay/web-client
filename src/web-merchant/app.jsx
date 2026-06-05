/* Main App */

const ROUTES = {
  dashboard:       { title: "대시보드",        crumbs: ["대시보드"] },
  sales:           { title: "매출 관리",       crumbs: ["매출 관리"] },
  transactions:    { title: "거래 관리",       crumbs: ["거래 관리"] },
  settlements:     { title: "정산 관리",       crumbs: ["정산 관리"] },
  notices:         { title: "알림/공지 관리",  crumbs: ["알림/공지 관리"] },
  "merchant-info": { title: "내 가맹점 관리",  crumbs: ["ACCOUNT", "내 가맹점 관리"] },
  support:         { title: "고객센터",        crumbs: ["ACCOUNT", "고객센터"] },
};

const App = () => {
  const [page, setPage] = React.useState("dashboard");
  const [collapsed, setCollapsed] = React.useState(false);
  const [authed, setAuthed] = React.useState(true);
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

  const nav = (id) => {
    if (id === "login") { setAuthed(false); window.location.hash = "login"; return; }
    setPage(id);
    setMerchant(null); setTx(null);
    window.location.hash = id;
  };

  if (!authed) {
    return <Login onLogin={() => { setAuthed(true); window.location.hash = "dashboard"; }}/>;
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
          onUser={() => nav("merchant-info")}
          unread={3}
        />
        {page === "dashboard"    && <Dashboard onOpenMerchant={setMerchant}/>}
        {page === "sales"        && <Sales/>}
        {page === "transactions" && <Transactions onOpen={setTx}/>}
        {page === "settlements"  && <Settlements/>}
        {page === "notices"      && <Notices/>}
        {page === "merchant-info" && <MerchantInfo/>}
        {page === "support"      && <Support/>}
        <div className="page-footer">© 2024 ErumPay. All rights reserved.</div>
      </main>
      {merchant && <MerchantDrawer merchant={merchant} onClose={() => setMerchant(null)}/>}
      {tx       && <TransactionDrawer tx={tx}             onClose={() => setTx(null)}/>}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
