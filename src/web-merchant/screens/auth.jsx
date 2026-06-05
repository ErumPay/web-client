/* Merchant auth and onboarding */

const AuthBrand = ({ compact = false }) => (
  <div className={`merchant-auth-brand ${compact ? "compact" : ""}`}>
    <img src="/assets/erumpay-ci.png" alt="ErumPay" />
  </div>
);

const AuthStepper = ({ current }) => {
  const steps = [
    ["terms", "약관동의"],
    ["info", "추가 정보 입력"],
    ["review", "심사요청"],
  ];

  return (
    <div className="merchant-stepper">
      {steps.map((step, index) => {
        const active = step[0] === current;
        const done = steps.findIndex(s => s[0] === current) > index;
        return (
          <div key={step[0]} className={`merchant-step ${active ? "active" : ""} ${done ? "done" : ""}`}>
            <span>{index + 1}</span>
            <strong>{step[1]}</strong>
          </div>
        );
      })}
    </div>
  );
};

const MerchantLogin = ({ onStart, onEnterMain }) => (
  <div className="merchant-auth-shell login">
    <div className="merchant-auth-bg">
      <AuthBrand/>
      <button className="kakao-start" onClick={onStart}>
        <span className="kakao-bubble"/>
        <strong>카카오로 시작</strong>
      </button>
      <button className="review-status-btn" onClick={onEnterMain}>
        <Icons.Right size={15}/>
        메인 바로가기
      </button>
    </div>
  </div>
);

