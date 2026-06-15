
export  type IconKey =
  | "dashboard"
  | "analytics"
  | "transactions"
  | "invoices"
  | "recurring"
  | "subscriptions"
  | "feedback"
  | "settings"
  | "helpdesk"
  | "logout"
  | "logo"
  | "search"
  | "help"
  | "mail"
  | "bell"
  | "chevronRight"
  | "chevronDown"
  | "arrowLeft"
  | "arrowRight"
  | "share"
  | "reset"
  | "expand"
  | "media";

const icons: Record<IconKey, () => React.ReactElement> = {
  logo: () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect width="22" height="22" rx="6" fill="#22C55E" />
      <path
        d="M6 11C6 8.239 8.239 6 11 6s5 2.239 5 5-2.239 5-5 5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="11" cy="11" r="2" fill="white" />
    </svg>
  ),
  media: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image-icon lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
  ),
  search: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="#9CA3AF" strokeWidth="1.5" />
      <path d="M9.5 9.5L12 12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  dashboard: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  analytics: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 13L6 8l3 3 4-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="8" r="1.5" fill="currentColor" />
      <circle cx="9" cy="11" r="1.5" fill="currentColor" />
    </svg>
  ),
  transactions: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 6h14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 10h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  invoices: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M9 1H3a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V6L9 1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 1v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M5 9h6M5 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  recurring: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13 8A5 5 0 113 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M13 5v3h-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="2" fill="currentColor" />
    </svg>
  ),
  subscriptions: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.5 8l2 2 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  feedback: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2 13c0-2.21 2.686-4 6-4s6 1.79 6 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M11 4l1-2M13 5l2-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  settings: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  helpdesk: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6 6.5a2 2 0 113 1.732L8 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
    </svg>
  ),
  logout: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M10 2h3a1 1 0 011 1v10a1 1 0 01-1 1h-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 11l3-3-3-3M10 8H2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  help: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="#6B7280" strokeWidth="1.5" />
      <path
        d="M6 6.5a2 2 0 113 1.732L8 9.5"
        stroke="#6B7280"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11.5" r="0.75" fill="#6B7280" />
    </svg>
  ),
  mail: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1.5" y="3.5" width="15" height="11" rx="2" stroke="#6B7280" strokeWidth="1.5" />
      <path
        d="M1.5 6l7.5 5 7.5-5"
        stroke="#6B7280"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  bell: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 2a5.5 5.5 0 00-5.5 5.5c0 3-1.5 4-1.5 4h14s-1.5-1-1.5-4A5.5 5.5 0 009 2z"
        stroke="#6B7280"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10.5 14.5a1.5 1.5 0 01-3 0" stroke="#6B7280" strokeWidth="1.5" />
    </svg>
  ),
  chevronRight: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M4.5 2.5L8 6l-3.5 3.5"
        stroke="#9CA3AF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  chevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3 5l4 4 4-4"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  arrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M10 3L5 8l5 5"
        stroke="#9CA3AF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  arrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6 3l5 5-5 5"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  share: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="12" cy="4" r="2" stroke="white" strokeWidth="1.5" />
      <circle cx="4" cy="8" r="2" stroke="white" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" stroke="white" strokeWidth="1.5" />
      <path d="M6 7l4-2M6 9l4 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  reset: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M12 7A5 5 0 112 7" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M12 4v3H9"
        stroke="#6B7280"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  expand: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 5V3h2M14 5V3h-2M2 11v2h2M14 11v2h-2"
        stroke="#6B7280"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};


export default icons;
