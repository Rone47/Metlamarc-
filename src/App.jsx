import { useDeferredValue, useState } from 'react'
import './App.css'

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Sectors', href: '#sectors' },
  { label: 'Contact', href: '#contact' },
]

const stats = [
  { value: '5+', label: 'technology service capabilities' },
  { value: '2', label: 'direct contact lines across regions' },
  { value: '1', label: 'partner for build, secure, and investigate' },
]

const focusWords = [
  'software engineering',
  'cybersecurity analysis',
  'penetration testing',
  'digital forensics',
  'IT consulting',
]

const tickerItems = [
  'Web Platforms',
  'Security Reviews',
  'Penetration Testing',
  'Digital Forensics',
  'IT Strategy',
  'Systems Integration',
]

const serviceLines = [
  {
    icon: 'code',
    title: 'Versatile Software Engineering',
    description:
      'Design and build web platforms, internal systems, and tailored digital tools that support growth, automation, and operational clarity.',
    bullets: [
      'Modern web application delivery',
      'Workflow automation and systems integration',
      'Maintainable, performance-minded engineering',
    ],
  },
  {
    icon: 'shield',
    title: 'Cybersecurity Analysis',
    description:
      'Assess technology environments, identify risk, and strengthen security posture with practical recommendations grounded in real business needs.',
    bullets: [
      'Security posture reviews',
      'Risk analysis and controls guidance',
      'Security-aware improvement planning',
    ],
  },
  {
    icon: 'target',
    title: 'Penetration Testing',
    description:
      'Evaluate applications, systems, and exposed assets through structured testing that helps uncover weaknesses before attackers do.',
    bullets: [
      'Web and infrastructure testing support',
      'Vulnerability validation and prioritization',
      'Actionable remediation guidance',
    ],
  },
  {
    icon: 'search',
    title: 'Digital Forensics',
    description:
      'Support investigations with disciplined evidence handling, incident reconstruction, and technical analysis that helps teams respond with confidence.',
    bullets: [
      'Incident review and evidence support',
      'Technical investigation assistance',
      'Forensics-minded reporting and follow-up',
    ],
  },
  {
    icon: 'briefcase',
    title: 'IT Consulting',
    description:
      'Guide organizations on technology decisions, architecture direction, security priorities, and modernization plans that align with business goals.',
    bullets: [
      'Technology roadmaps and advisory',
      'Infrastructure and systems guidance',
      'Modernization planning for growing teams',
    ],
  },
]

const expertiseAreas = [
  {
    title: 'Secure Software Delivery',
    text: 'From concept to launch, we focus on applications that are usable, maintainable, and built with security in mind.',
  },
  {
    title: 'Security Testing and Validation',
    text: 'We help teams move from assumptions to evidence through focused assessment, penetration testing, and clearer remediation priorities.',
  },
  {
    title: 'Incident Support and Forensics',
    text: 'When something goes wrong, we help document what happened, preserve technical clarity, and shape a measured response.',
  },
  {
    title: 'Technology Strategy',
    text: 'We connect business direction with practical technical decisions so organizations can modernize without unnecessary complexity.',
  },
]

const sectors = [
  {
    title: 'Healthcare',
    description:
      'Support secure systems, reliable infrastructure, and digital workflows where continuity and trust are non-negotiable.',
  },
  {
    title: 'Education',
    description:
      'Help institutions strengthen digital platforms, device strategy, and technology environments that support modern learning.',
  },
  {
    title: 'Telecommunications',
    description:
      'Bring security-focused thinking and technical advisory to environments where uptime, reliability, and scale matter.',
  },
  {
    title: 'Manufacturing',
    description:
      'Improve operational systems, process visibility, and technology readiness for fast-moving industrial teams.',
  },
]

