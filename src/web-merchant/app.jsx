/* Main App */

const ROUTES = {
  dashboard:       { title: "대시보드",        crumbs: ["대시보드"] },
  sales:           { title: "매출관리",        crumbs: ["매출관리"] },
  transactions:    { title: "거래관리",        crumbs: ["거래관리"] },
  settlements:     { title: "정산관리",        crumbs: ["정산관리"] },
  notices:         { title: "알림/공지 관리",  crumbs: ["알림/공지 관리"] },
  "store-info":    { title: "가게 정보",       crumbs: ["내 가게 정보 관리", "가게 정보"] },
  "business-info": { title: "사업자 정보",     crumbs: ["내 가게 정보 관리", "사업자 정보"] },
  "settlement-info": { title: "정산 정보",     crumbs: ["내 가게 정보 관리", "정산 정보"] },
  "merchant-info": { title: "내 가게 정보 관리", crumbs: ["내 가게 정보 관리"] },
  support:         { title: "고객센터",        crumbs: ["ACCOUNT", "고객센터"] },
};

const App = () => {
  const [page, setPage] = React.useState("dashboard");
  const [collapsed, setCollapsed] = React.useState(false);
  const [authed, setAuthed] = React.useState(false);
  const [authStep, setAuthStep] = React.useState("login");
  const [merchant, setMerchant] = React.useState(null);
  const [tx, setTx] = React.useState(null);

  React.useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace("#", "");
      if (h === "login" || h === "") { setAuthed(false); setAuthStep("login"); return; }
      if (h === "terms") { setAuthed(false); setAuthStep("terms"); return; }
      if (h === "signup-info") { setAuthed(false); setAuthStep("info"); return; }
      if (h === "signup-complete") { setAuthed(false); setAuthStep("complete"); return; }
      if (ROUTES[h]) setPage(h);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const nav = (id) => {
    if (id === "login") { setAuthed(false); setAuthStep("login"); window.location.hash = "login"; return; }
    setPage(id);
    setMerchant(null); setTx(null);
    window.location.hash = id;
  };

  if (!authed) {
    if (authStep === "terms") {
      return (
        <TermsAgreement
          onCancel={() => { setAuthStep("login"); window.location.hash = "login"; }}
          onNext={() => { setAuthStep("info"); window.location.hash = "signup-info"; }}
        />
      );
    }

    if (authStep === "info") {
      return (
        <SignupInfo
          onPrev={() => { setAuthStep("terms"); window.location.hash = "terms"; }}
          onSubmit={() => { setAuthStep("complete"); window.location.hash = "signup-complete"; }}
        />
      );
    }

    if (authStep === "complete") {
      return <ReviewComplete onEnterMain={() => { setAuthed(true); window.location.hash = "dashboard"; }}/>;
    }

    return (
      <MerchantLogin
        onStart={() => { setAuthStep("terms"); window.location.hash = "terms"; }}
        onEnterMain={() => { setAuthed(true); window.location.hash = "dashboard"; }}
      />
    );
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
          onUser={() => nav("store-info")}
          unread={3}
        />
        {page === "dashboard"    && <Dashboard onOpenMerchant={setMerchant}/>}
        {page === "sales"        && <Sales/>}
        {page === "transactions" && <Transactions onOpen={setTx}/>}
        {page === "settlements"  && <Settlements/>}
        {page === "notices"      && <Notices/>}
        {page === "store-info" && <MerchantInfo initialTab="store"/>}
        {page === "business-info" && <MerchantInfo initialTab="business"/>}
        {page === "settlement-info" && <MerchantInfo initialTab="settlement"/>}
        {page === "merchant-info" && <MerchantInfo initialTab="store"/>}
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
