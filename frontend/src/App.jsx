import React, { useState, useEffect } from 'react'

function App() {
  const [activeTab, setActiveTab] = useState('home') // home | aziende | privati | chisiamo | contatti | portal
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [policies, setPolicies] = useState([])
  const [loadingPolicies, setLoadingPolicies] = useState(false)

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
          // Fallback static mock
          setPolicies([
            { id: 1, title: 'Polizza CyberRisk PMI', premium: 450.0, status: 'Attiva', created_at: '2026-08-23' },
            { id: 2, title: 'Polizza D&O Amministratori', premium: 800.0, status: 'Attiva', created_at: '2026-08-23' }
          ])
          setLoadingPolicies(false)
        })
    }
  }, [isLoggedIn, activeTab])

  // Handle Google Login Simulation (Clerk mock)
  const handleGoogleLogin = () => {
    setUserEmail('azienda.cliente@gmail.com')
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserEmail('')
  }

  // Handle Quote Calculation
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
        // Fallback calculations
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

  // Handle Contact Form Submission
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
        // Static mock success fallback if backend is offline
        setContactSuccess(true)
        setContactSubmitting(false)
      })
  }

  return (
    <div>
      <header>
        <div class="container header-wrap">
          <div class="logo">
            <img src="https://www.dcbroker.it/wp-content/uploads/2022/12/cropped-DC-Broker-logo.png" alt="DC Broker Logo" />
          </div>
          <nav>
            <button class={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>Home</button>
            <button class={activeTab === 'aziende' ? 'active' : ''} onClick={() => { setActiveTab('aziende'); setWizardStep(1); setCalculatedQuote(null); }}>Aziende</button>
            <button class={activeTab === 'privati' ? 'active' : ''} onClick={() => setActiveTab('privati')}>Privati</button>
            <button class={activeTab === 'chisiamo' ? 'active' : ''} onClick={() => setActiveTab('chisiamo')}>Chi Siamo</button>
            <button class={activeTab === 'contatti' ? 'active' : ''} onClick={() => { setActiveTab('contatti'); setContactSuccess(false); }}>Contatti</button>
            <button class={activeTab === 'portal' ? 'active' : ''} onClick={() => setActiveTab('portal')}>Portale Clienti</button>
          </nav>
        </div>
      </header>

      <main class="container">
        {/* TAB 1: SITE GENERAL HOME */}
        {activeTab === 'home' && (
          <div>
            <div class="hero">
              <h1>Crea il tuo futuro con: <span>DC Broker</span></h1>
              <p>Siamo la migliore soluzione per lo sviluppo del tuo business o per le tue necessità personali in considerazione dell'esperienza maturata in questi anni.</p>
              <button class="btn-primary" onClick={() => setActiveTab('contatti')}>Richiedi un Check-up Gratuito</button>
            </div>

            <div class="stats-row">
              <div class="stat-box">
                <div class="stat-number">15+</div>
                <div class="stat-label">Anni di Esperienza</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">10k+</div>
                <div class="stat-label">Clienti Soddisfatti</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">30+</div>
                <div class="stat-label">Compagnie Partner</div>
              </div>
            </div>

            <h2 class="section-title">Esplora le nostre soluzioni</h2>
            <div class="home-categories">
              <div class="category-card">
                <h3>💼 Soluzioni Aziende</h3>
                <p>Consulenze dettagliate e mirate per la tutela del tuo business, del credito e del rischio informatico.</p>
                <button class="btn-primary" onClick={() => setActiveTab('aziende')}>Scopri Servizi Aziende</button>
              </div>
              <div class="category-card">
                <h3>🏠 Soluzioni Privati</h3>
                <p>Protezione della tua persona, della tua famiglia, della casa, dell'auto e dei tuoi risparmi.</p>
                <button class="btn-primary" onClick={() => setActiveTab('privati')}>Scopri Servizi Privati</button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AZIENDE LANDING & WIZARD */}
        {activeTab === 'aziende' && (
          <div>
            <div class="hero">
              <h1>Consulenza Mirata per la <span>tua Azienda</span></h1>
              <p>Forniamo coperture e soluzioni su misura attraverso un modello semplice, al passo con l'evoluzione del mercato.</p>
              <button class="btn-primary" onClick={() => setWizardStep(2)}>Calcola Preventivo CyberRisk</button>
            </div>

            {wizardStep === 1 ? (
              <div class="services-section">
                <h2 class="section-title">Servizi Aziendali Core</h2>
                <div class="grid">
                  <div class="card" onClick={() => setWizardStep(2)}>
                    <div class="card-icon">🛡️</div>
                    <h3>CyberRisk</h3>
                    <p>Protezione avanzata contro malware, intrusioni, data breach e spese legali conseguenti a incidenti informatici.</p>
                  </div>
                  <div class="card">
                    <div class="card-icon">👔</div>
                    <h3>Polizza D&amp;O</h3>
                    <p>Responsabilità Civile per gli Organi di Gestione e Controllo societari, a tutela del patrimonio personale.</p>
                  </div>
                  <div class="card">
                    <div class="card-icon">🤝</div>
                    <h3>Cauzioni e Fideiussioni</h3>
                    <p>Garanzie rapide ed efficaci per la partecipazione ad appalti pubblici, obblighi doganali o rimborsi fiscali.</p>
                  </div>
                  <div class="card">
                    <div class="card-icon">📊</div>
                    <h3>Assicurazione Credito</h3>
                    <p>Gestione del rischio insolvenza e risarcimento delle perdite derivanti da vendite dilazionate sul mercato B2B.</p>
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

        {/* TAB 3: PRIVATI LANDING */}
        {activeTab === 'privati' && (
          <div>
            <div class="hero">
              <h1>Protezione per la <span>tua Vita Privata</span></h1>
              <p>Dalla mobilità quotidiana alla sicurezza della tua abitazione e dei tuoi cari. Ti aiutiamo a scegliere la copertura perfetta.</p>
              <button class="btn-primary" onClick={() => setActiveTab('contatti')}>Richiedi un Preventivo Personalizzato</button>
            </div>

            <h2 class="section-title">Coperture Assicurative per i Privati</h2>
            <div class="grid">
              <div class="card">
                <div class="card-icon">🚗</div>
                <h3>RC Auto &amp; Moto</h3>
                <p>Polizze auto e moto su misura, con tutele per l'assistenza stradale, infortuni del conducente e garanzie accessorie (Kasko, Furto/Incendio).</p>
              </div>
              <div class="card">
                <div class="card-icon">🏠</div>
                <h3>Casa e Famiglia</h3>
                <p>Proteggi la tua abitazione, il contenuto e i tuoi cari da danni accidentali, furti, responsabilità civile verso terzi o calamità.</p>
              </div>
              <div class="card">
                <div class="card-icon">🏥</div>
                <h3>Infortuni e Salute</h3>
                <p>Copertura delle spese sanitarie, diaria da ricovero e indennizzi per infortuni per garantire serenità a te ed alla tua famiglia.</p>
              </div>
              <div class="card">
                <div class="card-icon">📈</div>
                <h3>Risparmio e Vita</h3>
                <p>Piani pensionistici integrativi, assicurazioni sulla vita e soluzioni di investimento per tutelare il futuro dei tuoi cari.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CHI SIAMO */}
        {activeTab === 'chisiamo' && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '3rem', margin: '2rem 0' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--dark)' }}>Chi Siamo - DC Broker srl</h2>
            
            <p style={{ fontSize: '1.1rem', color: 'var(--gray)', marginBottom: '2rem', lineHeight: '1.8' }}>
              DC Broker srl è una società di brokeraggio assicurativo indipendente che opera sul mercato italiano. La nostra forza risiede nella nostra totale autonomia dalle compagnie assicurative. Questo ci consente di analizzare i rischi dei nostri clienti in modo imparziale e di negoziare con il mercato per trovare le soluzioni più competitive in termini di garanzie e premi.
            </p>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>I Nostri Valori Guida</h3>
            <ul style={{ listStyle: 'square', paddingLeft: '2rem', color: 'var(--gray)', lineHeight: '1.8', marginBottom: '2rem' }}>
              <li><strong>Indipendenza:</strong> Rappresentiamo solo ed esclusivamente gli interessi dei nostri clienti.</li>
              <li><strong>Competenza:</strong> Un team di esperti costantemente aggiornato sull'evoluzione dei mercati finanziari ed assicurativi.</li>
              <li><strong>Trasparenza:</strong> Condividiamo ogni dettaglio tecnico, franchigia e massimale in modo chiaro e comprensibile.</li>
              <li><strong>Supporto Post-Vendita:</strong> Ti assistiamo passo dopo passo nella gestione e liquidazione dei sinistri.</li>
            </ul>

            <div class="stats-row" style={{ marginTop: '3rem' }}>
              <div class="stat-box" style={{ background: 'var(--light-bg)' }}>
                <div class="stat-number">100%</div>
                <div class="stat-label">Consulenza Indipendente</div>
              </div>
              <div class="stat-box" style={{ background: 'var(--light-bg)' }}>
                <div class="stat-number">30+</div>
                <div class="stat-label">Accordi di Collaborazione</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONTATTI */}
        {activeTab === 'contatti' && (
          <div>
            <h2 class="section-title">Contatta il nostro Team</h2>
            
            <div class="contact-grid">
              <div class="contact-info">
                <h3>Informazioni di Contatto</h3>
                <p>Siamo a tua completa disposizione per rispondere a qualsiasi domanda o fissare un appuntamento.</p>
                
                <div class="info-item">
                  <span class="info-icon">📍</span>
                  <div>
                    <strong>Indirizzo</strong>
                    <p>Via Roma, 100 - Milano (MI)</p>
                  </div>
                </div>

                <div class="info-item">
                  <span class="info-icon">📞</span>
                  <div>
                    <strong>Telefono</strong>
                    <p>+39 02 12345678</p>
                  </div>
                </div>

                <div class="info-item">
                  <span class="info-icon">✉️</span>
                  <div>
                    <strong>Email</strong>
                    <p>info@dcbroker.it</p>
                  </div>
                </div>
              </div>

              <div class="contact-form-box">
                {contactSuccess && (
                  <div class="success-alert">
                    Grazie! La tua richiesta di contatto è stata inviata con successo. Un consulente di DC Broker ti ricontatterà al più presto.
                  </div>
                )}
                
                <form onSubmit={handleContactSubmit}>
                  <div class="form-group">
                    <label>Nome e Cognome / Ragione Sociale *</label>
                    <input type="text" class="form-control" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Inserisci il tuo nome" required />
                  </div>
                  
                  <div class="form-group">
                    <label>Indirizzo Email *</label>
                    <input type="email" class="form-control" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="Inserisci la tua email" required />
                  </div>

                  <div class="form-group">
                    <label>Numero di Telefono</label>
                    <input type="tel" class="form-control" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="Inserisci recapito telefonico" />
                  </div>

                  <div class="form-group">
                    <label>Oggetto *</label>
                    <input type="text" class="form-control" value={contactSubject} onChange={e => setContactSubject(e.target.value)} required />
                  </div>

                  <div class="form-group">
                    <label>Messaggio *</label>
                    <textarea class="form-control" rows="5" value={contactMessage} onChange={e => setContactMessage(e.target.value)} placeholder="Descrivi le tue necessità..." style={{ resize: 'vertical' }} required></textarea>
                  </div>

                  <button type="submit" class="btn-primary" style={{ width: '100%' }} disabled={contactSubmitting}>
                    {contactSubmitting ? 'Invio in corso...' : 'Invia Richiesta'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PORTALE CLIENTI (CLERK) */}
        {activeTab === 'portal' && (
          <div>
            {!isLoggedIn ? (
              <div class="auth-card">
                <h2>Accesso Portale Aziende</h2>
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
