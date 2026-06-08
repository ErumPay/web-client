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
  const [authed, setAuthed] = React.useState(() => window.AuthSession.isAuthenticated());
  const [authStep, setAuthStep] = React.useState("login");
  const [authLoading, setAuthLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState("");
  const [merchant, setMerchant] = React.useState(null);
  const [tx, setTx] = React.useState(null);

  React.useEffect(() => {
    const exchangeKakaoCode = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (!code) return;

      setAuthLoading(true);
      setAuthError("");
      try {
        const result = await window.AuthApi.loginWithKakaoCode(code);
        window.history.replaceState({}, document.title, window.location.pathname);

        if (result.signup_token) {
          setAuthed(false);
          setAuthStep("terms");
          window.location.hash = "terms";
          return;
        }

        setAuthed(true);
        setPage("dashboard");
        window.location.hash = "dashboard";
        await window.MerchantBackendApi.getMerchant(result.merchant_id);
      } catch (error) {
        setAuthed(false);
        setAuthStep("login");
        setAuthError(error.message);
      } finally {
        setAuthLoading(false);
      }
    };

    const onHash = () => {
      const h = window.location.hash.replace("#", "");
      if (h === "login") { setAuthed(false); setAuthStep("login"); return; }
      if (h === "") {
        if (window.AuthSession.isAuthenticated()) {
          setAuthed(true);
          setPage("dashboard");
          if (!window.AuthSession.getProfile()) {
            window.MerchantBackendApi.getMerchant().catch(error => console.error("Merchant profile load failed", error));
          }
        } else {
          setAuthed(false);
          setAuthStep("login");
        }
        return;
      }
      if (h === "terms") { setAuthed(false); setAuthStep("terms"); return; }
      if (h === "signup-info") { setAuthed(false); setAuthStep("info"); return; }
      if (h === "signup-complete") { setAuthed(false); setAuthStep("complete"); return; }
      if (ROUTES[h]) {
        setAuthed(window.AuthSession.isAuthenticated());
        setPage(h);
        if (window.AuthSession.isAuthenticated() && !window.AuthSession.getProfile()) {
          window.MerchantBackendApi.getMerchant().catch(error => console.error("Merchant profile load failed", error));
        }
      }
    };
    onHash();
    exchangeKakaoCode();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const nav = async (id) => {
    if (id === "login") {
      try {
        await window.AuthApi.logout();
      } catch (error) {
        console.error("Logout failed", error);
        window.AuthSession.clear();
      }
      setAuthed(false);
      setAuthStep("login");
      window.location.hash = "login";
      return;
    }
    setPage(id);
    setMerchant(null); setTx(null);
    window.location.hash = id;
  };

  if (authLoading) {
    return <div className="auth-loading">카카오 로그인 정보를 확인하고 있습니다.</div>;
  }

  if (!authed) {
    if (authStep === "terms") {
      return (
        <TermsAgreement
          onCancel={() => { setAuthStep("login"); window.location.hash = "login"; }}
          onNext={async (agreement) => {
            await window.AuthApi.agreeTerms(agreement);
            setAuthStep("info");
            window.location.hash = "signup-info";
          }}
        />
      );
    }

    if (authStep === "info") {
      return (
        <SignupInfo
          onPrev={() => { setAuthStep("terms"); window.location.hash = "terms"; }}
          onSubmit={async (form) => {
            await window.AuthApi.signup(form);
            setAuthStep("complete");
            window.location.hash = "signup-complete";
          }}
        />
      );
    }

    if (authStep === "complete") {
      return <ReviewComplete onEnterMain={() => { setAuthed(false); setAuthStep("login"); window.location.hash = "login"; }}/>;
    }

    return (
      <MerchantLogin
        error={authError}
        onStart={() => window.AuthApi.startKakaoLogin()}
        onEnterMain={() => window.AuthApi.startKakaoLogin()}
      />
    );
  }

  return (
    <div className={`app ${collapsed ? "collapsed" : ""}`}>
      <Sidebar
        current={page}
        onNav={nav}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <main>
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
      </main>
      {merchant && <MerchantDrawer merchant={merchant} onClose={() => setMerchant(null)}/>}
      {tx       && <TransactionDrawer tx={tx}             onClose={() => setTx(null)}/>}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
