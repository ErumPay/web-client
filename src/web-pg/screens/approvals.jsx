/* Merchant approval queue */

const MerchantApprovals = () => {
  const [merchants, setMerchants] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [applicationDate, setApplicationDate] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [approvingId, setApprovingId] = React.useState(null);
  const [error, setError] = React.useState("");

  const load = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setMerchants(await window.PgAdminApi.getPendingMerchants());
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const filtered = merchants.filter(merchant => {
    const keyword = query.trim().toLowerCase();
    const matchesDate = !applicationDate
      || merchant.createdAt?.slice(0, 10) === applicationDate;
    const matchesKeyword = !keyword || [
      merchant.merchantName,
      merchant.businessNumber,
      merchant.ownerName,
      merchant.contactPhone,
    ].some(value => String(value || "").toLowerCase().includes(keyword));
    return matchesDate && matchesKeyword;
  });

  const approve = async merchant => {
    if (!window.confirm(`${merchant.merchantName} 가맹점을 승인할까요?`)) return;
    setApprovingId(merchant.merchantId);
    setError("");
    try {
      await window.PgAdminApi.approveMerchant(merchant.merchantId);
      setMerchants(current =>
        current.filter(item => item.merchantId !== merchant.merchantId)
      );
    } catch (approveError) {
      setError(approveError.message);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="page approval-page">
      <div className="page-header">
        <h1 className="page-title">가맹점 가입 대기</h1>
        <p className="page-desc">가맹점 가입 신청을 확인하고 승인합니다.</p>
      </div>

      <Card>
        <div className="approval-filter">
          <Field label="신청일 조회">
            <input
              className="input"
              type="date"
              value={applicationDate}
              onChange={event => setApplicationDate(event.target.value)}
            />
          </Field>
          <Field label="상태">
            <select className="select" value="PENDING" disabled>
              <option value="PENDING">대기</option>
            </select>
          </Field>
          <Field label="검색">
            <SearchInput
              placeholder="가맹점명, 사업자번호, 대표자명"
              value={query}
              onChange={setQuery}
            />
          </Field>
          <Button kind="primary" onClick={load}>검색</Button>
          <Button
            kind="ghost"
            onClick={() => {
              setApplicationDate("");
              setQuery("");
            }}
          >
            초기화
          </Button>
        </div>
      </Card>

      {error && <div className="pg-api-error">{error}</div>}

      <Card flush>
        <div className="approval-list-head">
          <h2>가입 신청 목록</h2>
          <span>총 <strong>{filtered.length}건</strong></span>
        </div>
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>순번</th>
                <th>신청일시</th>
                <th>가맹점명</th>
                <th>사업자등록번호</th>
                <th>대표자명</th>
                <th>연락처</th>
                <th>주소</th>
                <th className="center">상태</th>
                <th className="center">기능</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="9" className="center">가입 신청을 불러오는 중입니다.</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan="9" className="center">대기 중인 가입 신청이 없습니다.</td></tr>
              )}
              {!loading && filtered.map((merchant, index) => (
                <tr key={merchant.merchantId}>
                  <td>{index + 1}</td>
                  <td className="num">{merchant.createdAt?.replace("T", " ").slice(0, 16) || "-"}</td>
                  <td style={{fontWeight: 700}}>{merchant.merchantName}</td>
                  <td className="num">{merchant.businessNumber}</td>
                  <td>{merchant.ownerName}</td>
                  <td className="num">{merchant.contactPhone}</td>
                  <td>{merchant.businessAddress}</td>
                  <td className="center"><Tag kind="info">대기</Tag></td>
                  <td className="center">
                    <Button
                      kind="primary"
                      size="sm"
                      disabled={approvingId === merchant.merchantId}
                      onClick={() => approve(merchant)}
                    >
                      {approvingId === merchant.merchantId ? "처리 중" : "승인"}
                    </Button>
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

window.MerchantApprovals = MerchantApprovals;
