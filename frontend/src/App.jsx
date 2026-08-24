import React, { useState, useEffect } from 'react'

function App() {
  const [activeTab, setActiveTab] = useState('home') // home | wizard | portal
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [policies, setPolicies] = useState([])
  const [loadingPolicies, setLoadingPolicies] = useState(false)

  // Wizard state
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
          // Fallback static static mock in case backend is offline
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
        // Fallback calculations in frontend in case backend is offline
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

  return (
    <div>
      <header>
        <div class="container header-wrap">
          <div class="logo">
            <img src="https://www.dcbroker.it/wp-content/uploads/2022/12/cropped-DC-Broker-logo.png" alt="DC Broker Logo" />
          </div>
          <nav>
            <button class={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>Aziende</button>
            <button class={activeTab === 'wizard' ? 'active' : ''} onClick={() => { setActiveTab('wizard'); setWizardStep(1); setCalculatedQuote(null); }}>Preventivatore</button>
            <button class={activeTab === 'portal' ? 'active' : ''} onClick={() => setActiveTab('portal')}>Portale Clienti</button>
          </nav>
        </div>
      </header>

      <main class="container">
        {/* TAB 1: LANDING PAGE */}
        {activeTab === 'home' && (
          <div>
            <div class="hero">
              <h1>Consulenza Mirata per la <span>tua Azienda</span></h1>
              <p>Forniamo soluzioni assicurative innovative attraverso un modello snello al passo con l'evoluzione digitale.</p>
              <button class="btn-primary" onClick={() => setActiveTab('wizard')}>Richiedi un Preventivo CyberRisk</button>
            </div>

            <div class="services-section">
              <h2>Servizi Aziendali Core</h2>
              <div class="grid">
                <div class="card" onClick={() => { setActiveTab('wizard'); setWizardStep(1); }}>
                  <div class="card-icon">🛡️</div>
                  <h3>CyberRisk</h3>
                  <p>Protezione avanzata contro malware, intrusioni di rete, data breach e spese legali conseguenti a incidenti informatici.</p>
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
          </div>
        )}

        {/* TAB 2: WIZARD PREVENTIVATORE */}
        {activeTab === 'wizard' && (
          <div class="wizard-container">
            {wizardStep === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); setWizardStep(2); }}>
                <div class="wizard-step-label">Passaggio 1 di 3</div>
                <h2 class="wizard-title">Informazioni Generali</h2>
                
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

                <div class="wizard-actions">
                  <div></div>
                  <button type="submit" class="btn-primary">Avanti</button>
                </div>
              </form>
            )}

            {wizardStep === 2 && (
              <form onSubmit={handleCalculateQuote}>
                <div class="wizard-step-label">Passaggio 2 di 3</div>
                <h2 class="wizard-title">Fatturato e Misure di Sicurezza</h2>

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
                      <span>Formazione periodica dipendenti su Phishing e social engineering</span>
                    </label>
                  </div>
                </div>

                <div class="wizard-actions">
                  <button type="button" class="btn-primary" style={{ background: '#ccc', color: '#333' }} onClick={() => setWizardStep(1)}>Indietro</button>
                  <button type="submit" class="btn-primary" disabled={calculating}>
                    {calculating ? 'Elaborazione...' : 'Calcola Tariffa'}
                  </button>
                </div>
              </form>
            )}

            {wizardStep === 3 && calculatedQuote && (
              <div>
                <div class="wizard-step-label">Passaggio 3 di 3: Preventivo Pronto!</div>
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

                <div style={{ textAlign: 'center' }}>
                  <button class="btn-primary" onClick={() => { setActiveTab('portal'); handleGoogleLogin(); }}>
                    Registrati per Sottoscrivere la Polizza
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PORTALE UTENTI (CLERK O MOCK CLERK) */}
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
