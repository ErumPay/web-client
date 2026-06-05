/* Merchant profile management */

const MerchantInfo = ({ initialTab = "store" }) => {
  const [tab, setTab] = React.useState(initialTab);
  const merchant = MERCHANTS[0];

  React.useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  return (
    <div className="page">
      <div className="row between">
        <div className="page-header">
          <h1 className="page-title">내 가맹점 관리</h1>
          <p className="page-desc">가게 정보, 사업자 정보, 정산 정보를 관리합니다.</p>
        </div>
        <Button kind="primary"><Icons.Edit size={14}/> 정보 수정 요청</Button>
      </div>

      <Card flush>
        <div style={{padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--border)"}}>
          <Tabs value={tab} onChange={setTab} items={[
            {value: "business", label: "사업자 정보"},
            {value: "store", label: "가게 정보"},
            {value: "settlement", label: "정산 계좌"},
            {value: "status", label: "운영 상태"},
          ]}/>
        </div>
        <div className="card-body">
          {tab === "business" && (
            <div className="grid-2">
              <Card title="기본 정보">
                <InfoGrid rows={[
                  ["가맹점명", merchant.name, "MID", merchant.mid],
                  ["사업자번호", merchant.bizNo, "대표자", merchant.rep],
                  ["업종", merchant.category, "가입일", merchant.joined],
                ]}/>
              </Card>
              <Card title="사업자 등록증">
                <div className="empty" style={{padding: "var(--s-8) var(--s-4)"}}>
                  <div className="ico"><Icons.Download size={24}/></div>
                  <div style={{fontSize: 13, fontWeight: 600}}>사업자등록증.pdf</div>
                  <div className="text t-tertiary" style={{marginTop: 4}}>최근 제출일 2024-05-10</div>
                </div>
              </Card>
            </div>
          )}

          {tab === "store" && (
            <Card title="매장 정보">
              <InfoGrid rows={[
                ["매장명", merchant.name + " 강남점", "연락처", "02-1234-5678"],
                ["주소", "서울특별시 강남구 테헤란로 123", "운영 시간", "10:00 - 22:00"],
                ["단말기", `${merchant.terminals}대`, "대표 이메일", "store@erumpay.kr"],
              ]}/>
            </Card>
          )}

          {tab === "settlement" && (
            <Card title="정산 계좌">
              <InfoGrid rows={[
                ["은행", "신한은행", "계좌번호", "110-***-******"],
                ["예금주", merchant.rep, "정산 주기", "주 1회"],
                ["수수료율", merchant.fee + "%", "다음 정산일", "2024-05-20"],
              ]}/>
            </Card>
          )}

          {tab === "status" && (
            <div className="grid-2">
              <Card title="운영 상태">
                <InfoGrid rows={[
                  ["현재 상태", <StatusTag status={merchant.status}/>, "심사 상태", "승인 완료"],
                  ["결제 상태", "정상", "정산 상태", "정상"],
                ]}/>
              </Card>
              <Card title="최근 변경 이력">
                <div className="col" style={{gap: 8}}>
                  {[
                    ["2024-05-14", "정산 계좌 검증 완료"],
                    ["2024-05-10", "사업자 정보 수정 요청 승인"],
                    ["2024-05-01", "가맹점 운영 상태 정상 전환"],
                  ].map(([date, text]) => (
                    <div key={date} className="row" style={{padding: 10, background: "var(--bg-subtle)", borderRadius: 8}}>
                      <span className="num t-tertiary" style={{width: 92}}>{date}</span>
                      <span style={{fontSize: 13, fontWeight: 600}}>{text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

window.MerchantInfo = MerchantInfo;
