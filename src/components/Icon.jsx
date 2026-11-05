function Icon({ type }) {
  const commonProps = {
    className: 'icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  }

  switch (type) {
    case 'code':
      return (
        <svg {...commonProps}>
          <path d="M8 8 4 12l4 4" />
          <path d="m16 8 4 4-4 4" />
          <path d="m13 5-2 14" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...commonProps}>
          <path d="M12 3 5 6v5c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
          <path d="m9.5 12 1.7 1.7L15 10" />
        </svg>
      )
    case 'target':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      )
    case 'search':
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="6" />
          <path d="m20 20-4.2-4.2" />
          <path d="M11 8v3l2 2" />
        </svg>
      )
    case 'briefcase':
      return (
        <svg {...commonProps}>
          <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
          <path d="M4 9h16v8.5A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5Z" />
          <path d="M4 11a32.8 32.8 0 0 0 16 0" />
        </svg>
      )
    case 'mobile':
      return (
        <svg {...commonProps}>
          <rect x="7" y="3.5" width="10" height="17" rx="2.4" />
          <path d="M10 6h4" />
          <circle cx="12" cy="17" r=".7" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'stack':
      return (
        <svg {...commonProps}>
          <path d="m12 4 7 4-7 4-7-4 7-4Z" />
          <path d="m5 12 7 4 7-4" />
          <path d="m5 16 7 4 7-4" />
        </svg>
      )
    case 'cloud':
      return (
        <svg {...commonProps}>
          <path d="M8.5 18H17a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.8 1.2A3.8 3.8 0 0 0 8.5 18Z" />
          <path d="M12 10.5v6" />
          <path d="m9.8 14.2 2.2 2.3 2.2-2.3" />
        </svg>
      )
    case 'spark':
      return (
        <svg {...commonProps}>
          <path d="m12 3 1.8 4.8L19 9.6l-4 2.8 1.5 5-4.5-3-4.5 3 1.5-5-4-2.8 5.2-1.8L12 3Z" />
        </svg>
      )
    case 'support':
      return (
        <svg {...commonProps}>
          <path d="m14.8 5.2 4 4" />
          <path d="m16.6 3.4 2 2a1.8 1.8 0 0 1 0 2.6l-6.3 6.3a3 3 0 0 1-1.6.8l-3.3.5.5-3.3a3 3 0 0 1 .8-1.6l6.3-6.3a1.8 1.8 0 0 1 2.6 0Z" />
          <path d="M5 19h14" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      )
    case 'phone':
      return (
        <svg {...commonProps}>
          <path d="M7.2 4.8c.5-.5 1.2-.7 1.9-.5l2 1c.8.4 1.1 1.4.7 2.2l-.9 1.7a13.8 13.8 0 0 0 4 4l1.7-.9c.8-.4 1.8-.1 2.2.7l1 2c.3.7.1 1.4-.5 1.9l-1.4 1.4c-.7.7-1.8 1-2.7.7A18.7 18.7 0 0 1 5.1 8.9c-.3-.9 0-2 .7-2.7l1.4-1.4Z" />
        </svg>
      )
    case 'globe':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14.6 14.6 0 0 1 0 18" />
          <path d="M12 3a14.6 14.6 0 0 0 0 18" />
        </svg>
      )
    case 'x':
      return (
        <svg {...commonProps}>
          <path d="M5 5h3l8 14h-3Z" />
          <path d="M16 5h3l-5.5 6.4" />
          <path d="M8.5 13.2 5 19h3l2.3-3.8" />
        </svg>
      )
    case 'facebook':
      return (
        <svg {...commonProps}>
          <path d="M14.5 8H17V4.5h-2.5A4.5 4.5 0 0 0 10 9v2H7v3.5h3V20h3.5v-5.5H16L16.5 11h-3V9c0-.6.4-1 1-1Z" />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg {...commonProps}>
          <path d="M20 11.5A8.5 8.5 0 0 1 7.4 19l-3.4 1 1.1-3.2A8.5 8.5 0 1 1 20 11.5Z" />
          <path d="M9 8.8c.2-.4.5-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4 0 .6l-.5.8c.4.9 1.1 1.7 2 2.2l.8-.4c.2-.1.4-.1.6 0l1.5.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.4.8-.4.3-1 .5-1.7.4-3-.3-5.9-3.1-6.2-6.1-.1-.6.1-1.2.4-1.6Z" />
        </svg>
      )
    case 'lock':
      return (
        <svg {...commonProps}>
          <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
          <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
        </svg>
      )
    case 'dashboard':
      return (
        <svg {...commonProps}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
          <rect x="13.5" y="3.5" width="7" height="4.5" rx="1.4" />
          <rect x="13.5" y="10.5" width="7" height="10" rx="1.4" />
          <rect x="3.5" y="13" width="7" height="7.5" rx="1.4" />
        </svg>
      )
    case 'alert':
      return (
        <svg {...commonProps}>
          <path d="M12 3 2 20h20L12 3Z" />
          <path d="M12 10v4" />
          <circle cx="12" cy="17" r=".6" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'check':
      return (
        <svg {...commonProps}>
          <path d="m5 12 5 5L20 7" />
        </svg>
      )
    case 'invoice':
      return (
        <svg {...commonProps}>
          <path d="M7 3.5h10a1 1 0 0 1 1 1V21l-2.5-1.5L13 21l-2-1.5L9 21l-2.5-1.5L4.5 21V8L7 3.5Z" />
          <path d="M8 9h8M8 12.5h8M8 16h5" />
        </svg>
      )
    case 'users':
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3.5 19c.6-3.4 3-5.2 5.5-5.2s4.9 1.8 5.5 5.2" />
          <circle cx="17" cy="8.5" r="2.4" />
          <path d="M15.5 13.9c2 .3 3.7 1.9 4.2 4.9" />
        </svg>
      )
    case 'folder':
      return (
        <svg {...commonProps}>
          <path d="M4 6.5a1.5 1.5 0 0 1 1.5-1.5h4l2 2.2h7a1.5 1.5 0 0 1 1.5 1.5v9.3a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5Z" />
        </svg>
      )
    case 'gauge':
      return (
        <svg {...commonProps}>
          <path d="M4 15a8 8 0 1 1 16 0" />
          <path d="M12 15 15.5 9" />
          <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'stamp':
      return (
        <svg {...commonProps}>
          <rect x="6" y="9" width="12" height="7" rx="1.2" />
          <path d="M9 9V6.5a3 3 0 0 1 6 0V9" />
          <path d="M4.5 19.5h15" />
        </svg>
      )
    case 'printer':
      return (
        <svg {...commonProps}>
          <path d="M7 8.5V4h10v4.5" />
          <rect x="4.5" y="8.5" width="15" height="7" rx="1.3" />
          <path d="M7 14.5h10V20H7Z" />
        </svg>
      )
    case 'tag':
      return (
        <svg {...commonProps}>
          <path d="M11.5 3.5h6a1 1 0 0 1 1 1v6a1.5 1.5 0 0 1-.44 1.06l-7.5 7.5a1.5 1.5 0 0 1-2.12 0l-5.5-5.5a1.5 1.5 0 0 1 0-2.12l7.5-7.5a1.5 1.5 0 0 1 1.06-.44Z" />
          <circle cx="15.5" cy="7.5" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'percent':
      return (
        <svg {...commonProps}>
          <path d="M6 18 18 6" />
          <circle cx="7.5" cy="7.5" r="2.2" />
          <circle cx="16.5" cy="16.5" r="2.2" />
        </svg>
      )
    default:
      return null
  }
}

export default Icon
