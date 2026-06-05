/* Merchant store information */

const CHANGE_LOGS = [
  ["2026-06-03", "정산 계좌 검증 완료"],
  ["2026-05-28", "사업자 정보 수정 요청 승인"],
  ["2026-05-20", "가게 운영 상태 정상 전환"],
];

const InfoNotice = ({ icon, title, desc, action }) => (
  <div className="info-notice">
    <div className="info-notice-icon">{icon}</div>
    <div className="info-notice-copy">
      <strong>{title}</strong>
      <span>{desc}</span>
    </div>
    {action}
  </div>
);

const InfoList = ({ rows }) => (
  <div className="info-list">
    {rows.map(([label, value]) => (
      <div key={label} className="info-list-row">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    ))}
  </div>
);

const MerchantInfo = ({ initialTab = "store" }) => {
  const merchant = MERCHANTS[0];
  const section = ["store", "business", "settlement"].includes(initialTab) ? initialTab : "store";

  const pageMeta = {
    store: {
      title: "가게 정보",
      desc: "가게 기본 정보와 운영 상태를 확인합니다.",
      button: "가게 정보 수정 요청",
    },
    business: {
      title: "사업자 정보",
      desc: "사업자 등록 정보와 제출 서류를 확인합니다.",
      button: "사업자 정보 수정 요청",
    },
    settlement: {
      title: "정산 정보",
      desc: "정산 계좌, 수수료율, 정산 주기를 확인합니다.",
      button: "정산 정보 수정 요청",
    },
  }[section];

  return (
    <div className="page merchant-info-page">
      <div className="row between">
        <div className="page-header">
          <h1 className="page-title">{pageMeta.title}</h1>
          <p className="page-desc">{pageMeta.desc}</p>
        </div>
        <Button kind="primary"><Icons.Edit size={14}/>{pageMeta.button}</Button>
      </div>

      {section === "store" && <StoreInfo merchant={merchant}/>}
      {section === "business" && <BusinessInfo merchant={merchant}/>}
      {section === "settlement" && <SettlementInfo merchant={merchant}/>}
    </div>
  );
};

const StoreInfo = ({ merchant }) => (
  <div className="merchant-info-layout">
    <Card title="가게 기본 정보">
      <InfoGrid rows={[
        ["가게명", `${merchant.name} 강남점`, "MID", merchant.mid],
        ["대표 연락처", "02-1234-5678", "대표 이메일", "store@erumpay.kr"],
        ["가게 주소", "서울특별시 강남구 테헤란로 123", "업종", merchant.category],
        ["운영 시간", "10:00 - 22:00", "단말기 수", `${merchant.terminals}대`],
      ]}/>
    </Card>

    <div className="grid-2">
      <Card title="운영 상태">
        <InfoList rows={[
          ["운영 상태", <StatusTag status={merchant.status}/>],
          ["심사 상태", <Tag kind="success">승인 완료</Tag>],
          ["결제 상태", <Tag kind="success">정상</Tag>],
          ["정산 상태", <Tag kind="success">정상</Tag>],
        ]}/>
      </Card>

      <Card title="최근 변경 이력">
        <div className="merchant-log-list">
          {CHANGE_LOGS.map(([date, text]) => (
            <div key={date} className="merchant-log-item">
              <span>{date}</span>
              <strong>{text}</strong>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <InfoNotice
      icon={<Icons.Store size={20}/>}
      title="운영 정보 변경 안내"
      desc="주소, 연락처, 운영 시간 변경은 관리자 승인 후 반영됩니다."
      action={<Button kind="ghost" size="sm">변경 이력 보기</Button>}
    />
  </div>
);

const BusinessInfo = ({ merchant }) => (
  <div className="merchant-info-layout">
    <Card title="사업자 기본 정보">
      <InfoGrid rows={[
        ["상호명", merchant.name, "사업자번호", merchant.bizNo],
        ["대표자", merchant.rep, "업태", "소매"],
        ["종목", merchant.category, "개업일", "2023-02-01"],
        ["사업장 주소", "서울특별시 강남구 테헤란로 123", "가입일", merchant.joined],
      ]}/>
    </Card>

    <div className="grid-2">
      <Card title="사업자 등록증">
        <div className="document-card">
          <div className="document-icon"><Icons.Doc size={24}/></div>
          <div className="document-copy">
            <strong>사업자등록증.pdf</strong>
            <span>최근 제출일 2026-05-28</span>
          </div>
          <Button kind="ghost" size="sm"><Icons.Download size={14}/> 다운로드</Button>
        </div>
      </Card>

      <Card title="검증 상태">
        <InfoList rows={[
          ["사업자 검증", <Tag kind="success">검증 완료</Tag>],
          ["대표자 인증", <Tag kind="success">완료</Tag>],
          ["서류 상태", <Tag kind="success">승인</Tag>],
          ["최근 검증일", "2026-05-28"],
        ]}/>
      </Card>
    </div>

    <InfoNotice
      icon={<Icons.Shield size={20}/>}
      title="사업자 정보 변경 안내"
      desc="사업자번호, 대표자, 상호명 변경 시 증빙 서류 재제출이 필요합니다."
      action={<Button kind="ghost" size="sm">서류 재제출</Button>}
    />
  </div>
);

const SettlementInfo = ({ merchant }) => (
  <div className="merchant-info-layout">
    <Card title="정산 계좌">
      <InfoGrid rows={[
        ["은행", "신한은행", "계좌번호", "110-***-******"],
        ["예금주", merchant.rep, "계좌 검증 상태", <Tag kind="success">검증 완료</Tag>],
        ["정산 주기", "주 1회", "다음 정산일", "2026-06-10"],
        ["수수료율", `${merchant.fee}%`, "정산 기준", "승인일 + 3영업일"],
      ]}/>
    </Card>

    <div className="grid-2">
      <Card title="정산 정책">
        <InfoList rows={[
          ["정산 방식", "자동 입금"],
          ["지급 시간", "오후 2시 이후"],
          ["최소 정산액", fmtKRW(10000)],
          ["보류 기준", "취소/환불 발생 시"],
        ]}/>
      </Card>

      <Card title="최근 정산 정보">
        <InfoList rows={[
          ["최근 정산일", "2026-06-03"],
          ["최근 정산액", fmtKRW(8437000)],
          ["정산 상태", <Tag kind="success">지급 완료</Tag>],
          ["명세서", "다운로드 가능"],
        ]}/>
      </Card>
    </div>

    <InfoNotice
      icon={<Icons.Wallet size={20}/>}
      title="정산 계좌 변경 안내"
      desc="계좌 변경 요청 후 예금주 검증이 완료되어야 다음 정산부터 적용됩니다."
      action={<Button kind="ghost" size="sm">정산 명세서 보기</Button>}
    />
  </div>
);

window.MerchantInfo = MerchantInfo;