const engagements = [
  {
    title: 'Application Security Review',
    label: 'Cybersecurity',
    description:
      'A focused engagement for identifying web application weaknesses, validating risk, and organizing remediation priorities for internal teams.',
  },
  {
    title: 'Digital Forensics Readiness',
    label: 'Forensics',
    description:
      'A practical track for organizations that need clearer incident evidence handling, response structure, and technical investigation support.',
  },
  {
    title: 'Platform Modernization Advisory',
    label: 'Consulting',
    description:
      'A strategy-led engagement that connects software, infrastructure, and security decisions into a coherent modernization plan.',
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
  service: 'Versatile Software Engineering',
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
            <p className="eyebrow">Software Engineering | Cybersecurity | Digital Forensics</p>
            <h1>Professional technology services for teams that need to build, secure, and modernize with confidence.</h1>
            <p className="hero-text">
              Metlamarc Investments Limited is a technology-first company focused on
              software engineering, cybersecurity analysis, penetration testing,
              digital forensics, and IT consulting. When needed, we also support
              aligned technology procurement as part of a broader delivery strategy.
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

            <article className="hero-panel hero-panel-primary">
              <span>Core Focus</span>
              <strong>Engineering, security, testing, forensics, and advisory</strong>
              <p>Technology services structured to help organizations reduce risk and move forward with clarity.</p>
            </article>

            <article className="hero-panel hero-panel-secondary">
              <span>Professional Practice</span>
              <ul>
                <li>Security-aware delivery</li>
                <li>Evidence-based assessment</li>
                <li>Business-aligned execution</li>
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
              strengthen digital resilience, and implement solutions that create
              measurable operational value. We work with a customer-first mindset,
              combining technical depth with practical business understanding.
            </p>
          </div>

          <div className="intro-grid">
            <article className="info-card">
              <h3>Mission</h3>
              <p>
                Deliver high-quality technology services that help customers succeed,
                reduce friction, and build lasting confidence in their digital systems.
              </p>
            </article>
            <article className="info-card">
              <h3>Vision</h3>
              <p>
                Be recognized for quality, innovation, security-minded thinking, and
                a consistent commitment to customer satisfaction.
              </p>
            </article>
            <article className="info-card">
              <h3>Culture</h3>
              <p>
                We lead with excellence, integrity, teamwork, and innovation so every
                engagement feels disciplined, responsive, and dependable.
              </p>
            </article>
          </div>
        </section>

        <section className="section" id="services">
          <div className="section-heading">
            <p className="eyebrow">Services</p>
            <h2>Technology services designed to solve real operational and security challenges.</h2>
            <p>
              We are presenting Metlamarc first as a technology company. The emphasis
              is on engineering, security, investigation, and advisory support that
              helps clients work more safely and effectively.
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
              <p className="eyebrow">Supporting Capability</p>
              <h3>Technology procurement remains available when it strengthens the broader solution.</h3>
            </div>
            <p>
              We still support aligned technology sourcing where needed, but our lead
              message is professional technology delivery, cybersecurity depth, and
              practical advisory value.
            </p>
          </article>
        </section>

        <section className="section" id="expertise">
          <div className="section-heading">
            <p className="eyebrow">Expertise</p>
            <h2>How Metlamarc turns technical capability into business confidence.</h2>
            <p>
              Our work is guided by quality, customer focus, innovation, integrity,
              and teamwork. We combine those values with a security-aware operating
              model that prioritizes clarity and dependable delivery.
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
              <h3>Technology is most valuable when it is secure, understandable, and aligned to real work.</h3>
              <p>
                We believe software, cybersecurity, and technical advisory services
                should not create confusion. They should reduce risk, sharpen
                decisions, and make teams more capable over time.
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
            <h2>Professional service tracks that speak directly to technology outcomes.</h2>
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
                      <span>metlamarcinvestmentslimited@gmail.com</span>
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
            Metlamarc Investments Limited delivers professional software,
            cybersecurity, penetration testing, digital forensics, and IT consulting services.
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
            <span>metlamarcinvestmentslimited@gmail.com</span>
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
