/* Merchant store information */

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

const getInfoDraft = (merchant, section) => {
  if (section === "business") {
    return {
      name: merchant.name,
      bizNo: merchant.bizNo,
      rep: merchant.rep,
      registrationNo: "",
      type: merchant.business.type,
      item: merchant.business.item,
      address: merchant.business.address,
    };
  }

  if (section === "settlement") {
    return {
      cycle: merchant.settlement.cycle,
      fee: String(merchant.fee),
      bank: merchant.settlement.bank,
      accountNo: merchant.settlement.accountNo,
      holder: merchant.rep,
      taxInvoice: "발행",
    };
  }

  return {
    name: merchant.store.name,
    category: merchant.category,
    address: merchant.store.address,
    addressDetail: "",
    phone: merchant.store.phone,
    email: merchant.store.email,
    hours: merchant.store.hours,
    intro: "",
  };
};

const applyInfoDraft = (merchant, section, draft) => {
  if (section === "business") {
    return {
      ...merchant,
      name: draft.name,
      bizNo: draft.bizNo,
      rep: draft.rep,
      business: {
        ...merchant.business,
        type: draft.type,
        item: draft.item,
        address: draft.address,
      },
    };
  }

  if (section === "settlement") {
    return {
      ...merchant,
      rep: draft.holder,
      fee: Number(draft.fee) || merchant.fee,
      settlement: {
        ...merchant.settlement,
        cycle: draft.cycle,
        bank: draft.bank,
        accountNo: draft.accountNo,
      },
    };
  }

  return {
    ...merchant,
    category: draft.category,
    store: {
      ...merchant.store,
      name: draft.name,
      address: [draft.address, draft.addressDetail].filter(Boolean).join(", "),
      phone: draft.phone,
      email: draft.email,
      hours: draft.hours,
    },
  };
};

const INFO_FIELDS = {
  store: [
    ["name", "가게명", "이룸페이 강남점"],
    ["category", "업종", "음식점"],
    ["address", "주소", "서울특별시 강남구 테헤란로 123", "wide"],
    ["addressDetail", "상세 주소", "456호", "wide"],
    ["phone", "연락처", "02-1234-5678"],
    ["email", "이메일", "store@erumpay.com"],
    ["hours", "운영 시간", "10:00 - 22:00"],
    ["intro", "가게 소개", "가게에 대한 간단한 소개를 입력해주세요", "wide", "textarea"],
  ],
  business: [
    ["name", "상호명", "(주)이룸페이강남"],
    ["bizNo", "사업자등록번호", "123-45-67890"],
    ["rep", "대표자명", "홍길동"],
    ["registrationNo", "사업자 등록일", "2024-05-01"],
    ["type", "업태", "도소매"],
    ["item", "종목", "음식점"],
    ["address", "사업장 소재지", "서울특별시 강남구 테헤란로 123, 456호", "wide"],
  ],
  settlement: [
    ["cycle", "정산 주기", "주 1회"],
    ["fee", "수수료율", "2.5"],
    ["bank", "정산 은행", "신한은행"],
    ["accountNo", "계좌번호", "110-123-456789"],
    ["holder", "예금주", "홍길동"],
    ["taxInvoice", "부가세 포함 여부", "발행"],
  ],
};

const InfoEditForm = ({ section, value, onChange, onCancel, onSave }) => (
  <form className="merchant-edit-card" onSubmit={onSave}>
    {section === "store" && (
      <div className="store-profile-editor">
        <div className="store-profile-placeholder"><Icons.Store size={26}/></div>
        <div>
          <strong>가게 프로필 이미지</strong>
          <span>JPG, PNG 파일을 사용할 수 있습니다.</span>
          <Button kind="ghost" size="sm" type="button">이미지 업로드</Button>
        </div>
      </div>
    )}

    <div className="merchant-edit-grid">
      {INFO_FIELDS[section].map(([key, label, placeholder, width, type]) => (
        <label key={key} className={`merchant-edit-field ${width === "wide" ? "wide" : ""}`}>
          <span>{label}<em>*</em></span>
          {type === "textarea" ? (
            <textarea
              className="input merchant-edit-textarea"
              value={value[key]}
              placeholder={placeholder}
              onChange={event => onChange(key, event.target.value)}
            />
          ) : (
            <input
              className="input"
              value={value[key]}
              placeholder={placeholder}
              onChange={event => onChange(key, event.target.value)}
            />
          )}
        </label>
      ))}
    </div>

    <div className="merchant-edit-actions">
      <Button kind="ghost" type="button" onClick={onCancel}><Icons.Close size={14}/> 취소</Button>
      <Button kind="primary" type="submit"><Icons.Check size={14}/> 저장</Button>
    </div>
  </form>
);

