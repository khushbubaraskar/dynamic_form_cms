import { useStore } from '../../hooks/useStore';

const SvgIcon = ({ children, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export default function AdminDashboard() {
  const { state } = useStore();

  const totalFields = state.forms.reduce((sum, f) => sum + f.fields.length, 0);

  const stats = [
    {
      icon: (
        <SvgIcon>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </SvgIcon>
      ),
      value: state.images.length,
      label: 'Images',
      color: 'blue',
    },
    {
      icon: (
        <SvgIcon>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M16 13H8M16 17H8M10 9H8" />
        </SvgIcon>
      ),
      value: state.forms.length,
      label: 'Forms',
      color: 'emerald',
    },
    {
      icon: (
        <SvgIcon>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </SvgIcon>
      ),
      value: state.links.length,
      label: 'Links',
      color: 'amber',
    },
    {
      icon: (
        <SvgIcon>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </SvgIcon>
      ),
      value: state.popups.filter((p) => p.enabled).length,
      label: 'Active Popups',
      color: 'purple',
    },
  ];

  return (
    <div>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className={`stat-icon-wrap ${s.color}`}>
              {s.icon}
            </div>
            <div className="stat-body">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3>Overview</h3>
        </div>
        <div className="card-body">
          <p style={{ color: 'var(--clr-text-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 1.8 }}>
            Manage your public-facing website content from this dashboard.
          </p>
          <ul style={{ margin: '16px 0', paddingLeft: 20, color: 'var(--clr-text-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 2 }}>
            <li><strong>Images</strong> — Upload and manage website images ({state.images.length} configured)</li>
            <li><strong>Forms</strong> — Create and configure dynamic forms ({state.forms.length} forms, {totalFields} fields total)</li>
            <li><strong>Links</strong> — Map URL paths to forms ({state.links.length} links configured)</li>
            <li><strong>Popup Settings</strong> — Configure scroll-triggered popup forms ({state.popups.filter(p => p.enabled).length} active)</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Forms</h3>
        </div>
        <div className="card-body">
          {state.forms.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
              </div>
              <p>No forms created yet. Go to Forms to create your first form.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Form Name</th>
                    <th>Fields</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {state.forms.slice(0, 5).map((form) => (
                    <tr key={form.id}>
                      <td style={{ fontWeight: 500 }}>{form.name}</td>
                      <td>
                        <span className="badge badge-default">{form.fields.length} fields</span>
                      </td>
                      <td style={{ color: 'var(--clr-text-secondary)' }}>
                        {new Date(form.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
