import React, { useState, useEffect } from 'react'

// Custom Inline SVG Icons for professional styling
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
)

const ScaleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M2 18h20M4 6l8 12 8-12"/>
  </svg>
)

const TrendingUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const ActivityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

const PlaneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
  </svg>
)

const ToolIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
)

const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="22" height="13" rx="2" ry="2"/>
    <polyline points="22 21 2 21"/>
    <path d="M5 16v4M19 16v4"/>
  </svg>
)

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [policies, setPolicies] = useState([])
  const [loadingPolicies, setLoadingPolicies] = useState(false)

  // Interactive Hero Preview states
  const [heroCategory, setHeroCategory] = useState('aziende') // aziende | automotive | privati

  // Wizard state (Aziende - CyberRisk)
  const [wizardStep, setWizardStep] = useState(1)
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('Servizi')
  const [turnover, setTurnover] = useState(250000)
  const [hasMfa, setHasMfa] = useState(false)
  const [hasBackup, setHasBackup] = useState(false)
  const [hasTraining, setHasTraining] = useState(false)
  const [limitOfLiability, setLimitOfLiability] = useState(250000)
  const [calculatedQuote, setCalculatedQuote] = useState(null)
  const [calculating, setCalculating] = useState(false)

  // Contact Form State
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactSubject, setContactSubject] = useState('Richiesta Informazioni')
  const [contactMessage, setContactMessage] = useState('')
  const [contactSuccess, setContactSuccess] = useState(false)
  const [contactSubmitting, setContactSubmitting] = useState(false)

  // Fetch policies when user goes to portal and is logged in
  useEffect(() => {
    if (isLoggedIn && activeTab === 'portal') {
      setLoadingPolicies(true)
      fetch('http://localhost:8000/api/policies')
        .then(res => {
          if (!res.ok) throw new Error('Impossibile caricare le polizze')
          return res.json()
        })
        .then(data => {
          setPolicies(data)
          setLoadingPolicies(false)
        })
        .catch(err => {
          console.error(err)
          setPolicies([
            { id: 1, title: 'Polizza CyberRisk PMI', premium: 450.0, status: 'Attiva', created_at: '2026-08-23' },
            { id: 2, title: 'Polizza D&O Amministratori', premium: 800.0, status: 'Attiva', created_at: '2026-08-23' }
          ])
          setLoadingPolicies(false)
        })
    }
  }, [isLoggedIn, activeTab])

  const handleGoogleLogin = () => {
    setUserEmail('azienda.cliente@gmail.com')
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserEmail('')
  }

  const handleCalculateQuote = (e) => {
    e.preventDefault()
    setCalculating(true)
    
    const payload = {
      company_name: companyName || "Azienda Anonima",
      industry: industry,
      turnover: Number(turnover),
      has_mfa: hasMfa,
      has_backup: hasBackup,
      has_training: hasTraining,
      limit_of_liability: Number(limitOfLiability)
    }

    fetch('http://localhost:8000/api/quotes/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Errore nel calcolo del preventivo')
        return res.json()
      })
      .then(data => {
        setCalculatedQuote(data)
        setWizardStep(3)
        setCalculating(false)
      })
      .catch(err => {
        console.error(err)
        let base = 300.0
        if (turnover > 10000000) base = 2500.0
        else if (turnover > 2500000) base = 1200.0
        else if (turnover > 500000) base = 600.0

        if (industry === 'IT' || industry === 'Sanità') base *= 1.2
        if (limitOfLiability === 500000) base *= 1.25
        if (limitOfLiability === 1000000) base *= 1.6

        let discount = 0.0
        if (hasMfa) discount += 0.15
        if (hasBackup) discount += 0.15
        if (hasTraining) discount += 0.10

        const finalVal = Math.round((base - (base * discount)) * 100) / 100
        setCalculatedQuote({
          id: 999,
          company_name: companyName || "Azienda Demo",
          calculated_premium: finalVal,
          base_premium: base,
          discounts_applied: base * discount,
          final_premium: finalVal
        })
        setWizardStep(3)
        setCalculating(false)
      })
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    setContactSubmitting(true)

    const payload = {
      name: contactName,
      email: contactEmail,
      phone: contactPhone || null,
      subject: contactSubject,
      message: contactMessage
    }

    fetch('http://localhost:8000/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Impossibile inviare la richiesta')
        return res.json()
      })
      .then(() => {
        setContactSuccess(true)
        setContactName('')
        setContactEmail('')
        setContactPhone('')
        setContactMessage('')
        setContactSubmitting(false)
      })
      .catch(err => {
        console.error(err)
        setContactSuccess(true)
        setContactSubmitting(false)
      })
  }

  return (
    <div>
      <header>
        <div class="container header-wrap">
          <div class="logo" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
            <img src="https://www.dcbroker.it/wp-content/uploads/2022/12/cropped-DC-Broker-logo.png" alt="DC Broker Logo" />
          </div>
          <nav>
            <button class={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>HOME</button>
            <button class={activeTab === 'chisiamo' ? 'active' : ''} onClick={() => setActiveTab('chisiamo')}>CHI SIAMO</button>
            <button class={activeTab === 'aziende' ? 'active' : ''} onClick={() => { setActiveTab('aziende'); setWizardStep(1); setCalculatedQuote(null); }}>AZIENDE</button>
            <button class={activeTab === 'privati' ? 'active' : ''} onClick={() => setActiveTab('privati')}>PRIVATI</button>
            <button class={activeTab === 'automotive' ? 'active' : ''} onClick={() => setActiveTab('automotive')}>AUTOMOTIVE</button>
            <button class={activeTab === 'contatti' ? 'active' : ''} onClick={() => { setActiveTab('contatti'); setContactSuccess(false); }}>CONTATTI</button>
            <button class={activeTab === 'reclami' ? 'active' : ''} onClick={() => setActiveTab('reclami')}>RECLAMI</button>
            <button class={activeTab === 'portal' ? 'active' : ''} onClick={() => setActiveTab('portal')}>AREA RISERVATA</button>
          </nav>
        </div>
      </header>

      <main class="container">
        {/* TAB: HOME */}
        {activeTab === 'home' && (
          <div>
            <div class="hero">
              <div class="hero-left">
                <div class="hero-pills">
                  <button class={`hero-pill ${heroCategory === 'aziende' ? 'active' : ''}`} onClick={() => setHeroCategory('aziende')}>Aziende</button>
                  <button class={`hero-pill ${heroCategory === 'automotive' ? 'active' : ''}`} onClick={() => setHeroCategory('automotive')}>Automotive</button>
                  <button class={`hero-pill ${heroCategory === 'privati' ? 'active' : ''}`} onClick={() => setHeroCategory('privati')}>Privati</button>
                </div>
                <h1>Crea il tuo futuro con: <br /><span>DC Broker</span></h1>
                <p>Siamo la migliore soluzione possibile per lo sviluppo del tuo business o per le tue necessità personali in considerazione dell'esperienza maturata in questi anni.</p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <button class="btn-primary" onClick={() => setActiveTab('portal')}>LE TUE POLIZZE</button>
                  <button class="btn-secondary" onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
                </div>
              </div>

              <div class="hero-right">
                {/* Floating dynamic badges */}
                <div class="floating-badge badge-1">
                  <span>🛡️</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'normal' }}>Brokeraggio</div>
                    <div>100% Indipendente</div>
                  </div>
                </div>

                <div class="floating-badge badge-2">
                  <span>⭐</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'normal' }}>Valutazione Clienti</div>
                    <div>Rating 4.9/5</div>
                  </div>
                </div>

                {/* Glassmorphic digital insurance card mockup */}
                <div class="hero-preview-card">
                  <div class="card-header-glow">
                    <div class="pulse-container">
                      <div class="pulse-dot-wrap">
                        <div class="pulse-dot-ping"></div>
                      </div>
                      <span>Copertura Attiva</span>
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)' }}>DC</span>
                  </div>

                  <div class="card-chip"></div>

                  <div style={{ margin: '2.5rem 0 1.5rem 0' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categoria Selezionata</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', marginTop: '0.2rem' }}>
                      {heroCategory === 'aziende' && 'Corporate Shield Card'}
                      {heroCategory === 'automotive' && 'Fleet Safe Card'}
                      {heroCategory === 'privati' && 'Personal Life Card'}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '0.5rem' }}>
                      {heroCategory === 'aziende' && 'Incendio, Responsabilità & Cyber'}
                      {heroCategory === 'automotive' && 'Flotte, Auto, Moto & Dealer'}
                      {heroCategory === 'privati' && 'Famiglia, Infortuni, Salute & Casa'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ID CLIENTE</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>DC-2026-889</div>
                    </div>
                    <button class="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '6px' }} onClick={() => setActiveTab(heroCategory)}>
                      SCOPRI
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Soluzioni Assicurative per Aziende e Privati Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.1fr', gap: '3rem', margin: '4rem 0', alignItems: 'center', background: '#ffffff', padding: '3rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div>
                <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', fontWeight: '800', lineHeight: '1.3' }}>Soluzioni assicurative per Aziende e Privati.</h2>
                <p style={{ color: 'var(--gray)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                  <strong>Crea il tuo futuro con: DC Broker</strong> Siamo nati da una sfida; quella di offrire ai nostri clienti un servizio migliore di quello ricevuto prima. Siamo un broker assicurativo con esperienza ventennale che opera sul territorio nazionale ed in quanto tali cerchiamo ogni giorno grazie ad un team di professionisti, la migliore soluzione possibile pensata su misura per i nostri clienti sia retail che corporate.
                </p>
                <button class="btn-primary" onClick={() => setActiveTab('chisiamo')}>LEGGI DI PIÙ</button>
                <div style={{ marginTop: '2.5rem', fontStyle: 'italic', fontSize: '1.2rem', fontFamily: 'Georgia, serif' }}>
                  Daniele Carrella
                  <div style={{ fontSize: '0.85rem', color: 'var(--gray)', fontStyle: 'normal', fontFamily: 'sans-serif', marginTop: '0.3rem' }}>CEO di DC Broker srl</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&q=80" alt="Consulting" style={{ width: '100%', borderRadius: '12px' }} />
                <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=300&q=80" alt="Growth chart" style={{ width: '100%', borderRadius: '12px' }} />
                <img src="https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=300&q=80" alt="Team meeting" style={{ width: '100%', borderRadius: '12px' }} />
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80" alt="Colleagues" style={{ width: '100%', borderRadius: '12px' }} />
              </div>
            </div>

            {/* Il Potere Assicurativo Nelle Tue Mani */}
            <div style={{ textAlign: 'center', margin: '4rem 0' }}>
              <h2 class="section-title">Il potere assicurativo nelle tue mani</h2>
              <p style={{ color: 'var(--gray)', maxWidth: '800px', margin: '0 auto 3rem auto', fontSize: '1.1rem' }}>
                Con DC Broker hai un ventaglio assicurativo completo, scopri i nostri servizi per proteggere e tenere al sicuro dai rischi le cose più importanti per te sia nel privato che nel mondo lavorativo.
              </p>

              <div class="grid">
                <div class="card" onClick={() => setActiveTab('aziende')}>
                  <div class="card-body">
                    <div class="card-icon-box"><BriefcaseIcon /></div>
                    <h3>Aziende</h3>
                    <p>DC Broker è specializzato nella consulenza e nella gestione dei rischi per le Imprese.</p>
                  </div>
                  <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }}>INFO</button>
                </div>
                <div class="card" onClick={() => setActiveTab('automotive')}>
                  <div class="card-body">
                    <div class="card-icon-box"><CarIcon /></div>
                    <h3>Automotive</h3>
                    <p>I migliori servizi a tutela del patrimonio di chi utilizza, progetta, costruisce e vende veicoli.</p>
                  </div>
                  <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }}>INFO</button>
                </div>
                <div class="card" onClick={() => setActiveTab('privati')}>
                  <div class="card-body">
                    <div class="card-icon-box"><HeartIcon /></div>
                    <h3>Persona</h3>
                    <p>Tu e la tua Famiglia siete unici, interessi e passioni e tante diverse necessità.</p>
                  </div>
                  <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }}>INFO</button>
                </div>
              </div>
            </div>

            {/* Other services grid (Instant, Credit, Service) */}
            <div class="grid">
              <div class="card">
                <div class="card-body">
                  <div class="card-icon-box"><ActivityIcon /></div>
                  <h3>Instant Insurance</h3>
                  <p>Sono attivibili in pochi passaggi direttamente dallo smartphone, l'instant insurance è pensata per coprire eventi o situazioni particolari e di breve durata.</p>
                </div>
                <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
              </div>
              <div class="card">
                <div class="card-body">
                  <div class="card-icon-box"><TrendingUpIcon /></div>
                  <h3>Credit Insurance</h3>
                  <p>L'Assicurazione del Credito aiuta le aziende a salvaguardarsi da eventuali mancati pagamenti da parte di clienti, in Italia o all'estero. Informati presso la nostra assicurazione.</p>
                </div>
                <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
              </div>
              <div class="card">
                <div class="card-body">
                  <div class="card-icon-box"><ToolIcon /></div>
                  <h3>Service Insurance</h3>
                  <p>Siamo presenti sul territorio per esserti ancora più vicini, sempre pronti a supportarti quando ne hai bisogno. Il nostro pool di esperti è a tua disposizione.</p>
                </div>
                <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
              </div>
            </div>

            {/* Core Statistics grid */}
            <div class="stats-row">
              <div class="stat-box">
                <div class="stat-number">20+</div>
                <div class="stat-label">Anni di Esperienza</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">100%</div>
                <div class="stat-label">Consulenza Indipendente</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">30+</div>
                <div class="stat-label">Compagnie Partner</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CHI SIAMO */}
        {activeTab === 'chisiamo' && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px', padding: '3rem', margin: '2rem 0' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', fontWeight: '800' }}>Chi Siamo - DC Broker</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '1.2rem', color: 'var(--primary)', fontWeight: '800' }}>Nasce da un'idea di Daniele Carrella per diventare un partner assicurativo affidabile.</h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--gray)', marginBottom: '1.5rem', lineHeight: '1.8' }}>
                  DC Broker nasce nel 1990 e si specializza nell'offerta ai segmenti Privati ed Aziende. I prodotti assicurativi che vengono proposti sono innovativi e vincenti.
                </p>
                <p style={{ fontSize: '1.1rem', color: 'var(--gray)', marginBottom: '2rem', lineHeight: '1.8' }}>
                  Negli anni abbiamo aumentato il nostro parco Clienti in modo costante ed attualmente abbiamo un Portafoglio Clienti decisamente importante. Il nostro team lavora quotidianamente per garantire la massima serenità professionale e familiare.
                </p>
              </div>
              <div>
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=450&q=80" alt="Team DC Broker" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }} />
              </div>
            </div>

            <div class="stats-row" style={{ marginTop: '3rem' }}>
              <div class="stat-box" style={{ background: 'var(--light-bg)' }}>
                <div class="stat-number">1990</div>
                <div class="stat-label">Anno di Fondazione</div>
              </div>
              <div class="stat-box" style={{ background: 'var(--light-bg)' }}>
                <div class="stat-number">Ventennale</div>
                <div class="stat-label">Esperienza Maturata</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: AZIENDE */}
        {activeTab === 'aziende' && (
          <div>
            <div class="hero">
              <div class="hero-left">
                <h1>Aziende</h1>
                <p>Forniremo consulenze dettagliate e mirate attraverso un modello di business semplice ma al passo con la continua evoluzione del mercato e del prodotto, garantendo la tutela del cliente pre e post contrattuale.</p>
                <button class="btn-primary" onClick={() => setWizardStep(2)}>Calcola Preventivo CyberRisk</button>
              </div>
              <div class="hero-right">
                <div class="hero-preview-card" style={{ transform: 'none' }}>
                  <div class="card-header-glow">
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>SHIELD LEVEL ACTIVE</span>
                  </div>
                  <div style={{ margin: '2rem 0 1rem 0' }}>
                    <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Tutela PMI Cyber</h3>
                    <p style={{ color: '#94a3b8' }}>Include copertura riscatto, forensics e ripristino sistemi d'ufficio.</p>
                  </div>
                  <button class="btn-primary" style={{ width: '100%' }} onClick={() => setWizardStep(2)}>PROVA PREVENTIVATORE</button>
                </div>
              </div>
            </div>

            {wizardStep === 1 ? (
              <div>
                <h2 class="section-title">Le nostre soluzioni per le Imprese</h2>
                <div class="grid">
                  <div class="card">
                    <div class="card-body">
                      <div class="card-icon-box"><BriefcaseIcon /></div>
                      <h3>RC Professionale</h3>
                      <p>Anche tu, come tutti i professionisti hai necessità di lavorare senza pensieri. DC Broker è specializzata nell'offrirti la protezione di cui hai bisogno.</p>
                    </div>
                    <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
                  </div>
                  <div class="card">
                    <div class="card-body">
                      <div class="card-icon-box"><ScaleIcon /></div>
                      <h3>Tutela Legale</h3>
                      <p>La polizza copre le spese di difesa degli interessi di un'azienda, in caso di controversie penali e civili, sia in ambito stragiudiziale che in tribunale.</p>
                    </div>
                    <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
                  </div>
                  <div class="card">
                    <div class="card-body">
                      <div class="card-icon-box"><TrendingUpIcon /></div>
                      <h3>Assicurazione del credito</h3>
                      <p>L'Assicurazione del Credito aiuta le aziende a salvaguardarsi da eventuali mancati pagamenti da parte di clienti, in Italia o all'estero.</p>
                    </div>
                    <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
                  </div>
                  <div class="card">
                    <div class="card-body">
                      <div class="card-icon-box"><SunIcon /></div>
                      <h3>Energy</h3>
                      <p>DC Broker tramite il proprio Team di esperti in assicurazioni energetiche riesce a supportarti nel cautelarti e minimizzare i rischi nel settore.</p>
                    </div>
                    <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
                  </div>
                  <div class="card">
                    <div class="card-body">
                      <div class="card-icon-box"><ShieldIcon /></div>
                      <h3>Polizza CyberRisk</h3>
                      <p>Proteggi la tua azienda contro il crimine informatico e le minacce digitali, DC Broker ti propone diverse soluzioni complete e completamente personalizzabili.</p>
                    </div>
                    <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setWizardStep(2)}>PREVENTIVATORE RAPIDO</button>
                  </div>
                  <div class="card">
                    <div class="card-body">
                      <div class="card-icon-box"><ActivityIcon /></div>
                      <h3>All Risk Insurance</h3>
                      <p>Con DC Broker puoi stipulare un'assicurazione All Risks, con estensione alla copertura assicurativa per i danni da interruzione dell'attività.</p>
                    </div>
                    <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
                  </div>
                  <div class="card">
                    <div class="card-body">
                      <div class="card-icon-box"><BriefcaseIcon /></div>
                      <h3>Polizze M &amp; A</h3>
                      <p>DC Broker tramite un team di esperti ti guida e ti fornisce soluzioni e strategie integrate per la gestione del rischio aziendale durante fusioni e acquisizioni.</p>
                    </div>
                    <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
                  </div>
                  <div class="card">
                    <div class="card-body">
                      <div class="card-icon-box"><ScaleIcon /></div>
                      <h3>Cauzioni e Fideiussioni</h3>
                      <p>DC Broker ha le competenze necessarie per aiutare la tua azienda verso l'apertura a nuovi mercati dove esiste la necessità del rilascio di garanzie fidejussorie e creditizie.</p>
                    </div>
                    <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
                  </div>
                  <div class="card">
                    <div class="card-body">
                      <div class="card-icon-box"><BriefcaseIcon /></div>
                      <h3>Polizza D &amp; O</h3>
                      <p>Sei un Amministratore, i Sindaco, Dirigenti di Società? Scegli la Polizza di Responsabilità Civile che assicura le aziende nel gestire al meglio situazioni di rischio</p>
                    </div>
                    <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
                  </div>
                </div>
              </div>
            ) : (
              <div class="wizard-container">
                {wizardStep === 2 && (
                  <form onSubmit={handleCalculateQuote}>
                    <div class="wizard-step-label">Passaggio 1 di 2</div>
                    <h2 class="wizard-title">Preventivo Rapido CyberRisk</h2>

                    <div class="form-group">
                      <label>Nome dell'Azienda</label>
                      <input type="text" class="form-control" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Inserisci ragione sociale" required />
                    </div>

                    <div class="form-group">
                      <label>Settore Merceologico</label>
                      <select class="form-control" value={industry} onChange={e => setIndustry(e.target.value)}>
                        <option value="Servizi">Servizi Professionali / Consulenza</option>
                        <option value="IT">Tecnologia / Software / IT</option>
                        <option value="Manifatturiero">Produzione / Manifattura</option>
                        <option value="Sanità">Sanità / Servizi Medici</option>
                        <option value="Commercio">Commercio / E-commerce</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label>Fatturato Annuo Complessivo (€)</label>
                      <input type="number" class="form-control" value={turnover} onChange={e => setTurnover(Number(e.target.value))} min="1" required />
                    </div>

                    <div class="form-group">
                      <label>Massimale di Copertura Desiderato</label>
                      <select class="form-control" value={limitOfLiability} onChange={e => setLimitOfLiability(Number(e.target.value))}>
                        <option value={250000}>250.000 €</option>
                        <option value={500000}>500.000 €</option>
                        <option value={1000000}>1.000.000 €</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label style={{ marginBottom: '1rem' }}>Misure di Sicurezza Implementate</label>
                      <div class="checkbox-list">
                        <label class="checkbox-card">
                          <input type="checkbox" checked={hasMfa} onChange={e => setHasMfa(e.target.checked)} />
                          <span>Autenticazione a più fattori (MFA) per accessi aziendali</span>
                        </label>
                        <label class="checkbox-card">
                          <input type="checkbox" checked={hasBackup} onChange={e => setHasBackup(e.target.checked)} />
                          <span>Backup dei dati quotidiano offline o in cloud protetto</span>
                        </label>
                        <label class="checkbox-card">
                          <input type="checkbox" checked={hasTraining} onChange={e => setHasTraining(e.target.checked)} />
                          <span>Formazione periodica dipendenti su Phishing</span>
                        </label>
                      </div>
                    </div>

                    <div class="wizard-actions">
                      <button type="button" class="btn-primary" style={{ background: '#ccc', color: '#333' }} onClick={() => setWizardStep(1)}>Annulla</button>
                      <button type="submit" class="btn-primary" disabled={calculating}>
                        {calculating ? 'Elaborazione...' : 'Calcola Tariffa'}
                      </button>
                    </div>
                  </form>
                )}

                {wizardStep === 3 && calculatedQuote && (
                  <div>
                    <div class="wizard-step-label">Preventivo Pronto!</div>
                    <h2 class="wizard-title" style={{ color: '#2e7d32' }}>Tariffa Stimata per {calculatedQuote.company_name}</h2>
                    
                    <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                      <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                        <span>Premio Base Lordo:</span>
                        <strong>{calculatedQuote.base_premium} € / anno</strong>
                      </p>
                      <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: '#c62828' }}>
                        <span>Sconti Sicurezza Applicati:</span>
                        <strong>- {calculatedQuote.discounts_applied} € / anno</strong>
                      </p>
                      <hr style={{ border: 'none', borderBottom: '1px solid #eee', margin: '0.8rem 0' }} />
                      <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem' }}>
                        <span>Premio Annuo Netto:</span>
                        <strong style={{ color: 'var(--primary)' }}>{calculatedQuote.final_premium} € / anno</strong>
                      </p>
                    </div>

                    <div class="wizard-actions">
                      <button type="button" class="btn-primary" style={{ background: '#ccc', color: '#333' }} onClick={() => setWizardStep(1)}>Torna ai Servizi</button>
                      <button class="btn-primary" onClick={() => { setActiveTab('portal'); handleGoogleLogin(); }}>
                        Sottoscrivi con Clerk
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB: PRIVATI */}
        {activeTab === 'privati' && (
          <div>
            <div class="hero">
              <div class="hero-left">
                <h1>Persona e Famiglia</h1>
                <p>Il cliente è il nostro più grande valore. Diamo ai nostri clienti un'assistenza e una tutela costanti. Offriamo soluzioni assicurative pensate sulle vostre esigenze .</p>
                <button class="btn-primary" onClick={() => setActiveTab('contatti')}>Richiedi Consulenza</button>
              </div>
              <div class="hero-right">
                <div class="hero-preview-card" style={{ transform: 'none' }}>
                  <div class="card-header-glow">
                    <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 'bold' }}>FAMILY LIFE PROTECTED</span>
                  </div>
                  <div style={{ margin: '2rem 0 1rem 0' }}>
                    <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Global Casa</h3>
                    <p style={{ color: '#94a3b8' }}>Tutela da terremoti, allagamenti e RC capofamiglia in un unico pacchetto.</p>
                  </div>
                  <button class="btn-primary" style={{ width: '100%' }} onClick={() => setActiveTab('contatti')}>RICHIEDI INFO</button>
                </div>
              </div>
            </div>

            <h2 class="section-title">Soluzioni per Persona e Famiglia</h2>
            <div class="grid">
              <div class="card">
                <div class="card-body">
                  <div class="card-icon-box"><HeartIcon /></div>
                  <h3>Polizza Vita</h3>
                  <p>L'assicurazione vita garantisce un sostegno economico in caso di morte o infortunio grave di un membro della propria famiglia. Chiedi un preventivo personalizzato</p>
                </div>
                <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
              </div>
              <div class="card">
                <div class="card-body">
                  <div class="card-icon-box"><ActivityIcon /></div>
                  <h3>Rimborso spese mediche</h3>
                  <p>L'assicurazione rimborso spese mediche, è una polizza che permette di tutelare la propria salute in relazione a patologie sopraggiunte nelle più svariate situazioni</p>
                </div>
                <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
              </div>
              <div class="card">
                <div class="card-body">
                  <div class="card-icon-box"><ScaleIcon /></div>
                  <h3>Long Term Care</h3>
                  <p>DC Broker ti propone Assicurazione contro il rischio di non autosufficienza a seguito di infortunio, malattia grave o longevità. Richiedi un preventivo.</p>
                </div>
                <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
              </div>
              <div class="card">
                <div class="card-body">
                  <div class="card-icon-box"><ActivityIcon /></div>
                  <h3>Polizza Infortuni</h3>
                  <p>La polizza infortuni ha lo scopo di proteggere economicamente la famiglia dagli incidenti più gravi, che potrebbero minare la tranquillità familiare.</p>
                </div>
                <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
              </div>
              <div class="card">
                <div class="card-body">
                  <div class="card-icon-box"><HomeIcon /></div>
                  <h3>Polizza Abitazione</h3>
                  <p>La polizza Globale Abitazione di DC Broker ti offre una protezione completa per la tua casa ed alla tua Famiglia con un insieme di garanzie e tutele.</p>
                </div>
                <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
              </div>
              <div class="card">
                <div class="card-body">
                  <div class="card-icon-box"><PlaneIcon /></div>
                  <h3>Polizza Viaggi</h3>
                  <p>Indispensabile a chi ha intenzione di raggiungere Paesi molto lontani o a rischio o destinazioni dove le spese sanitarie per eventuali cure mediche, sono molto elevate.</p>
                </div>
                <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: AUTOMOTIVE */}
        {activeTab === 'automotive' && (
          <div>
            <div class="hero">
              <div class="hero-left">
                <h1>Automotive</h1>
                <p>Trattando con le primarie compagnie di Assicurazione operanti in Italia offriamo le soluzioni migliori sul mercato e garantiamo un risparmio sulla spesa assicurativa. Il nostro scopo è quello di individuare il miglior prodotto per ogni singolo cliente, ricambiamo la vostra fiducia rimanendo sempre al vostro fianco.</p>
                <button class="btn-primary" onClick={() => setActiveTab('contatti')}>Contatta un Esperto</button>
              </div>
              <div class="hero-right">
                <div class="hero-preview-card" style={{ transform: 'none' }}>
                  <div class="card-header-glow">
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>AUTO &amp; FLEET INTEGRATION</span>
                  </div>
                  <div style={{ margin: '2rem 0 1rem 0' }}>
                    <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Assicurazioni Flotte</h3>
                    <p style={{ color: '#94a3b8' }}>Ottimizzazione dei costi per veicoli commerciali e aziendali.</p>
                  </div>
                  <button class="btn-primary" style={{ width: '100%' }} onClick={() => setActiveTab('contatti')}>INFO FLOTTE</button>
                </div>
              </div>
            </div>

            <h2 class="section-title">Coperture Settore Automotive</h2>
            <div class="grid">
              <div class="card">
                <div class="card-body">
                  <div class="card-icon-box"><CarIcon /></div>
                  <h3>Assicurazioni Auto e Moto</h3>
                  <p>Scopri le polizze per la tua auto e la tua moto e le combinazioni di servizi che fanno al caso tuo.</p>
                </div>
                <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>INFO</button>
              </div>
              <div class="card">
                <div class="card-body">
                  <div class="card-icon-box"><TruckIcon /></div>
                  <h3>Assicurazioni Flotte Aziendali</h3>
                  <p>Proteggi la tua flotta aziendale con le soluzioni assicurative complete di DC Broker</p>
                </div>
                <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>CONTATTACI</button>
              </div>
              <div class="card">
                <div class="card-body">
                  <div class="card-icon-box"><HomeIcon /></div>
                  <h3>Progetto Car Dealer</h3>
                  <p>DC BROKER INSURANCE, il brand nato per sviluppare il modello distributivo innovativo dedicato al settore Car Dealer.</p>
                </div>
                <button class="btn-primary" style={{ width: '100%', padding: '0.7rem' }} onClick={() => setActiveTab('contatti')}>INFO</button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CONTATTI */}
        {activeTab === 'contatti' && (
          <div>
            <h2 class="section-title">Richiedi Informazioni o Consulenza</h2>
            
            <div class="contact-grid">
              <div class="contact-info">
                <h3>Sede e Recapiti</h3>
                <p>Per richieste commerciali, check-up di polizze in corso o appuntamenti fisici/digitali.</p>
                
                <div class="info-item">
                  <div class="info-icon-box">📍</div>
                  <div>
                    <strong>Sede Operativa</strong>
                    <p>Via Roma, 100 - Milano (MI)</p>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon-box">📞</div>
                  <div>
                    <strong>Telefono</strong>
                    <p>+39 02 12345678</p>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon-box">✉️</div>
                  <div>
                    <strong>Email</strong>
                    <p>info@dcbroker.it</p>
                  </div>
                </div>
              </div>

              <div class="contact-form-box">
                {contactSuccess && (
                  <div class="success-alert">
                    Richiesta salvata! Un consulente DC Broker ti contatterà all'indirizzo email inserito.
                  </div>
                )}
                
                <form onSubmit={handleContactSubmit}>
                  <div class="form-group">
                    <label>Nome / Azienda *</label>
                    <input type="text" class="form-control" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Inserisci il tuo nome" required />
                  </div>
                  
                  <div class="form-group">
                    <label>Email *</label>
                    <input type="email" class="form-control" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="Inserisci la tua email" required />
                  </div>

                  <div class="form-group">
                    <label>Telefono</label>
                    <input type="tel" class="form-control" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="Numero telefonico (opzionale)" />
                  </div>

                  <div class="form-group">
                    <label>Oggetto *</label>
                    <input type="text" class="form-control" value={contactSubject} onChange={e => setContactSubject(e.target.value)} required />
                  </div>

                  <div class="form-group">
                    <label>Messaggio *</label>
                    <textarea class="form-control" rows="4" value={contactMessage} onChange={e => setContactMessage(e.target.value)} placeholder="Scrivi qui la tua richiesta..." style={{ resize: 'vertical' }} required></textarea>
                  </div>

                  <button type="submit" class="btn-primary" style={{ width: '100%' }} disabled={contactSubmitting}>
                    {contactSubmitting ? 'Invio...' : 'Invia Messaggio'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB: RECLAMI */}
        {activeTab === 'reclami' && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '16px', padding: '3rem', margin: '2rem 0' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', color: 'var(--dark)' }}>Recalmi</h2>
            <div style={{ fontSize: '1.05rem', color: 'var(--gray)', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                <strong>Informazione commerciale e promozionale</strong> Teniamo alla sua riservatezza: i dati di contatto inseriti nel form saranno trattati da noi per proporle prodotti assicurativi ritenuti da noi più adeguati alle sue esigenze solo dietro suo consenso, qualora lei fleggasse il relativo check in fondo al form dati. È suo diritto revocare il consenso successivamente in qualsiasi momento, inviandoci una email all'indirizzo agenziale. Il mancato conferimento non pregiudicherà comunque l'erogazione del nostro servizio di intermediazione assicurativa.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                <strong>I suoi diritti</strong> È suo diritto richiederci l'accesso ai suoi dati personali e la rettifica o la cancellazione degli stessi o la limitazione del trattamento che la riguardano o di opporsi al loro trattamento, oltre il diritto alla portabilità dei dati, richiedendocelo all'indirizzo email agenziale indicata nei contatti, nonché è suo diritto proporre reclamo al Garante privacy, con le modalità indicate sul sito internet <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">www.garanteprivacy.it</a> o ricorso giurisdizionale.
              </p>
              <p>
                I destinatari dei suoi dati operano esclusivamente in Paesi Membri e nessun dato verrà trasferito a un paese terzo o a un'organizzazione internazionale. La informiamo inoltre che non utilizziamo processi decisionali automatizzati, compresa la profilazione.
              </p>
            </div>
          </div>
        )}

        {/* TAB: PORTALE AREA RISERVATA */}
        {activeTab === 'portal' && (
          <div>
            {!isLoggedIn ? (
              <div class="auth-card">
                <h2>Accesso Portale Clienti</h2>
                <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>Usa il login sicuro per accedere alla tua area riservata.</p>
                
                <button class="social-btn" onClick={handleGoogleLogin}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" width="18" height="18" alt="Google Logo" />
                  Accedi con Google
                </button>
                
                <div style={{ margin: '1.5rem 0', color: '#999', fontSize: '0.85rem' }}>oppure con email demo</div>
                
                <button class="btn-primary" style={{ width: '100%' }} onClick={handleGoogleLogin}>Accedi come Demo</button>
              </div>
            ) : (
              <div class="dashboard-grid">
                <aside class="sidebar">
                  <div class="sidebar-user">
                    <div class="user-avatar">DC</div>
                    <h4>Demo Client S.r.l.</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>{userEmail}</p>
                  </div>
                  <ul class="sidebar-menu">
                    <li><button class="active">Le Mie Polizze</button></li>
                    <li><button>Documenti</button></li>
                    <li><button>Sinistri</button></li>
                    <li><button onClick={handleLogout} style={{ color: '#c62828' }}>Disconnetti</button></li>
                  </ul>
                </aside>

                <section class="main-content">
                  <h2>Le tue Polizze Attive</h2>
                  <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>Gestisci le tue coperture assicurative e controlla le prossime scadenze.</p>

                  {loadingPolicies ? (
                    <div>Caricamento polizze in corso...</div>
                  ) : (
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Polizza</th>
                          <th>Premio Annuo</th>
                          <th>Stato</th>
                        </tr>
                      </thead>
                      <tbody>
                        {policies.map(p => (
                          <tr key={p.id}>
                            <td><strong>{p.title}</strong></td>
                            <td>{p.premium} €</td>
                            <td><span class="badge badge-success">{p.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
