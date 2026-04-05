import { useDeferredValue, useState } from 'react'
import './App.css'

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Sectors', href: '#sectors' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

const stats = [
  { value: '8+', label: 'software and technology service lines' },
  { value: '3', label: 'delivery models from projects to retainers' },
  { value: '2', label: 'direct contact lines across Kenya and the U.S.' },
]

const focusWords = [
  'custom software development',
  'web development services',
  'mobile app development',
  'software consulting',
  'SaaS product strategy',
  'IT and cloud services',
  'AI and machine learning',
  'support and maintenance',
]

const tickerItems = [
  'Custom Business Systems',
  'Web Applications',
  'Mobile Apps',
  'Architecture Consulting',
  'SaaS Products',
  'Cloud and DevOps',
  'AI Workflows',
  'Support Retainers',
]

const serviceLines = [
  {
    icon: 'code',
    title: 'Custom Software Development',
    description:
      'Build software tailored to the way a business actually works, from operations platforms to internal tools and industry-specific solutions.',
    bullets: [
      'Business management and workflow systems',
      'Inventory, accounting, and operations tools',
      'Niche software for healthcare, logistics, and finance',
    ],
  },
  {
    icon: 'globe',
    title: 'Web Development Services',
    description:
      'Create modern websites and web applications that support sales, operations, customer engagement, and digital product delivery.',
    bullets: [
      'Corporate websites and portals',
      'E-commerce and SaaS applications',
      'Hosting, maintenance, and performance optimization',
    ],
  },
  {
    icon: 'mobile',
    title: 'Mobile App Development',
    description:
      'Design and deliver mobile products for businesses and startups that need utility apps, customer tools, or cross-platform experiences.',
    bullets: [
      'iOS, Android, and cross-platform apps',
      'Utility and workflow mobile products',
      'App support from launch to iteration',
    ],
  },
  {
    icon: 'briefcase',
    title: 'Software Consulting',
    description:
      'Advise teams on how to use technology well, improve architecture, and make better product, cloud, and performance decisions.',
    bullets: [
      'Architecture and platform design',
      'Cloud migration and modernization planning',
      'Performance and systems improvement guidance',
    ],
  },
  {
    icon: 'stack',
    title: 'SaaS Product Development',
    description:
      'Shape and build subscription software products that create recurring revenue and long-term product value.',
    bullets: [
      'Product strategy and MVP design',
      'Analytics, productivity, and automation platforms',
      'Subscription-ready product engineering',
    ],
  },
  {
    icon: 'cloud',
    title: 'IT and Cloud Services',
    description:
      'Support infrastructure, automation, and secure cloud environments for teams that want resilient operations and scalable delivery.',
    bullets: [
      'AWS, Azure, and GCP guidance',
      'DevOps automation and systems integration',
      'Cloud operations and cybersecurity support',
    ],
  },
  {
    icon: 'spark',
    title: 'AI and Machine Learning Services',
    description:
      'Design AI-enabled workflows and products for organizations that want predictive insight, automation, and smarter digital experiences.',
    bullets: [
      'Chatbots and AI assistants',
      'Predictive analytics and recommendation workflows',
      'Practical AI integration for business use cases',
    ],
  },
  {
    icon: 'support',
    title: 'Technical Support and Maintenance',
    description:
      'Stay alongside clients after launch with structured maintenance, updates, bug fixing, and ongoing optimization.',
    bullets: [
      'Bug fixes and security patching',
      'Performance monitoring and optimization',
      'Support retainers for recurring revenue and continuity',
    ],
  },
]

const expertiseAreas = [
  {
    title: 'Custom Solution Design',
    text: 'We translate business requirements into software systems that fit real operations instead of forcing teams into rigid generic tools.',
  },
  {
    title: 'Web and Mobile Product Delivery',
    text: 'From websites to cross-platform applications, we build digital products that are usable, performant, and ready for growth.',
  },
  {
    title: 'Cloud, DevOps, and Security Enablement',
    text: 'We help companies modernize infrastructure, improve reliability, and strengthen cloud operations with practical engineering support.',
  },
  {
    title: 'AI and Product Scale',
    text: 'We identify where SaaS, automation, and AI can create repeatable value and help teams turn those ideas into workable products.',
  },
]

