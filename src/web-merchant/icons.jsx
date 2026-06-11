/* Inline SVG icons – stroke 1.6, currentColor */

const I = ({ d, size = 18, fill = "none", stroke = "currentColor", sw = 1.6, children, vb = 24 }) => (
  <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} fill={fill} stroke={stroke}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d}/> : children}
  </svg>
);

const Icons = {
  Menu:    (p) => <I {...p}><path d="M4 6h16M4 12h16M4 18h16"/></I>,
  Bell:    (p) => <I {...p}><path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 18a2 2 0 0 0 4 0"/></I>,
  Dashboard:(p) => <I {...p}><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></I>,
  Store:   (p) => <I {...p}><path d="M3 9 4.5 4h15L21 9"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/></I>,
  Card:    (p) => <I {...p}><rect x="2.5" y="6" width="19" height="13" rx="2"/><path d="M2.5 10h19"/><path d="M6 15h4"/></I>,
  Doc:     (p) => <I {...p}><path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5Z"/><path d="M14 3.5V8h4"/><path d="M9 12h6M9 15h6M9 18h4"/></I>,
  Calc:    (p) => <I {...p}><rect x="4" y="2.5" width="16" height="19" rx="2"/><rect x="7" y="5.5" width="10" height="4" rx="1"/><path d="M7.5 13.5h.01M12 13.5h.01M16.5 13.5h.01M7.5 17.5h.01M12 17.5h.01M16.5 17.5h.01"/></I>,
  Gift:    (p) => <I {...p}><rect x="3" y="8" width="18" height="13" rx="1.5"/><path d="M3 12h18M12 8v13"/><path d="M12 8s-3-5-5-3 2 3 5 3Zm0 0s3-5 5-3-2 3-5 3Z"/></I>,
  Speaker: (p) => <I {...p}><path d="M3 10v4h4l5 4V6L7 10H3Z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M19 6a8 8 0 0 1 0 12"/></I>,
  Shield:  (p) => <I {...p}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></I>,
  Users:   (p) => <I {...p}><circle cx="9" cy="8" r="3.5"/><path d="M2.5 19c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15 14h.5c2.5 0 4.5 2 4.5 4.5"/></I>,
  Logout:  (p) => <I {...p}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5"/><path d="M5 12h11"/></I>,
  Search:  (p) => <I {...p}><circle cx="11" cy="11" r="6"/><path d="m20 20-3.5-3.5"/></I>,
  Calendar:(p) => <I {...p}><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></I>,
  Download:(p) => <I {...p}><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></I>,
  Up:      (p) => <I {...p}><path d="m7 14 5-5 5 5"/></I>,
  Down:    (p) => <I {...p}><path d="m7 10 5 5 5-5"/></I>,
  Right:   (p) => <I {...p}><path d="m10 7 5 5-5 5"/></I>,
  Left:    (p) => <I {...p}><path d="m14 7-5 5 5 5"/></I>,
  Close:   (p) => <I {...p}><path d="M6 6 18 18M18 6 6 18"/></I>,
  Filter:  (p) => <I {...p}><path d="M4 5h16l-6 8v6l-4-2v-4L4 5Z"/></I>,
  Check:   (p) => <I {...p}><path d="m5 12 4 4 10-10"/></I>,
  Plus:    (p) => <I {...p}><path d="M12 5v14M5 12h14"/></I>,
  Dot:     (p) => <I {...p}><circle cx="12" cy="12" r="2" fill="currentColor"/></I>,
  CircleCheck:(p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-5"/></I>,
  CircleX: (p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/></I>,
  Warning: (p) => <I {...p}><path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v5M12 18v.01"/></I>,
  Won:     (p) => <I {...p} sw={1.4}><path d="M5 6 8 16h2l2-7 2 7h2l3-10M4 11h16M4 14h16"/></I>,
  Wallet:  (p) => <I {...p}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 14h2"/></I>,
  Eye:     (p) => <I {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></I>,
  Edit:    (p) => <I {...p}><path d="M4 20h4l10-10-4-4L4 16v4Z"/><path d="m13 7 4 4"/></I>,
  Trash:   (p) => <I {...p}><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13"/></I>,
  Lock:    (p) => <I {...p}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></I>,
  Logo:    (p) => <I {...p}><path d="M5 5h14v14H5z" stroke="none" fill="#fff" opacity="0"/><path d="M7 7h10M7 12h7M7 17h10" stroke="#fff" strokeWidth="2"/></I>,
};

window.Icons = Icons;