const MerchantInfo = ({ initialTab = "store" }) => {
  const merchant = window.MerchantApi.getMerchantProfile();
  const section = ["store", "business", "settlement"].includes(initialTab) ? initialTab : "store";
  const [editing, setEditing] = React.useState(false);
  const [saved, setSaved] = React.useState(() => getInfoDraft(merchant, section));
  const [draft, setDraft] = React.useState(() => getInfoDraft(merchant, section));
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const next = getInfoDraft(merchant, section);
    setSaved(next);
    setDraft(next);
    setEditing(false);
  }, [section]);

  const displayedMerchant = applyInfoDraft(merchant, section, saved);

  const pageMeta = {
    store: {
      title: "내 가게 정보 관리",
      desc: "가게 기본 정보와 운영 상태를 확인합니다.",
      button: "정보 수정",
    },
    business: {
      title: "내 가게 정보 관리",
      desc: "사업자 등록 정보와 제출 서류를 확인합니다.",
      button: "정보 수정",
    },
    settlement: {
      title: "내 가게 정보 관리",
      desc: "정산 계좌, 수수료율, 정산 주기를 확인합니다.",
      button: "정보 수정",
    },
  }[section];

  return (
    <div className="page merchant-info-page">
      <div className="row between">
        <div className="page-header">
          <h1 className="page-title">{pageMeta.title}</h1>
          <p className="page-desc">{pageMeta.desc}</p>
        </div>
        {!editing && (
          <Button kind="primary" onClick={() => {
            setDraft(saved);
            setEditing(true);
          }}>
            <Icons.Edit size={14}/>{pageMeta.button}
          </Button>
        )}
      </div>

      {editing ? (
        <InfoEditForm
          section={section}
          value={draft}
          onChange={(key, value) => setDraft(current => ({ ...current, [key]: value }))}
          onCancel={() => {
            setDraft(saved);
            setEditing(false);
          }}
          onSave={async (event) => {
            event.preventDefault();
            setSaving(true);
            setError("");
            try {
              const updatedMerchant = applyInfoDraft(merchant, section, draft);
              const remote = window.AuthSession?.getProfile?.();
              const session = window.AuthSession?.get?.() || {};

              if (remote && session?.merchantId) {
                await window.MerchantBackendApi.updateMerchant(session.merchantId, {
                  merchantName: section === "store" ? updatedMerchant.store.name : updatedMerchant.name,
                  ownerName: updatedMerchant.rep,
                  contactPhone: updatedMerchant.store.phone,
                  businessAddress: section === "store" ? updatedMerchant.store.address : updatedMerchant.business.address,
                  categoryName: updatedMerchant.category,
                  mccCode: remote.mccCode || updatedMerchant.mccCode || "5812",
                  feeRate: Number(updatedMerchant.fee),
                  settlementAccount: updatedMerchant.settlement.accountNo,
                });
              }

              setSaved(draft);
              setEditing(false);
            } catch (saveError) {
              setError(saveError.message);
            } finally {
              setSaving(false);
            }
          }}
        />
      ) : (
        <React.Fragment>
          {section === "store" && <StoreInfo merchant={displayedMerchant}/>}
          {section === "business" && <BusinessInfo merchant={displayedMerchant}/>}
          {section === "settlement" && <SettlementInfo merchant={displayedMerchant}/>}
        </React.Fragment>
      )}
      {saving && <div className="merchant-save-status">정보를 저장하고 있습니다.</div>}
      {error && <div className="auth-error">{error}</div>}
    </div>
  );
};

const StoreInfo = ({ merchant }) => (
  <div className="merchant-info-layout">
    <Card title="가게 기본 정보">
      <InfoGrid rows={[
        ["가게명", merchant.store.name, "MID", merchant.mid],
        ["대표 연락처", merchant.store.phone, "대표 이메일", merchant.store.email],
        ["가게 주소", merchant.store.address, "업종", merchant.category],
        ["운영 시간", merchant.store.hours, "단말기 수", `${merchant.terminals}대`],
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
          {merchant.changeLogs.map(([date, text]) => (
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
        ["대표자", merchant.rep, "업태", merchant.business.type],
        ["종목", merchant.business.item, "개업일", merchant.business.openedAt],
        ["사업장 주소", merchant.business.address, "가입일", merchant.joined],
      ]}/>
    </Card>

    <div className="grid-2">
      <Card title="사업자 등록증">
        <div className="document-card">
          <div className="document-icon"><Icons.Doc size={24}/></div>
          <div className="document-copy">
            <strong>{merchant.business.documentName}</strong>
            <span>최근 제출일 {merchant.business.documentSubmittedAt}</span>
          </div>
          <Button kind="ghost" size="sm"><Icons.Download size={14}/> 다운로드</Button>
        </div>
      </Card>

      <Card title="검증 상태">
        <InfoList rows={[
          ["사업자 검증", <Tag kind="success">검증 완료</Tag>],
          ["대표자 인증", <Tag kind="success">완료</Tag>],
          ["서류 상태", <Tag kind="success">승인</Tag>],
          ["최근 검증일", merchant.business.documentSubmittedAt],
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
        ["은행", merchant.settlement.bank, "계좌번호", merchant.settlement.accountNo],
        ["예금주", merchant.rep, "계좌 검증 상태", <Tag kind="success">검증 완료</Tag>],
        ["정산 주기", merchant.settlement.cycle, "다음 정산일", merchant.settlement.nextPayDate],
        ["수수료율", `${merchant.fee}%`, "정산 기준", merchant.settlement.basis],
      ]}/>
    </Card>

    <div className="grid-2">
      <Card title="정산 정책">
        <InfoList rows={[
          ["정산 방식", merchant.settlement.method],
          ["지급 시간", merchant.settlement.payTime],
          ["최소 정산액", fmtKRW(merchant.settlement.minAmount)],
          ["보류 기준", merchant.settlement.holdRule],
        ]}/>
      </Card>

      <Card title="최근 정산 정보">
        <InfoList rows={[
          ["최근 정산일", merchant.settlement.lastPayDate],
          ["최근 정산액", fmtKRW(merchant.settlement.lastPayAmount)],
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
