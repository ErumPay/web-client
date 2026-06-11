/* Merchant transaction management */

const TRANSACTION_CUSTOMERS = ["홍길동", "김영희", "이철수", "박민수", "정수진", "최동욱", "강민지", "윤서현", "한지민", "오세훈"];

const enhanceTransaction = (tx, index) => ({
  ...tx,
  customer: TRANSACTION_CUSTOMERS[index % TRANSACTION_CUSTOMERS.length],
  approvalNo: tx.status === "failed" ? "—" : `A${12345678 + index}`,
  terminalId: "M001",
  displayStatus: tx.status === "paid" ? "승인" : tx.status === "failed" ? "실패" : tx.status === "refunded" ? "환불" : tx.status === "canceled" ? "취소" : "대기",
});

const Transactions = ({ onOpen }) => {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [method, setMethod] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const rows = window.MerchantApi.getTransactions().map(enhanceTransaction).slice(0, 10);
  const filtered = rows.filter(tx =>
    (!query || tx.id.includes(query) || tx.customer.includes(query)) &&
    (status === "all" || tx.status === status) &&
    (method === "all" || tx.card === method)
  );

  return (
    <div className="page merchant-transactions final-list-page">
      <div className="row between">
        <h1 className="page-title">거래 관리</h1>
        <Button kind="ghost"><Icons.Download size={14}/> 엑셀 다운로드</Button>
      </div>

      <div className="transaction-filter-card">
        <SearchInput placeholder="거래번호 또는 고객명으로 검색" value={query} onChange={setQuery}/>
        <button className="date-filter"><Icons.Calendar size={16}/></button>
        <Select value={status} onChange={setStatus} options={[
          {value: "all", label: "전체 상태"},
          {value: "paid", label: "승인"},
          {value: "failed", label: "실패"},
          {value: "canceled", label: "취소"},
          {value: "refunded", label: "환불"},
        ]}/>
        <Select value={method} onChange={setMethod} options={[
          {value: "all", label: "전체 결제수단"},
          {value: "이룸페이", label: "이룸페이"},
          {value: "신한카드", label: "신한카드"},
          {value: "삼성카드", label: "삼성카드"},
          {value: "현대카드", label: "현대카드"},
        ]}/>
        <button className="reset-filter" onClick={() => { setQuery(""); setStatus("all"); setMethod("all"); }}>초기화</button>
      </div>

      <section className="final-table-card transaction-table">
        <div className="transaction-table-head">
          <span>거래번호</span><span>거래일시</span><span>고객명</span><span>결제수단</span><span>금액</span><span>구분</span><span>상태</span><span>상세</span>
        </div>
        {filtered.map(tx => (
          <div key={tx.id} className="transaction-table-row">
            <span className="mono">{tx.id}</span>
            <span>{tx.time}</span>
            <span>{tx.customer}</span>
            <span>{tx.card}</span>
            <strong>{fmtKRW(tx.amount)}</strong>
            <span className={tx.status === "canceled" ? "t-warning" : tx.status === "refunded" ? "t-main" : ""}>
              {tx.status === "canceled" ? "취소" : tx.status === "refunded" ? "환불" : "결제"}
            </span>
            <span><Tag kind={tx.status === "paid" ? "success" : tx.status === "failed" ? "danger" : tx.status === "refunded" ? "info" : tx.status === "canceled" ? "warning" : "neutral"}>{tx.displayStatus}</Tag></span>
            <button onClick={() => onOpen?.(tx)}>조회</button>
          </div>
        ))}
        <div className="final-table-footer">
          <span>총 {filtered.length}건</span>
          <Pager page={page} total={3} onChange={setPage}/>
        </div>
      </section>
    </div>
  );
};

const TransactionDrawer = ({ tx, onClose }) => {
  const [receiptOpen, setReceiptOpen] = React.useState(false);
  if (!tx) return null;

  return (
    <React.Fragment>
      <div className="modal-mask" onClick={onClose}/>
      <section className="transaction-modal">
        <div className="modal-title">
          <h2>거래 상세</h2>
          <button onClick={onClose}><Icons.Close size={20}/></button>
        </div>

        <div className="transaction-total">
          <div><span>거래 상태</span><StatusTag status={tx.status}/></div>
          <div><span>거래 금액</span><strong>{fmtKRW(tx.amount)}</strong></div>
        </div>

        <h3>기본 정보</h3>
        <div className="modal-info-grid">
          <div><span>거래번호</span><strong>{tx.id}</strong></div>
          <div><span>거래일시</span><strong>{tx.time}</strong></div>
          <div><span>고객명</span><strong>{tx.customer}</strong></div>
          <div><span>거래 구분</span><strong>결제</strong></div>
        </div>

        <h3>결제 정보</h3>
        <div className="modal-info-grid">
          <div><span>결제수단</span><strong>{tx.card}</strong></div>
          <div><span>카드번호</span><strong>1234-****-****-5678</strong></div>
          <div><span>할부</span><strong>일시불</strong></div>
          <div><span>승인번호</span><strong>{tx.approvalNo}</strong></div>
        </div>

        <h3>가맹점 정보</h3>
        <div className="modal-info-grid one"><div><span>가맹점 ID</span><strong>{tx.terminalId}</strong></div></div>

        <div className="transaction-modal-actions">
          <button className="cancel">취소 요청</button>
          <button className="refund">환불 요청</button>
          <button onClick={() => setReceiptOpen(true)}>영수증 출력</button>
        </div>
      </section>

      {receiptOpen && <TransactionReceipt tx={tx} onClose={() => setReceiptOpen(false)}/>}
    </React.Fragment>
  );
};

const TransactionReceipt = ({ tx, onClose }) => (
  <React.Fragment>
    <div className="receipt-mask"/>
    <section className="receipt-modal">
      <div className="modal-title"><h2>영수증</h2><button onClick={onClose}><Icons.Close size={20}/></button></div>
      <div className="receipt-store">
        <img src="/assets/erumpay-ci.png" alt="ErumPay"/>
        <h3>테스트 가게</h3>
        <p>서울특별시 강남구 테헤란로 123<br/>TEL : 02-1234-5678<br/>사업자번호: 123-45-67890</p>
      </div>
      <div className="receipt-body">
        <h2>신용카드 매출전표</h2>
        <span>(고객용)</span>
        <dl>
          <div><dt>거래번호</dt><dd>{tx.id}</dd></div>
          <div><dt>거래일시</dt><dd>{tx.time}</dd></div>
          <div><dt>카드종류</dt><dd>{tx.card}</dd></div>
          <div><dt>카드번호</dt><dd>1234-****-****-5678</dd></div>
          <div><dt>할부</dt><dd>일시불</dd></div>
          <div><dt>승인번호</dt><dd>{tx.approvalNo}</dd></div>
        </dl>
        <dl className="receipt-price">
          <div><dt>공급가액</dt><dd>{fmtKRW(Math.round(tx.amount / 1.1))}</dd></div>
          <div><dt>부가세</dt><dd>{fmtKRW(tx.amount - Math.round(tx.amount / 1.1))}</dd></div>
          <div className="total"><dt>합계금액</dt><dd>{fmtKRW(tx.amount)}</dd></div>
        </dl>
        <p className="receipt-note">본 영수증은 법적 효력이 있는 증빙자료입니다.<br/>문의사항은 고객센터(1234-5678)로 연락주세요.</p>
      </div>
      <div className="receipt-actions"><button>인쇄하기</button><button onClick={onClose}>닫기</button></div>
    </section>
  </React.Fragment>
);

Object.assign(window, { Transactions, TransactionDrawer });
