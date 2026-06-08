/* Merchant auth and onboarding */

const AuthBrand = () => (
  <div className="merchant-auth-brand">
    <img src="/assets/erumpay-ci.png" alt="ErumPay" />
    <span>가맹점 관리자 페이지</span>
  </div>
);

const AuthStepper = ({ current }) => {
  const steps = [
    ["terms", "약관 동의"],
    ["info", "정보 입력"],
    ["complete", "완료"],
  ];
  const currentIndex = steps.findIndex(step => step[0] === current);

  return (
    <div className="merchant-stepper">
      {steps.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        return (
          <React.Fragment key={step[0]}>
            <div className={`merchant-step ${active ? "active" : ""} ${done ? "done" : ""}`}>
              <span>{done ? <Icons.Check size={13}/> : index + 1}</span>
              <strong>{step[1]}</strong>
            </div>
            {index < steps.length - 1 && <div className={`merchant-step-line ${done ? "done" : ""}`}/>}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const MerchantLogin = ({ onStart, onEnterMain, error }) => {
  const [configError, setConfigError] = React.useState("");
  const start = (handler) => {
    setConfigError("");
    try {
      handler();
    } catch (startError) {
      setConfigError(startError.message);
    }
  };

  return (
    <div className="merchant-auth-shell">
      <div className="merchant-auth-stage login-stage">
        <AuthBrand/>
        <div className="login-card merchant-auth-card">
          <h1>간편하게 시작하세요</h1>
          <p>카카오 계정으로 빠르게 로그인하고<br/>가맹점 서비스를 이용해보세요</p>
          <button className="kakao-start" onClick={() => start(onStart)}>
            <span className="kakao-bubble"/>
            카카오로 3초만에 시작하기
          </button>

          <button className="review-status-btn" onClick={() => start(onEnterMain)}>
            <Icons.CircleCheck size={16}/>
            제출 완료하셨나요?
            <small>카카오 계정으로 로그인하시면 가맹점 심사 진행상태를 확인할 수 있습니다.</small>
          </button>

          {(error || configError) && <div className="auth-error">{error || configError}</div>}

          <ul className="login-benefits">
            <li>별도 회원가입 없이 간편 로그인</li>
            <li>안전한 카카오 계정 시스템</li>
            <li>빠른 가맹점 심사 진행</li>
          </ul>
        </div>
        <AuthSupport/>
      </div>
    </div>
  );
};

const TermsAgreement = ({ onCancel, onNext }) => {
  const [requiredTerms, setRequiredTerms] = React.useState(false);
  const [privacy, setPrivacy] = React.useState(false);
  const [marketing, setMarketing] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const canNext = requiredTerms && privacy;

  const toggleAll = () => {
    const next = !(requiredTerms && privacy && marketing);
    setRequiredTerms(next);
    setPrivacy(next);
    setMarketing(next);
  };

  return (
    <div className="merchant-auth-shell">
      <div className="merchant-auth-stage">
        <AuthBrand/>
        <AuthStepper current="terms"/>
        <main className="merchant-auth-card terms-card">
          <h1>서비스 이용약관에 동의해주세요</h1>
          <p>ErumPay 가맹점 서비스 이용을 위해 아래 약관에 동의해주세요.</p>

          <label className="terms-all">
            <input type="checkbox" checked={requiredTerms && privacy && marketing} onChange={toggleAll}/>
            <span>전체 약관에 동의합니다</span>
          </label>

          <div className="terms-list">
            <TermsItem
              checked={requiredTerms}
              onChange={setRequiredTerms}
              title="서비스 이용약관 동의"
              required
              body="회원의 권리와 의무, ErumPay가 제공하는 가맹점 정산 서비스의 이용조건과 책임사항을 확인합니다."
            />
            <TermsItem
              checked={privacy}
              onChange={setPrivacy}
              title="개인정보 수집 및 이용 동의"
              required
              body="가맹점 가입, 본인 확인, 정산 처리, 고객 응대를 위한 필수 개인정보 수집 및 이용에 동의합니다."
            />
            <TermsItem
              checked={marketing}
              onChange={setMarketing}
              title="마케팅 정보 수신 동의"
              body="이벤트, 프로모션, 서비스 업데이트 정보를 받을 수 있습니다."
            />
          </div>

          <div className="merchant-auth-actions">
            <button className="btn ghost lg" onClick={onCancel}>이전</button>
            <button
              className="btn primary lg"
              disabled={!canNext || submitting}
              onClick={async () => {
                setSubmitting(true);
                setError("");
                try {
                  await onNext({
                    serviceTermsAgreed: requiredTerms,
                    privacyPolicyAgreed: privacy,
                    marketingAgreed: marketing,
                  });
                } catch (submitError) {
                  setError(submitError.message);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {submitting ? "처리 중..." : "다음"}
            </button>
          </div>
          {error && <div className="auth-error">{error}</div>}
        </main>
      </div>
    </div>
  );
};

const TermsItem = ({ checked, onChange, title, body, required }) => (
  <section className="terms-item">
    <div className="terms-item-head">
      <label>
        <input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)}/>
        <span>{title} {required && <em>필수</em>}</span>
      </label>
      <button className="terms-detail" type="button">보기</button>
    </div>
    <div className="terms-copy">{body}</div>
  </section>
);

const SignupInfo = ({ onPrev, onSubmit }) => {
  const [form, setForm] = React.useState({
    merchantName: "",
    businessNumber: "",
    representativeName: "",
    contactPhone: "",
    contactEmail: "",
    mccCode: "",
    bankName: "",
    settlementAccount: "",
    serviceName: "",
    businessAddress: "",
    businessAddressDetail: "",
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const update = (name, value) => setForm(current => ({ ...current, [name]: value }));

  return (
    <div className="merchant-auth-shell">
      <div className="merchant-auth-stage info-stage">
        <AuthBrand/>
        <AuthStepper current="info"/>
        <main className="merchant-auth-card signup-card">
          <h1>가맹점 정보를 입력해주세요</h1>
          <p>정확한 정보를 입력해야 심사를 빠르게 진행할 수 있습니다.</p>

          <FormSection title="사업자 정보">
            <AuthInput name="merchantName" value={form.merchantName} onChange={update} label="상호명" placeholder="사업자등록증상의 상호명을 입력하세요" wide/>
            <AuthInput name="businessNumber" value={form.businessNumber} onChange={update} label="사업자등록번호" placeholder="123-45-67890"/>
            <AuthInput name="representativeName" value={form.representativeName} onChange={update} label="대표자명" placeholder="대표자 이름을 입력하세요"/>
            <AuthInput name="mccCode" value={form.mccCode} onChange={update} label="MCC 코드" placeholder="숫자 4자리"/>
            <AuthInput name="serviceName" value={form.serviceName} onChange={update} label="서비스명" placeholder="가맹점 서비스명을 입력하세요"/>
            <AuthUpload label="사업자등록증 첨부" wide/>
          </FormSection>

          <FormSection title="담당자 정보">
            <AuthInput name="contactPhone" value={form.contactPhone} onChange={update} label="연락처" placeholder="010-1234-5678"/>
            <AuthInput name="contactEmail" value={form.contactEmail} onChange={update} label="이메일" placeholder="example@email.com"/>
          </FormSection>

          <FormSection title="정산 계좌">
            <AuthInput name="bankName" value={form.bankName} onChange={update} label="은행명" placeholder="신한은행"/>
            <AuthInput name="settlementAccount" value={form.settlementAccount} onChange={update} label="계좌번호" placeholder="110-123-456789"/>
          </FormSection>

          <FormSection title="사업장 주소">
            <AuthInput name="businessAddress" value={form.businessAddress} onChange={update} label="기본 주소" placeholder="사업장 주소를 입력하세요" wide/>
            <AuthInput name="businessAddressDetail" value={form.businessAddressDetail} onChange={update} label="상세 주소" placeholder="상세 주소를 입력하세요" wide/>
          </FormSection>

          <div className="merchant-auth-actions">
            <button className="btn ghost lg" onClick={onPrev}>이전</button>
            <button
              className="btn primary lg"
              disabled={submitting}
              onClick={async () => {
                setSubmitting(true);
                setError("");
                try {
                  await onSubmit(form);
                } catch (submitError) {
                  setError(submitError.message);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {submitting ? "신청 중..." : "가입 신청"}
            </button>
          </div>
          {error && <div className="auth-error">{error}</div>}
        </main>
      </div>
    </div>
  );
};

const FormSection = ({ title, children }) => (
  <section className="signup-section">
    <h2>{title}</h2>
    <div className="signup-grid">{children}</div>
  </section>
);

const AuthInput = ({ name, value, onChange, label, placeholder, type = "text", wide }) => (
  <label className={`auth-field ${wide ? "wide" : ""}`}>
    <span>{label}<em>*</em></span>
    <input
      className="input"
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={event => onChange(name, event.target.value)}
    />
  </label>
);

const AuthUpload = ({ label, wide }) => (
  <div className={`auth-field ${wide ? "wide" : ""}`}>
    <span>{label}<em>*</em></span>
    <div className="upload-box">
      <Icons.Download size={20}/>
      <strong>클릭하여 파일 업로드</strong>
      <small>JPG, PNG, PDF 파일만 가능</small>
    </div>
  </div>
);

const ReviewComplete = ({ onEnterMain }) => (
  <div className="merchant-auth-shell">
    <div className="merchant-auth-stage complete-stage">
      <AuthBrand/>
      <div className="merchant-auth-card review-complete-copy">
        <div className="complete-icon"><Icons.Check size={32}/></div>
        <h1>심사 신청이 완료되었습니다</h1>
        <p>가맹점 심사는 영업일 기준 2~3일 소요됩니다.<br/>심사 결과는 등록하신 이메일로 안내됩니다.</p>

        <div className="complete-notice">
          <strong>안내사항</strong>
          <ul>
            <li>심사 진행 상태는 이메일로 안내됩니다.</li>
            <li>추가 서류가 필요한 경우 담당자가 연락드립니다.</li>
            <li>승인 완료 후 바로 서비스를 이용할 수 있습니다.</li>
          </ul>
        </div>

        <button className="btn primary lg" onClick={onEnterMain}>로그인 페이지로 이동</button>
        <button className="btn ghost lg">심사 신청 조회</button>
      </div>
      <AuthSupport/>
    </div>
  </div>
);

const AuthSupport = () => (
  <div className="auth-support">
    <span>문의사항이 있으신가요?</span>
    <strong>전화: 1234-5678 | 이메일: support@erumpay.com</strong>
  </div>
);

Object.assign(window, { MerchantLogin, TermsAgreement, SignupInfo, ReviewComplete });