const sectors = [
  {
    title: 'Healthcare',
    description:
      'Build secure software, digital workflows, and operational tools for environments where reliability and trust matter every day.',
  },
  {
    title: 'Logistics and Operations',
    description:
      'Design tracking systems, internal operations tools, and process automation for businesses moving goods, services, and field teams.',
  },
  {
    title: 'Finance and Professional Services',
    description:
      'Support firms that need performance-minded applications, reporting systems, secure integrations, and dependable client-facing tools.',
  },
  {
    title: 'Startups and Growing Businesses',
    description:
      'Help growing companies move from idea to MVP to supportable products with the right balance of speed, quality, and scalability.',
  },
]

const engagements = [
  {
    title: 'Business Operations Platform Build',
    label: 'Custom Software',
    description:
      'A delivery track for companies that need a tailored system for internal workflows, operations, inventory, finance, or reporting.',
  },
  {
    title: 'Web or Mobile Product Launch',
    label: 'Product Delivery',
    description:
      'A practical engagement for building customer-facing websites, SaaS MVPs, or mobile apps with room for future scale.',
  },
  {
    title: 'Cloud and AI Modernization Sprint',
    label: 'Cloud and AI',
    description:
      'A strategy-plus-implementation track for cloud setup, automation, infrastructure improvement, or AI-enabled business workflows.',
  },
  {
    title: 'Support and Optimization Retainer',
    label: 'Maintenance',
    description:
      'An ongoing support option that covers updates, bug fixes, security improvements, monitoring, and continued performance tuning.',
  },
]

const serviceSpotlights = [
  {
    label: 'Custom Builds',
    title: 'Tailored systems for teams that have outgrown off-the-shelf tools.',
    text: 'This is where custom software, web applications, and operational platforms come together to solve business-specific problems cleanly.',
    image: '/code-display.svg',
    imageClass: 'spotlight-image-large',
  },
  {
    label: 'Consulting and Delivery',
    title: 'Advisory work that turns strategy into cloud, product, and architecture momentum.',
    text: 'Software consulting, cloud planning, and delivery support help clients make stronger technical decisions before expensive mistakes compound.',
    image: '/tech-collaboration.svg',
    imageClass: 'spotlight-image-people',
  },
  {
    label: 'Recurring Revenue',
    title: 'SaaS, maintenance, and AI workflows create longer-term value beyond one-off projects.',
    text: 'The strongest software companies usually blend project delivery with repeatable products, retainers, and automation services.',
    image: '/mobile-apps.svg',
    imageClass: 'spotlight-image-mobile',
  },
]

const businessTips = [
  'Start with the strongest service you can deliver confidently right now.',
  'Look for local or niche demand where software and automation solve clear pain points.',
  'Build recurring revenue through support, SaaS, cloud management, or maintenance contracts.',
  'Scale gradually by combining project work, advisory work, and repeatable service packages.',
]

const revenueTracks = [
  {
    title: 'Project Delivery',
    text: 'Custom software, web platforms, and mobile applications are strong starting offers for direct client work.',
  },
  {
    title: 'Advisory and Consulting',
    text: 'Architecture, cloud migration, and technical planning create high-value engagements with lower delivery risk.',
  },
  {
    title: 'Recurring Growth',
    text: 'SaaS subscriptions, support retainers, cloud management, and optimization contracts help stabilize long-term income.',
  },
]

const deliverySteps = [
  {
    phase: '01',
    title: 'Discovery and Fit',
    text: 'We clarify business goals, technical needs, timelines, and the right service model before delivery starts.',
  },
  {
    phase: '02',
    title: 'Solution Design',
    text: 'We shape the product, platform, or support structure around usability, maintainability, and practical business value.',
  },
  {
    phase: '03',
    title: 'Build and Validate',
    text: 'We execute with disciplined engineering, structured review, and clear progress visibility across the engagement.',
  },
  {
    phase: '04',
    title: 'Launch and Support',
    text: 'We stay available for rollout, refinement, optimization, and recurring support where continuity matters.',
  },
]

const testimonials = [
  {
    quote:
      'Ready for a verified client testimonial covering a custom software or operations platform engagement.',
    name: 'Verified client quote',
    role: 'Software delivery reference',
  },
  {
    quote:
      'Ready for a verified client testimonial covering web, mobile, SaaS, or digital product work.',
    name: 'Verified client quote',
    role: 'Digital product reference',
  },
  {
    quote:
      'Ready for a verified client testimonial covering consulting, cloud services, AI support, or maintenance.',
    name: 'Verified client quote',
    role: 'Advisory or support reference',
  },
]

