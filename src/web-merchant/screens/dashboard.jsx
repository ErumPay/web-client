/* Merchant dashboard */

const DashboardMetric = ({ label, value, icon, tone, footer, delta }) => {
  const Ico = Icons[icon];
  return (
    <div className="dashboard-metric">
      <div className="dashboard-metric-label">
        <span className={`dashboard-metric-icon ${tone}`}><Ico size={17}/></span>
        <span>{label}</span>
      </div>
      <strong className={tone === "mint" ? "t-main" : ""}>{value}</strong>
      <div className="dashboard-metric-footer">
        <span>{footer}</span>
        {delta && <b>{delta}</b>}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const months = [
    ["01월", 15],
    ["02월", 16.7],
    ["03월", 19.1],
    ["04월", 18],
    ["05월", 20.4],
    ["06월", 21.8],
  ];

  return (
    <div className="page merchant-dashboard">
      <h1 className="page-title">대시보드</h1>

      <section>
        <h2 className="dashboard-section-title">오늘의 매출</h2>
        <div className="dashboard-metrics">
          <DashboardMetric label="총 매출" value="₩3,920,000" icon="Up" tone="teal" footer="전일 대비" delta="+5.2%"/>
          <DashboardMetric label="결제 건수" value="392건" icon="Card" tone="cyan" footer="전일 대비" delta="+8건"/>
          <DashboardMetric label="취소/환불" value="14건" icon="CircleX" tone="red" footer="취소 10건 / 환불 4건"/>
          <DashboardMetric label="순 매출" value="₩3,875,000" icon="CircleCheck" tone="mint" footer="취소/환불 제외"/>
        </div>
      </section>

      <section>
        <h2 className="dashboard-section-title">운영 상태</h2>
        <div className="operation-status">
          <div><span className="operation-icon green"><Icons.Store size={24}/></span><p>영업 상태<strong>영업 중</strong></p></div>
          <div><span className="operation-icon teal"><Icons.CircleCheck size={24}/></span><p>거래 상태<strong>정상</strong></p></div>
          <div><span className="operation-icon gray"><Icons.Warning size={24}/></span><p>제한 상태<strong>없음</strong></p></div>
        </div>
      </section>

      <section>
        <h2 className="dashboard-section-title">이상 거래 감지</h2>
        <div className="dashboard-alerts">
          <div className="dashboard-alert danger"><Icons.Warning size={18}/><p><strong>승인 실패율 증가</strong><span>실패율 2.5% (평균 1.2%)</span></p></div>
          <div className="dashboard-alert danger"><Icons.Warning size={18}/><p><strong>비정상 취소율 감지</strong><span>취소율 3.1% (평균 0.8%)</span></p></div>
          <div className="dashboard-alert warning"><Icons.Warning size={18}/><p><strong>고액 거래 감지</strong><span>1건 500,000원 이상 거래 발생</span></p></div>
        </div>
      </section>

      <section>
        <h2 className="dashboard-section-title">월별 매출 추이</h2>
        <div className="monthly-chart-card">
          <div className="chart-y-axis"><span>22M</span><span>17M</span><span>11M</span><span>6M</span><span>0M</span></div>
          <div className="monthly-bars">
            {months.map(([label, value]) => (
              <div key={label} className="monthly-bar-column">
                <div className="monthly-bar" style={{height: `${(value / 22) * 100}%`}}/>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend"><i/>총매출</div>
        </div>
      </section>
    </div>
  );
};

Object.assign(window, { Dashboard, DashboardMetric });