const TermsAgreement = ({ onCancel, onNext }) => {
  const [requiredTerms, setRequiredTerms] = React.useState(false);
  const [privacy, setPrivacy] = React.useState(false);
  const [marketing, setMarketing] = React.useState(false);
  const [age, setAge] = React.useState(false);
  const canNext = requiredTerms && privacy && age;

  const toggleAll = () => {
    const next = !(requiredTerms && privacy && marketing && age);
    setRequiredTerms(next);
    setPrivacy(next);
    setMarketing(next);
    setAge(next);
  };

  return (
    <div className="merchant-auth-shell terms">
      <aside className="merchant-auth-side">
        <AuthBrand/>
        <AuthStepper current="terms"/>
      </aside>
      <main className="merchant-auth-panel">
        <div className="terms-card">
          <h1>서비스 이용약관 및 개인정보 처리방침 동의</h1>
          <p>모든 약관을 확인하신 후 동의해 주세요.</p>

          <label className="terms-all">
            <input
              type="checkbox"
              checked={requiredTerms && privacy && marketing && age}
              onChange={toggleAll}
            />
            <span>모든 약관에 동의합니다.</span>
          </label>

          <div className="terms-list">
            <TermsItem
              checked={requiredTerms}
              onChange={setRequiredTerms}
              title="[필수] 서비스 이용약관 동의"
              body="이 약관은 ErumPay가 제공하는 가맹점 정산 서비스의 이용조건, 절차 및 책임사항을 규정합니다."
            />
            <TermsItem
              checked={privacy}
              onChange={setPrivacy}
              title="[필수] 개인정보 처리방침 동의"
              body="가맹점 가입 확인, 결제 및 정산 처리, 고객 응대를 위해 필요한 개인정보를 수집하고 이용합니다."
            />
            <TermsItem
              checked={marketing}
              onChange={setMarketing}
              title="[선택] 마케팅 정보 수신 동의"
              body="새로운 소식과 혜택 정보를 받아보실 수 있습니다. 선택 동의 여부는 서비스 이용에 영향을 주지 않습니다."
              compact
            />
            <label className="terms-age">
              <input type="checkbox" checked={age} onChange={e => setAge(e.target.checked)}/>
              <span>만 14세 이상입니다.</span>
            </label>
          </div>

          <div className="merchant-auth-actions">
            <button className="btn ghost lg" onClick={onCancel}>취소</button>
            <button className="btn primary lg" disabled={!canNext} onClick={onNext}>
              다음 <Icons.Right size={15}/>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const TermsItem = ({ checked, onChange, title, body, compact }) => (
  <section className={`terms-item ${compact ? "compact" : ""}`}>
    <div className="terms-item-head">
      <label>
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}/>
        <span>{title}</span>
      </label>
      <button className="terms-detail">
        내용보기 <Icons.Right size={13}/>
      </button>
    </div>
    <div className="terms-copy">{body}</div>
  </section>
);

const SignupInfo = ({ onPrev, onSubmit }) => (
  <div className="merchant-auth-shell terms">
    <aside className="merchant-auth-side">
      <AuthBrand compact/>
      <AuthStepper current="info"/>
    </aside>
    <main className="merchant-auth-panel">
      <div className="signup-card">
        <h1>가맹점 정보를 입력해 주세요</h1>
        <p>심사를 위해 사업자와 정산 정보를 정확히 입력해 주세요.</p>

        <FormSection title="사업자 기본정보">
          <Field label="사업자 등록번호">
            <input className="input" placeholder="000-00-00000"/>
          </Field>
          <Field label="상호명">
            <input className="input" placeholder="상호명을 입력해 주세요."/>
          </Field>
          <Field label="사업장 주소">
            <input className="input" placeholder="사업장 주소를 입력해 주세요."/>
          </Field>
          <Field label="업태">
            <input className="input" placeholder="업태를 입력해 주세요."/>
          </Field>
          <Field label="종목">
            <input className="input" placeholder="종목을 입력해 주세요."/>
          </Field>
        </FormSection>

        <FormSection title="대표자 및 담당자 정보">
          <Field label="대표자명">
            <input className="input" placeholder="대표자명을 입력해 주세요."/>
          </Field>
          <Field label="대표자 휴대전화번호">
            <input className="input" placeholder="010-0000-0000"/>
          </Field>
          <Field label="담당자명">
            <input className="input" placeholder="담당자명을 입력해 주세요."/>
          </Field>
          <Field label="담당자 휴대전화번호">
            <input className="input" placeholder="010-0000-0000"/>
          </Field>
        </FormSection>

        <FormSection title="출금 계좌 정보">
          <Field label="은행">
            <Select value="shinhan" onChange={()=>{}} options={[
              {value: "shinhan", label: "신한은행"},
              {value: "kb", label: "KB국민은행"},
              {value: "hana", label: "하나은행"},
              {value: "woori", label: "우리은행"},
            ]}/>
          </Field>
          <Field label="계좌번호">
            <input className="input" placeholder="계좌번호를 입력해 주세요."/>
          </Field>
          <Field label="예금주명">
            <input className="input" placeholder="예금주명을 입력해 주세요."/>
          </Field>
        </FormSection>

        <FormSection title="가맹점 서비스 정보">
          <Field label="가맹점명">
            <input className="input" placeholder="가맹점명을 입력해 주세요."/>
          </Field>
          <Field label="업종">
            <Select value="retail" onChange={()=>{}} options={[
              {value: "retail", label: "리테일"},
              {value: "food", label: "F&B"},
              {value: "service", label: "서비스"},
            ]}/>
          </Field>
          <Field label="MCC 코드">
            <div className="row" style={{gap: 8}}>
              <input className="input" placeholder="MCC 코드를 입력해 주세요."/>
              <button className="btn secondary">코드 검색</button>
            </div>
          </Field>
        </FormSection>

        <FormSection title="첨부서류">
          <div className="upload-box">
            <Icons.Download size={18}/>
            <div>
              <strong>파일 선택</strong>
              <span>사업자등록증, 통장 사본 등 심사 서류를 첨부해 주세요.</span>
            </div>
          </div>
        </FormSection>

        <div className="merchant-auth-actions">
          <button className="btn ghost lg" onClick={onPrev}>이전</button>
          <button className="btn primary lg" onClick={onSubmit}>심사 신청하기</button>
        </div>
      </div>
    </main>
  </div>
);

const FormSection = ({ title, children }) => (
  <section className="signup-section">
    <h2>{title}</h2>
    <div className="signup-grid">{children}</div>
  </section>
);

const ReviewComplete = ({ onEnterMain }) => (
  <div className="merchant-auth-shell complete">
    <div className="merchant-auth-bg">
      <AuthBrand/>
      <div className="review-complete-copy">
        <div className="complete-icon"><Icons.Check size={44}/></div>
        <h1>심사 신청이 완료되었습니다.</h1>
        <p>PG 검토 후 승인 결과를 이메일 및 문자로 안내해 드리겠습니다.</p>
        <button className="btn primary lg" onClick={onEnterMain}>메인으로 이동</button>
      </div>
    </div>
  </div>
);

Object.assign(window, { MerchantLogin, TermsAgreement, SignupInfo, ReviewComplete });