const socialChannels = [
  { icon: 'globe', title: 'Website', status: 'Opening soon', href: '#home' },
  { icon: 'x', title: 'X', status: 'Opening soon', href: '#contact' },
  { icon: 'facebook', title: 'Facebook', status: 'Opening soon', href: '#contact' },
  { icon: 'whatsapp', title: 'WhatsApp', status: 'Chat available', href: 'https://wa.me/254719174450' },
]

const legalPages = {
  'Privacy Policy': {
    title: 'Privacy Policy',
    intro:
      'Metlamarc Investments Limited respects the privacy of clients, partners, and website visitors. This policy outlines the professional standards we apply when handling personal and business information shared through our website or service engagements.',
    sections: [
      {
        heading: 'Information We Collect',
        body:
          'We may collect contact details, project requirements, organization information, service inquiries, and communications submitted through email, contact forms, or consultation discussions. We limit collection to information that supports legitimate business communication and service delivery.',
      },
      {
        heading: 'How We Use Information',
        body:
          'Information is used to respond to inquiries, prepare proposals, deliver professional services, improve communication quality, and maintain client relationships. We do not use submitted information in ways that are inconsistent with the purpose for which it was provided.',
      },
      {
        heading: 'Security and Retention',
        body:
          'We apply reasonable administrative and technical safeguards to protect business information against unauthorized access, misuse, or disclosure. Information is retained only for as long as necessary to support operations, compliance, and legitimate business records.',
      },
    ],
  },
  'Terms of Service': {
    title: 'Terms of Service',
    intro:
      'These terms govern the professional use of Metlamarc Investments Limited website content and any initial engagement initiated through the site. Formal project work is subject to separate proposals, statements of work, or signed service agreements.',
    sections: [
      {
        heading: 'Professional Scope',
        body:
          'Website content is provided for general business information and introductory service communication. No website statement alone creates a binding service obligation, warranty, or professional engagement without written confirmation.',
      },
      {
        heading: 'Client Engagements',
        body:
          'Service delivery timelines, responsibilities, deliverables, confidentiality expectations, and commercial terms are defined in project-specific agreements. Clients are expected to provide accurate information needed for sound technical assessment and delivery.',
      },
      {
        heading: 'Acceptable Use',
        body:
          'Visitors may not misuse the website, attempt unauthorized access, interfere with site availability, or use Metlamarc materials in ways that misrepresent the company, its services, or its intellectual property.',
      },
    ],
  },
  'Contact Policy': {
    title: 'Contact Policy',
    intro:
      'Metlamarc Investments Limited encourages professional inquiries related to software engineering, cybersecurity, digital forensics, penetration testing, IT consulting, and related service discussions.',
    sections: [
      {
        heading: 'Response Standards',
        body:
          'We aim to respond to serious business inquiries within a reasonable time based on availability, workload, and the completeness of the request submitted. More detailed technical discussions may require a scheduled consultation.',
      },
      {
        heading: 'Responsible Communication',
        body:
          'Contact channels should be used for legitimate business communication only. Abusive, misleading, unlawful, or irrelevant communications may be declined without response.',
      },
      {
        heading: 'Consultation Readiness',
        body:
          'For the most effective response, inquiries should include the organization name, service area of interest, key problem statement, desired outcome, and any timing or urgency considerations.',
      },
    ],
  },
}

const values = ['Quality', 'Customer focus', 'Innovation', 'Integrity', 'Teamwork']

const initialFormState = {
  name: '',
  company: '',
  email: '',
  phone: '',
  service: 'Custom Software Development',
  brief: '',
}

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
    default:
      return null
  }
}

function EmailAddress() {
  return (
    <span className="email-display">
      metlamarc<wbr />investments<wbr />limited<wbr />@gmail<wbr />.com
    </span>
  )
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formState, setFormState] = useState(initialFormState)
  const [feedback, setFeedback] = useState('')
  const [activeLegalPage, setActiveLegalPage] = useState(null)
  const deferredBrief = useDeferredValue(formState.brief)

  const inquirySummary = [
    `Contact: ${formState.name || 'Not provided yet'}`,
    `Organization: ${formState.company || 'Not provided yet'}`,
    `Email: ${formState.email || 'Not provided yet'}`,
    `Phone: ${formState.phone || 'Not provided yet'}`,
    `Service needed: ${formState.service}`,
    `Project brief: ${deferredBrief || 'Add a short project or security requirement summary.'}`,
  ].join('\n')

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setFormState((current) => ({ ...current, [name]: value }))
    setFeedback('')
  }

  const handleServiceChange = (service) => {
    setFormState((current) => ({ ...current, service }))
    setFeedback('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const subject = encodeURIComponent(
      `Metlamarc Consultation Request${formState.company ? ` - ${formState.company}` : ''}`,
    )
    const body = encodeURIComponent(inquirySummary)

    window.location.href = `mailto:metlamarcinvestmentslimited@gmail.com?subject=${subject}&body=${body}`
    setFeedback('Your email app should open with the consultation request addressed to Metlamarc.')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inquirySummary)
      setFeedback('Consultation summary copied to clipboard.')
    } catch {
      setFeedback('Clipboard access is unavailable in this browser session.')
    }
  }

  const closeMenu = () => setIsMenuOpen(false)
  const closeLegalPage = () => setActiveLegalPage(null)

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <a className="brand" href="#home" onClick={closeMenu}>
            <img className="brand-logo" src="/metlamarc-wordmark.svg" alt="Metlamarc wordmark" />
          </a>

          <button
            className="menu-toggle"
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
          </button>

          <nav className={`site-nav ${isMenuOpen ? 'is-open' : ''}`}>
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
            <a className="nav-cta" href="#contact" onClick={closeMenu}>
              Contact Us
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-copy">
            <p className="eyebrow">Custom Software | Web | Mobile | Cloud | AI</p>
            <h1>Professional software company services designed for skill, demand, and long-term scale.</h1>
            <p className="hero-text">
              Metlamarc Investments Limited is positioned as a modern software and
              technology company offering custom software development, websites and
              web apps, mobile products, consulting, SaaS delivery, cloud services,
              AI-enabled solutions, and ongoing maintenance. We build around client
              needs while keeping scalability and recurring value in view.
            </p>

            <div className="hero-motion-copy" aria-label="Active Metlamarc focus areas">
              <span className="motion-label">Active focus</span>
              <div className="word-stack">
                {focusWords.map((word, index) => (
                  <span key={word} style={{ '--word-index': index }}>
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div className="hero-actions">
              <a className="button button-primary" href="#contact">
                Start a Consultation
              </a>
              <a className="button button-secondary" href="mailto:metlamarcinvestmentslimited@gmail.com">
                Email the Team
              </a>
            </div>

            <div className="stats-grid" aria-label="Metlamarc highlights">
              {stats.map((item) => (
                <article key={item.label} className="stat-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>

            <div className="service-marquee" aria-label="Scrolling technology capabilities">
              <div className="service-marquee-track">
                {[...tickerItems, ...tickerItems].map((item, index) => (
                  <span key={`${item}-${index}`}>{item}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="signal-orb signal-orb-large" />
            <div className="signal-orb signal-orb-small" />
            <img className="hero-tech-bg" src="/circuit-grid.svg" alt="" />
            <img className="hero-monitor-art" src="/code-display.svg" alt="" />
            <img className="hero-hud-art" src="/hud-ring.svg" alt="" />
            <img className="hero-soc-art" src="/soc-screen.svg" alt="" />

            <article className="hero-panel hero-panel-primary">
              <span>Core Focus</span>
              <strong>Software products, delivery systems, cloud services, and scalable advisory</strong>
              <p>Business-ready services shaped to help companies launch, modernize, automate, and grow with clarity.</p>
            </article>

            <article className="hero-panel hero-panel-secondary">
              <span>Professional Practice</span>
              <ul>
                <li>Demand-aware service design</li>
                <li>Scalable delivery and support models</li>
                <li>Business-aligned engineering execution</li>
              </ul>
            </article>

            <article className="hero-panel hero-panel-tertiary">
              <span>Contact Ready</span>
              <strong>Kenya and U.S. phone support with direct email access</strong>
            </article>
          </div>
        </section>

        <section className="section intro-section">
          <div className="section-heading">
            <p className="eyebrow">About Metlamarc</p>
            <h2>A technology partner built on trust, precision, and professional execution.</h2>
            <p>
              Our mission is to help clients make better technology decisions,
              build software that matches real market needs, and implement services
              that can grow from immediate project work into long-term value. We
              work with a customer-first mindset, combining technical depth with
              practical business understanding.
            </p>
          </div>

          <div className="intro-grid">
            <article className="info-card">
              <h3>Mission</h3>
              <p>
                Deliver high-quality software and technology services that help customers
                succeed, reduce friction, and build lasting confidence in their digital systems.
              </p>
            </article>
            <article className="info-card">
              <h3>Vision</h3>
              <p>
                Be recognized as a dependable software company known for quality, innovation,
                scalable thinking, and consistent customer value.
              </p>
            </article>
            <article className="info-card">
              <h3>Culture</h3>
              <p>
                We lead with excellence, integrity, teamwork, and innovation so every
                engagement feels disciplined, commercially aware, and dependable.
              </p>
            </article>
            <article className="info-card intro-visual-card">
              <img className="intro-illustration" src="/tech-collaboration.svg" alt="" />
              <h3>Collaborative Delivery</h3>
              <p>
                We work closely with client teams to turn technical problems into
                clear, executable outcomes across software, security, and advisory work.
              </p>
            </article>
          </div>
        </section>

        <section className="section" id="services">
          <div className="section-heading">
            <p className="eyebrow">Services</p>
            <h2>Software company services shaped around strong skills, real demand, and scalable growth.</h2>
            <p>
              This service mix covers the strongest routes for a modern software business:
              custom development, digital product delivery, consulting, cloud services,
              AI opportunities, and recurring maintenance support.
            </p>
          </div>

          <div className="services-grid">
            {serviceLines.map((service) => (
              <article key={service.title} className="service-card">
                <div className="service-icon">
                  <Icon type={service.icon} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>
                  {service.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <article className="advantage-banner">
            <div>
              <p className="eyebrow">Business Positioning</p>
              <h3>Lead with the services you can deliver best, then expand into recurring and scalable offerings.</h3>
            </div>
            <div className="advantage-copy">
              <p>
                A strong software company usually begins with custom builds or web
                delivery, then layers in consulting, support, SaaS, cloud work, and
                automation as capability and demand keep growing.
              </p>
              <img className="advantage-art" src="/connectivity-stack.svg" alt="" />
            </div>
          </article>
        </section>

        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">Service Models</p>
            <h2>Where custom delivery, product thinking, and recurring revenue meet.</h2>
          </div>

          <div className="spotlight-grid">
            {serviceSpotlights.map((item) => (
              <article key={item.title} className="spotlight-card">
                <div className="spotlight-copy">
                  <span>{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
                <div className="spotlight-art-wrap">
                  <img className={`spotlight-art ${item.imageClass}`} src={item.image} alt="" />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="expertise">
          <div className="section-heading">
            <p className="eyebrow">Expertise</p>
            <h2>How Metlamarc turns software capability into business confidence.</h2>
            <p>
              Our work is guided by quality, customer focus, innovation, integrity,
              and teamwork. We combine those values with a delivery model that values
              clarity, market fit, technical quality, and long-term maintainability.
            </p>
          </div>

          <div className="expertise-grid">
            {expertiseAreas.map((item) => (
              <article key={item.title} className="info-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <div className="principles-layout">
            <article className="belief-card">
              <p className="eyebrow">What We Believe</p>
              <h3>Technology is most valuable when it solves real problems, fits demand, and can scale over time.</h3>
              <p>
                We believe software services should not only be technically sound.
                They should also reflect what clients actually need now, what they will
                pay for, and what can evolve into longer-term recurring value.
              </p>
            </article>

            <article className="info-card">
              <h3>Core Values</h3>
              <ul className="value-list">
                {values.map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="section" id="sectors">
          <div className="section-heading">
            <p className="eyebrow">Sectors</p>
            <h2>Technology and security support for organizations operating in demanding environments.</h2>
            <p>
              We align our delivery with the realities of regulated, distributed, and
              performance-sensitive organizations across multiple sectors.
            </p>
          </div>

          <div className="sector-grid">
            {sectors.map((sector) => (
              <article key={sector.title} className="industry-card">
                <h3>{sector.title}</h3>
                <p>{sector.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">Engagement Examples</p>
            <h2>Practical software company offers that are realistic to sell and deliver.</h2>
          </div>

          <div className="engagement-grid">
            {engagements.map((item) => (
              <article key={item.title} className="project-card">
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">Business Focus</p>
            <h2>Choose offers that balance skill, demand, and scalability from the start.</h2>
            <p>
              If you are building a small software company, the smartest path is usually
              to begin with what you can deliver strongly, then add advisory, maintenance,
              cloud, SaaS, or AI services as the business matures.
            </p>
          </div>

          <div className="business-grid">
            <article className="business-card">
              <p className="eyebrow">Recurring Revenue Paths</p>
              <h3>Build a company model that does not rely only on one-off projects.</h3>
              <div className="revenue-track-list">
                {revenueTracks.map((track) => (
                  <div key={track.title} className="revenue-track">
                    <strong>{track.title}</strong>
                    <p>{track.text}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="business-card business-card-visual">
              <img className="business-art" src="/ai-workflow.svg" alt="" />
              <p className="eyebrow">Decision Tips</p>
              <h3>Good service selection starts with honest capability and clear demand.</h3>
              <ul className="tip-list">
                {businessTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <p className="eyebrow">Company Approach</p>
            <h2>A company site should show not only what you offer, but how you deliver.</h2>
            <p>
              Metlamarc is presented as a professional software company with a clear
              engagement path, from discovery and architecture through build, launch,
              and ongoing support.
            </p>
          </div>

          <div className="delivery-grid">
            {deliverySteps.map((step) => (
              <article key={step.phase} className="delivery-card">
                <span>{step.phase}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section testimonials-section" id="testimonials">
          <div className="section-heading">
            <p className="eyebrow">Testimonials</p>
            <h2>Professional presentation with room for verified client trust signals.</h2>
            <p>
              This section is structured for real testimonials so the company site
              stays credible. As client approvals come in, these cards can be updated
              with named quotes, organizations, and case-study references.
            </p>
          </div>

          <div className="testimonial-layout">
            <article className="testimonial-feature">
              <img className="testimonial-art" src="/tech-collaboration.svg" alt="" />
              <div>
                <p className="eyebrow">Client Confidence</p>
                <h3>Built to support future case studies, references, and public proof of delivery.</h3>
                <p>
                  Until verified testimonials are published, the site now has a proper
                  trust section that looks complete and professional without inventing
                  claims that have not yet been approved for public use.
                </p>
              </div>
            </article>

            <div className="testimonial-grid">
              {testimonials.map((item) => (
                <article key={item.role} className="testimonial-card">
                  <p className="testimonial-quote">"{item.quote}"</p>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="section-heading">
            <p className="eyebrow">Contact</p>
            <h2>Start a technology conversation with Metlamarc.</h2>
            <p>
              Use the direct contacts below or prepare a consultation summary that can
              be copied and sent immediately.
            </p>
          </div>

          <div className="contact-layout">
            <aside className="contact-stack">
              <article className="summary-panel">
                <p className="eyebrow">Direct Contacts</p>
                <h3>Reach the company directly</h3>
                <div className="contact-list">
                  <a className="contact-item" href="mailto:metlamarcinvestmentslimited@gmail.com">
                    <Icon type="mail" />
                    <div>
                      <strong>Email</strong>
                      <EmailAddress />
                    </div>
                  </a>
                  <a className="contact-item" href="tel:+254719174450">
                    <Icon type="phone" />
                    <div>
                      <strong>Kenya</strong>
                      <span>+254 719 174 450</span>
                    </div>
                  </a>
                  <a className="contact-item" href="tel:+12533864512">
                    <Icon type="phone" />
                    <div>
                      <strong>U.S.</strong>
                      <span>+1 (253) 386-4512</span>
                    </div>
                  </a>
                </div>
              </article>

              <article className="summary-panel">
                <p className="eyebrow">Social Presence</p>
                <h3>Channels opening soon</h3>
                <div className="social-grid">
                  {socialChannels.map((channel) => (
                    <div key={channel.title} className="social-card">
                      <Icon type={channel.icon} />
                      <div>
                        <strong>{channel.title}</strong>
                        <span>{channel.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </aside>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="track-selector" role="group" aria-label="Choose a service line">
                {serviceLines.map((service) => (
                  <button
                    key={service.title}
                    className={`track-chip ${formState.service === service.title ? 'is-active' : ''}`}
                    type="button"
                    onClick={() => handleServiceChange(service.title)}
                  >
                    {service.title}
                  </button>
                ))}
              </div>

              <div className="field-grid">
                <label>
                  Full Name
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formState.name}
                    onChange={handleFieldChange}
                  />
                </label>
                <label>
                  Organization
                  <input
                    name="company"
                    type="text"
                    placeholder="Company or institution"
                    value={formState.company}
                    onChange={handleFieldChange}
                  />
                </label>
                <label>
                  Email
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formState.email}
                    onChange={handleFieldChange}
                  />
                </label>
                <label>
                  Phone
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+254 or +1 contact number"
                    value={formState.phone}
                    onChange={handleFieldChange}
                  />
                </label>
                <label className="field-span">
                  Project Brief
                  <textarea
                    name="brief"
                    rows="6"
                    placeholder="Tell us what you need help with, what systems are involved, and what outcome you want."
                    value={formState.brief}
                    onChange={handleFieldChange}
                  />
                </label>
              </div>

              <div className="form-actions">
                <button className="button button-primary" type="submit">
                  Prepare Summary
                </button>
                <button className="button button-secondary" type="button" onClick={handleCopy}>
                  Copy Summary
                </button>
              </div>

              {feedback ? <p className="form-feedback">{feedback}</p> : null}

              <article className="live-summary">
                <p className="eyebrow">Consultation Snapshot</p>
                <h3>Structured message for quick follow-up</h3>
                <pre>{inquirySummary}</pre>
              </article>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <img className="footer-logo" src="/metlamarc-wordmark.svg" alt="Metlamarc wordmark" />
          <h3>Metlamarc Investments Limited</h3>
          <p>
            Metlamarc Investments Limited delivers custom software, web and mobile
            development, SaaS, cloud, AI, consulting, and maintenance services for
            organizations that want dependable digital growth.
          </p>
          <div className="footer-socials">
            {socialChannels.map((channel) => (
              <a
                key={channel.title}
                className="footer-social"
                href={channel.href}
                target={channel.href.startsWith('http') ? '_blank' : undefined}
                rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
                aria-label={`${channel.title} ${channel.status}`}
              >
                <Icon type={channel.icon} />
              </a>
            ))}
          </div>
          <a className="footer-top-link" href="#home">
            Back to top
          </a>
        </div>

        <div className="footer-panel">
          <p className="footer-label">Site Map</p>
          <div className="footer-links">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-panel">
          <p className="footer-label">Contact</p>
          <a className="footer-email-link" href="mailto:metlamarcinvestmentslimited@gmail.com">
            <Icon type="mail" />
            <EmailAddress />
          </a>
          <a href="tel:+254719174450">
            <Icon type="phone" />
            <span>+254 719 174 450</span>
          </a>
          <a href="tel:+12533864512">
            <Icon type="phone" />
            <span>+1 (253) 386-4512</span>
          </a>
          <a href="https://wa.me/254719174450" target="_blank" rel="noreferrer">
            <Icon type="whatsapp" />
            <span>WhatsApp Kenya</span>
          </a>
          <a href="https://wa.me/12533864512" target="_blank" rel="noreferrer">
            <Icon type="whatsapp" />
            <span>WhatsApp U.S.</span>
          </a>
        </div>

        <div className="footer-panel">
          <p className="footer-label">Legal</p>
          <div className="footer-links">
            {Object.keys(legalPages).map((item) => (
              <button key={item} type="button" className="footer-legal-button" onClick={() => setActiveLegalPage(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <span>Copyright © 2026 Metlamarc Investments Limited. All Rights Reserved.</span>
        </div>
      </footer>

      {activeLegalPage ? (
        <div className="legal-overlay" role="dialog" aria-modal="true" aria-labelledby="legal-title">
          <div className="legal-modal">
            <div className="legal-modal-header">
              <div>
                <p className="eyebrow">Legal</p>
                <h2 id="legal-title">{legalPages[activeLegalPage].title}</h2>
              </div>
              <button type="button" className="legal-close" onClick={closeLegalPage} aria-label="Close legal page">
                Close
              </button>
            </div>

            <p className="legal-intro">{legalPages[activeLegalPage].intro}</p>

            <div className="legal-sections">
              {legalPages[activeLegalPage].sections.map((section) => (
                <article key={section.heading} className="legal-section-card">
                  <h3>{section.heading}</h3>
                  <p>{section.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
