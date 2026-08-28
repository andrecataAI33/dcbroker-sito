import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'
import QuoteWizard from './QuoteWizard'

// 1. Componente per l'animazione allo scroll (Fade & Slide-up)
const Reveal = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [])

  return (
    <div 
      ref={ref} 
      className={`reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// 2. Componente per le FAQ (Accordion)
const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <div className="faq-container">
      <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Domande Frequenti</h2>
      {items.map((item, index) => (
        <div key={index} className="faq-item">
          <button className="faq-question" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
            {item.q}
            <span className={`faq-icon ${openIndex === index ? 'open' : ''}`}>+</span>
          </button>
          <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
            {item.a}
          </div>
        </div>
      ))}
    </div>
  )
}

// 3. Componente Carosello Recensioni
const TestimonialCarousel = () => {
  const [current, setCurrent] = useState(0)
  const testimonials = [
    { text: "Da quando abbiamo affidato a DC Broker la gestione dei rischi aziendali, abbiamo abbattuto i costi assicurativi del 20% migliorando le coperture.", author: "CEO, Tech Solutions S.p.A." },
    { text: "Un servizio impeccabile. Non vendono semplicemente polizze, ma si affiancano come un vero partner strategico.", author: "Direttore Finanziario, Gruppo Logistica M." },
    { text: "Assistenza fulminea in caso di sinistro. Sapere di avere dei veri professionisti al proprio fianco non ha prezzo.", author: "Amministratore Delegato, Retail Co." }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <div className="testimonial-container">
      <Reveal>
        <h2 className="section-title" style={{ color: 'var(--white)', marginBottom: '1rem' }}>Cosa dicono i nostri clienti</h2>
        <div className="testimonial-wrap">
          {testimonials.map((t, index) => (
            <div key={index} className={`testimonial-item ${index === current ? 'active' : ''}`}>
              <p className="testimonial-quote">"{t.text}"</p>
              <p className="testimonial-author">- {t.author}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  )
}


function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [aziendeCategory, setAziendeCategory] = useState('professionali')
  
  // Auth State
  const [session, setSession] = useState(null)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  
  // User Data State
  const [userPolicies, setUserPolicies] = useState([])

  // Wizard State
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSubject, setModalSubject] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactSuccess, setContactSuccess] = useState(false)
  const [contactSubmitting, setContactSubmitting] = useState(false)

  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminContacts, setAdminContacts] = useState([])
  const [adminError, setAdminError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchUserPolicies(session.user.id)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchUserPolicies(session.user.id)
      } else {
        setUserPolicies([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeTab])

  const fetchUserPolicies = async (userId) => {
    const { data, error } = await supabase
      .from('user_policies')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Errore fetch polizze:', error)
    } else {
      setUserPolicies(data || [])
    }
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')

    let error;
    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
      })
      error = signUpError
      if (!error) {
        setAuthError('Controlla la tua email per confermare la registrazione!')
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      })
      error = signInError
    }

    if (error) setAuthError(error.message)
    setAuthLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setAuthEmail('')
    setAuthPassword('')
  }

  const openContactModal = (subject = 'Richiesta Informazioni Generica') => {
    setModalSubject(subject)
    setContactSuccess(false)
    setIsModalOpen(true)
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactSubmitting(true)

    const { data, error } = await supabase
      .from('contact_requests')
      .insert([
        { 
          name: contactName, 
          email: contactEmail, 
          phone: contactPhone || null, 
          subject: modalSubject, 
          message: contactMessage 
        }
      ])

    if (error) {
      console.error("Errore salvataggio contatto:", error)
      setContactSuccess(false)
      setContactSubmitting(false)
    } else {
      setContactSuccess(true)
      setContactName('')
      setContactEmail('')
      setContactPhone('')
      setContactMessage('')
      setContactSubmitting(false)
      setTimeout(() => setIsModalOpen(false), 3000)
    }
  }

  const handleAdminLogin = (e) => {
    e.preventDefault()
    if (adminPassword === 'dcbroker2026') {
      setIsAdminLoggedIn(true)
      setAdminError('')
      fetchContacts()
    } else {
      setAdminError('Password errata')
    }
  }

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Errore fetch contatti", error)
    } else {
      setAdminContacts(data || [])
    }
  }

  // FAQ Dati
  const faqPrivati = [
    { q: "Qual è il vantaggio di affidarsi a un broker invece che a una compagnia?", a: "Il broker lavora per il cliente, non per la compagnia. Questo significa che cerchiamo sul mercato libero le condizioni più vantaggiose e le coperture più adatte, garantendo un servizio imparziale e indipendente." },
    { q: "Come posso denunciare un sinistro?", a: "Puoi aprire un sinistro direttamente dalla tua Area Riservata caricando foto e documenti, oppure contattare tempestivamente il nostro team dedicato via telefono o email. Ci occuperemo noi dell'iter burocratico." },
    { q: "Le vostre consulenze hanno un costo?", a: "No, la consulenza iniziale e l'analisi dei tuoi rischi attuali è un servizio offerto gratuitamente. Saremo noi a venire remunerati dalle compagnie in base alle polizze stipulate, senza rincari per te." }
  ]

  const faqAziende = [
    { q: "Realizzate check-up gratuiti sulle polizze aziendali in corso?", a: "Sì, offriamo un servizio di Risk Management. Analizziamo i tuoi contratti in corso gratuitamente, evidenziando buchi di copertura o costi eccessivi, per poi proporti un piano ottimizzato." },
    { q: "Siete in grado di gestire polizze D&O o coperture Cyber complesse?", a: "Assolutamente. Il nostro team Corporate è altamente specializzato nei rischi operativi complessi, dalle responsabilità di Amministratori (D&O) alle più sofisticate coperture contro il Cybercrime." },
    { q: "Che supporto offrite durante le operazioni M&A?", a: "Offriamo analisi due diligence assicurativa pre-deal e soluzioni Warranty & Indemnity (W&I) per proteggere compratori e venditori da passività impreviste durante operazioni di fusione o acquisizione." }
  ]


  return (
    <div>
      <header>
        <div className="container header-wrap">
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
            <img src="https://www.dcbroker.it/wp-content/uploads/2022/12/cropped-DC-Broker-logo.png" alt="DC Broker Logo" />
          </div>
          <nav>
            <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>HOME</button>
            <button className={activeTab === 'privati' ? 'active' : ''} onClick={() => setActiveTab('privati')}>PRIVATI</button>
            <button className={activeTab === 'aziende' ? 'active' : ''} onClick={() => setActiveTab('aziende')}>AZIENDE</button>
            <button className={activeTab === 'contatti' ? 'active' : ''} onClick={() => setActiveTab('contatti')}>CONTATTI</button>
          </nav>
          <div className="header-actions">
            <button className="btn-login" onClick={() => setActiveTab('portal')}>Area Riservata</button>
          </div>
        </div>
      </header>

      <main>
        {activeTab === 'home' && (
          <div>
            <div className="hero">
              <Reveal>
                <div className="hero-content">
                  <h1>Crea il tuo futuro con: <br />DC Broker</h1>
                  <p>Siamo la migliore soluzione possibile per lo sviluppo del tuo business o per le tue necessità personali in considerazione dell'esperienza maturata in questi anni.</p>
                  <div className="hero-buttons">
                    <button className="btn-pill" onClick={() => setIsWizardOpen(true)}>Calcola Preventivo</button>
                    <button className="btn-pill-outline" onClick={() => setActiveTab('portal')}>Area Riservata</button>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="container section">
              <Reveal>
                <h2 className="section-title">Chi Siamo</h2>
                <div style={{ maxWidth: '800px', fontSize: '1.1rem', color: 'var(--gray)', marginBottom: '2rem' }}>
                  <p><strong>Nasce da un'idea di Daniele Carrella per diventare un partner assicurativo affidabile.</strong></p>
                  <p style={{ marginTop: '1rem' }}>DC Broker nasce nel 1990 e si specializza nell'offerta ai segmenti Privati ed Aziende. Siamo nati da una sfida; quella di offrire ai nostri clienti un servizio migliore di quello ricevuto prima. Siamo un broker assicurativo che opera sul territorio nazionale ed in quanto tali cerchiamo ogni giorno grazie ad un team di professionisti, la migliore soluzione possibile pensata su misura per i nostri clienti sia retail che corporate.</p>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="stats-row">
                  <div>
                    <div className="stat-number">35+</div>
                    <div className="stat-label">Anni di Esperienza</div>
                  </div>
                  <div>
                    <div className="stat-number">1000+</div>
                    <div className="stat-label">Clienti</div>
                  </div>
                  <div>
                    <div className="stat-number">99%</div>
                    <div className="stat-label">Clienti Soddisfatti</div>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <h2 className="section-title" style={{ textAlign: 'center', marginTop: '2rem' }}>Il Nostro Metodo</h2>
                <p style={{ textAlign: 'center', color: 'var(--gray)', marginBottom: '3rem' }}>Trasparenza, velocità e competenza. Ecco come ti proteggiamo.</p>
                <div className="timeline-grid">
                  <div className="timeline-step">
                    <div className="timeline-number">1</div>
                    <h4 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Analisi dei Rischi</h4>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Valutiamo con precisione la tua situazione attuale o quella della tua azienda, individuando potenziali vulnerabilità o inefficienze.</p>
                  </div>
                  <div className="timeline-step">
                    <div className="timeline-number">2</div>
                    <h4 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Proposta Indipendente</h4>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Scandagliamo il mercato libero per offrirti la soluzione assicurativa più completa e conveniente, senza alcun conflitto di interessi.</p>
                  </div>
                  <div className="timeline-step">
                    <div className="timeline-number">3</div>
                    <h4 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Protezione Continua</h4>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Non ti abbandoniamo dopo la firma. Il nostro team ti garantisce supporto costante, specialmente nella delicata fase del sinistro.</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h2 className="section-title" style={{ marginTop: '5rem' }}>Incontra i nostri esperti</h2>
                <div className="team-grid">
                  <div className="team-member">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80" alt="Daniele Carrella" />
                    <h4>Daniele Carrella</h4>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Amministratore</p>
                  </div>
                  <div className="team-member">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80" alt="Esperto Operazioni" />
                    <h4>Maria Rossi</h4>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Operazioni</p>
                  </div>
                  <div className="team-member">
                    <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80" alt="Esperto Consulenza" />
                    <h4>Marco Bianchi</h4>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Consulenza</p>
                  </div>
                  <div className="team-member">
                    <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80" alt="Assistenza" />
                    <h4>Elena Verdi</h4>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Assistenza</p>
                  </div>
                </div>
              </Reveal>
            </div>
            
            <TestimonialCarousel />
          </div>
        )}

        {activeTab === 'privati' && (
          <div className="container section">
            <Reveal>
              <h2 className="section-title">Soluzioni per Persona e Famiglia</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--gray)', marginBottom: '3rem', maxWidth: '800px' }}>
                Il cliente è il nostro più grande valore. Diamo ai nostri clienti un'assistenza e una tutela costante. Offriamo soluzioni assicurative pensate sulle vostre esigenze.
              </p>
            </Reveal>

            <div className="grid">
              <Reveal delay={100}>
                <div className="card">
                  <div className="card-img-container">
                    <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80" alt="Polizza Vita" className="card-img" />
                  </div>
                  <div className="card-body">
                    <h3>Polizza Vita</h3>
                    <p>L'assicurazione vita garantisce un sostegno economico in caso di morte o infortunio grave di un membro della propria famiglia. Chiedi un preventivo personalizzato.</p>
                    <div className="card-spacer"></div>
                    <button className="btn-flat" onClick={() => openContactModal('Preventivo Polizza Vita')}>Richiedi preventivo Vita</button>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="card">
                  <div className="card-img-container">
                    <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80" alt="Spese Mediche" className="card-img" />
                  </div>
                  <div className="card-body">
                    <h3>Rimborso spese mediche</h3>
                    <p>L'assicurazione rimborso spese mediche, è una polizza che permette di tutelare la propria salute in relazione a patologie sopraggiunte nelle più svariate situazioni.</p>
                    <div className="card-spacer"></div>
                    <button className="btn-flat" onClick={() => openContactModal('Preventivo Rimborso spese mediche')}>Richiedi preventivo Salute</button>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="card">
                  <div className="card-img-container">
                    <img src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=600&q=80" alt="Long Term Care" className="card-img" />
                  </div>
                  <div className="card-body">
                    <h3>Long Term Care</h3>
                    <p>DC Broker ti propone Assicurazione contro il rischio di non autosufficienza a seguito di infortunio, malattia grave o longevità. Richiedi un preventivo.</p>
                    <div className="card-spacer"></div>
                    <button className="btn-flat" onClick={() => openContactModal('Preventivo Long Term Care')}>Richiedi preventivo LTC</button>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="card">
                  <div className="card-img-container">
                    <img src="https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?auto=format&fit=crop&w=600&q=80" alt="Infortuni" className="card-img" />
                  </div>
                  <div className="card-body">
                    <h3>Polizza Infortuni</h3>
                    <p>La polizza infortuni ha lo scopo di proteggere economicamente la famiglia dagli incidenti più gravi, che potrebbero minare la tranquillità familiare.</p>
                    <div className="card-spacer"></div>
                    <button className="btn-flat" onClick={() => openContactModal('Preventivo Polizza Infortuni')}>Richiedi preventivo Infortuni</button>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="card">
                  <div className="card-img-container">
                    <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" alt="Abitazione" className="card-img" />
                  </div>
                  <div className="card-body">
                    <h3>Polizza Abitazione</h3>
                    <p>La polizza Globale Abitazione di DC Broker ti offre una protezione completa per la tua casa ed alla tua Famiglia con un insieme di garanzie e tutele.</p>
                    <div className="card-spacer"></div>
                    <button className="btn-flat" onClick={() => openContactModal('Preventivo Polizza Abitazione')}>Richiedi preventivo Casa</button>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="card">
                  <div className="card-img-container">
                    <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80" alt="Viaggi" className="card-img" />
                  </div>
                  <div className="card-body">
                    <h3>Polizza Viaggi</h3>
                    <p>Indispensabile a chi ha intenzione di raggiungere Paesi molto lontani o a rischio o destinazioni dove le spese sanitarie per eventuali cure mediche, sono molto elevate.</p>
                    <div className="card-spacer"></div>
                    <button className="btn-flat" onClick={() => openContactModal('Preventivo Polizza Viaggi')}>Richiedi preventivo Viaggi</button>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <div className="card">
                  <div className="card-img-container">
                    <img src="https://images.unsplash.com/photo-1469811565434-604b9015c328?auto=format&fit=crop&w=600&q=80" alt="Auto e Moto" className="card-img" />
                  </div>
                  <div className="card-body">
                    <h3>Assicurazioni Auto e Moto</h3>
                    <p>Scopri le polizze per la tua auto e la tua moto e le combinazioni di servizi che fanno al caso tuo. Tutela te stesso e il tuo veicolo dagli imprevisti.</p>
                    <div className="card-spacer"></div>
                    <button className="btn-flat" onClick={() => openContactModal('Preventivo Auto e Moto')}>Richiedi preventivo Motori</button>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal>
              <Accordion items={faqPrivati} />
            </Reveal>
          </div>
        )}

        {activeTab === 'aziende' && (
          <div className="container section">
            <Reveal>
              <h2 className="section-title">Soluzioni per Imprese e Professionisti</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--gray)', marginBottom: '3rem', maxWidth: '800px' }}>
                Forniremo consulenze dettagliate e mirate attraverso un modello di business semplice ma al passo con la continua evoluzione del mercato e del prodotto.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <div className="tabs">
                <button className={`tab-btn ${aziendeCategory === 'professionali' ? 'active' : ''}`} onClick={() => setAziendeCategory('professionali')}>Rischi Professionali</button>
                <button className={`tab-btn ${aziendeCategory === 'operativi' ? 'active' : ''}`} onClick={() => setAziendeCategory('operativi')}>Rischi Operativi e Patrimoniali</button>
                <button className={`tab-btn ${aziendeCategory === 'straordinarie' ? 'active' : ''}`} onClick={() => setAziendeCategory('straordinarie')}>Operazioni Straordinarie</button>
                <button className={`tab-btn ${aziendeCategory === 'automotive' ? 'active' : ''}`} onClick={() => setAziendeCategory('automotive')}>Automotive Aziendale</button>
              </div>
            </Reveal>

            {aziendeCategory === 'professionali' && (
              <div className="grid">
                <Reveal delay={0}>
                  <div className="card">
                    <div className="card-img-container">
                      <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80" alt="RC Professionale" className="card-img" />
                    </div>
                    <div className="card-body">
                      <h3>RC Professionale</h3>
                      <p>Anche tu, come tutti i professionisti hai necessità di lavorare senza pensieri. DC Broker è specializzata nell'offrirti la protezione di cui hai bisogno.</p>
                      <div className="card-spacer"></div>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={150}>
                  <div className="card">
                    <div className="card-img-container">
                      <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80" alt="Tutela Legale" className="card-img" />
                    </div>
                    <div className="card-body">
                      <h3>Tutela Legale</h3>
                      <p>La polizza copre le spese di difesa degli interessi di un'azienda, in caso di controversie penali e civili, sia in ambito stragiudiziale che in tribunale.</p>
                      <div className="card-spacer"></div>
</div>
                  </div>
                </Reveal>
                <Reveal delay={300}>
                  <div className="card">
                    <div className="card-img-container">
                      <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&w=600&q=80" alt="Polizza D&O" className="card-img" />
                    </div>
                    <div className="card-body">
                      <h3>Polizza D&O</h3>
                      <p>Sei un Amministratore, Sindaco, Dirigente di Società? Scegli la Polizza di Responsabilità Civile che assicura chi gestisce situazioni di rischio per l'azienda.</p>
                      <div className="card-spacer"></div>
</div>
                  </div>
                </Reveal>
              </div>
            )}

            {aziendeCategory === 'operativi' && (
              <div className="grid">
                <Reveal delay={0}>
                  <div className="card">
                    <div className="card-img-container">
                      <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80" alt="Assicurazione del Credito" className="card-img" />
                    </div>
                    <div className="card-body">
                      <h3>Assicurazione del Credito</h3>
                      <p>L'Assicurazione del Credito aiuta le aziende a salvaguardarsi da eventuali mancati pagamenti da parte di clienti, in Italia o all'estero.</p>
                      <div className="card-spacer"></div>
</div>
                  </div>
                </Reveal>
                <Reveal delay={150}>
                  <div className="card">
                    <div className="card-img-container">
                      <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" alt="All Risk Insurance" className="card-img" />
                    </div>
                    <div className="card-body">
                      <h3>All Risk Insurance</h3>
                      <p>Con DC Broker puoi stipulare un'assicurazione All Risks, con estensione alla copertura assicurativa per i danni da interruzione dell'attività.</p>
                      <div className="card-spacer"></div>
</div>
                  </div>
                </Reveal>
                <Reveal delay={300}>
                  <div className="card">
                    <div className="card-img-container">
                      <img src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80" alt="Energy" className="card-img" />
                    </div>
                    <div className="card-body">
                      <h3>Energy</h3>
                      <p>DC Broker tramite il proprio Team di esperti in assicurazioni energetiche riesce a supportarti nel cautelarti e minimizzare i rischi nel settore.</p>
                      <div className="card-spacer"></div>
</div>
                  </div>
                </Reveal>
                <Reveal delay={450}>
                  <div className="card">
                    <div className="card-img-container">
                      <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80" alt="CyberRisk" className="card-img" />
                    </div>
                    <div className="card-body">
                      <h3>Polizza CyberRisk</h3>
                      <p>Proteggi la tua azienda contro il crimine informatico e le minacce digitali, DC Broker ti propone diverse soluzioni complete e personalizzabili.</p>
                      <div className="card-spacer"></div>
</div>
                  </div>
                </Reveal>
              </div>
            )}

            {aziendeCategory === 'straordinarie' && (
              <div className="grid">
                <Reveal delay={0}>
                  <div className="card">
                    <div className="card-img-container">
                      <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80" alt="Polizze M&A" className="card-img" />
                    </div>
                    <div className="card-body">
                      <h3>Polizze M&A</h3>
                      <p>DC Broker ti guida e ti fornisce soluzioni e strategie integrate per la gestione del rischio aziendale durante operazioni di fusioni e acquisizioni.</p>
                      <div className="card-spacer"></div>
</div>
                  </div>
                </Reveal>
                <Reveal delay={150}>
                  <div className="card">
                    <div className="card-img-container">
                      <img src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=600&q=80" alt="Cauzioni" className="card-img" />
                    </div>
                    <div className="card-body">
                      <h3>Cauzioni e Fideiussioni</h3>
                      <p>DC Broker ha le competenze per aiutare la tua azienda verso l'apertura a nuovi mercati dove esiste la necessità del rilascio di garanzie fidejussorie.</p>
                      <div className="card-spacer"></div>
</div>
                  </div>
                </Reveal>
              </div>
            )}

            {aziendeCategory === 'automotive' && (
              <div className="grid">
                <Reveal delay={0}>
                  <div className="card">
                    <div className="card-img-container">
                      <img src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80" alt="Flotte Aziendali" className="card-img" />
                    </div>
                    <div className="card-body">
                      <h3>Assicurazioni Flotte Aziendali</h3>
                      <p>Proteggi la tua flotta aziendale con le soluzioni assicurative complete di DC Broker, ottimizzando la gestione dei veicoli e la tutela dei tuoi driver.</p>
                      <div className="card-spacer"></div>
</div>
                  </div>
                </Reveal>
                <Reveal delay={150}>
                  <div className="card">
                    <div className="card-img-container">
                      <img src="https://images.unsplash.com/photo-1563714192534-100f72382902?auto=format&fit=crop&w=600&q=80" alt="Car Dealer" className="card-img" />
                    </div>
                    <div className="card-body">
                      <h3>Progetto Car Dealer</h3>
                      <p>DC BROKER INSURANCE, il brand nato per sviluppare il modello distributivo innovativo dedicato specificamente al settore dei Car Dealer.</p>
                      <div className="card-spacer"></div>
</div>
                  </div>
                </Reveal>
              </div>
            )}

            <Reveal>
              <Accordion items={faqAziende} />
            </Reveal>
          </div>
        )}

        {activeTab === 'contatti' && (
          <div className="container section">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
              <Reveal delay={0}>
                <div>
                  <h2 className="section-title">Sede e Recapiti</h2>
                  <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>Per richieste commerciali, check-up di polizze in corso o appuntamenti fisici/digitali presso le nostre sedi.</p>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <strong>Sede Operativa</strong>
                    <p style={{ color: 'var(--gray)' }}>Via Roma, 100 - Milano (MI)</p>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <strong>Telefono</strong>
                    <p style={{ color: 'var(--gray)' }}>+39 02 12345678</p>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <strong>Email</strong>
                    <p style={{ color: 'var(--gray)' }}>info@dcbroker.it</p>
                  </div>
                </div>
              </Reveal>
              
              <Reveal delay={150}>
                <div>
                  <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Inviaci un messaggio</h3>
                    <button className="btn-login" style={{ width: '100%', padding: '1rem', borderRadius: '6px' }} onClick={() => openContactModal('Richiesta Informazioni Generica')}>
                      Apri Modulo di Contatto
                    </button>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={300}>
              <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '3rem', borderRadius: '12px' }}>
                <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Gestione Reclami</h2>
                <div style={{ color: 'var(--gray)' }}>
                  <p style={{ marginBottom: '1rem' }}>DC Broker pone la massima attenzione alla soddisfazione del cliente. Qualora ritenga che il nostro servizio o quello della compagnia assicurativa non sia stato all'altezza, può presentare un reclamo formale.</p>
                  <h4 style={{ color: 'var(--dark)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Modalità di invio</h4>
                  <p style={{ marginBottom: '1rem' }}>Il reclamo può essere inoltrato in forma scritta via Posta Elettronica Certificata (PEC) all'indirizzo <strong>reclami.dcbroker@pec.it</strong> oppure tramite raccomandata A/R presso la nostra Sede Operativa.</p>
                  <h4 style={{ color: 'var(--dark)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Tempistiche e IVASS</h4>
                  <p>Ci impegniamo a rispondere in modo esaustivo entro <strong>45 giorni</strong> dal ricevimento. Qualora l'esito non fosse soddisfacente, è suo diritto rivolgersi all'IVASS (Istituto per la Vigilanza sulle Assicurazioni) o utilizzare i sistemi alternativi di risoluzione delle controversie.</p>
                </div>
              </div>
            </Reveal>
          </div>
        )}

        {/* Modal Contatti Globale */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Contattaci</h3>
              
              {contactSuccess ? (
                <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '6px', fontWeight: 'bold' }}>
                  Grazie! La tua richiesta è stata inviata correttamente. Ti risponderemo al più presto.
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <label>Prodotto/Argomento</label>
                    <input type="text" className="form-control" value={modalSubject} onChange={e => setModalSubject(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Nome / Azienda</label>
                    <input type="text" className="form-control" value={contactName} onChange={e => setContactName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Messaggio</label>
                    <textarea className="form-control" rows="4" value={contactMessage} onChange={e => setContactMessage(e.target.value)} required></textarea>
                  </div>
                  <button type="submit" className="btn-login" style={{ width: '100%', borderRadius: '6px' }} disabled={contactSubmitting}>
                    {contactSubmitting ? 'Invio in corso...' : 'Invia Richiesta'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Area Riservata (Supabase Auth) */}
        {activeTab === 'portal' && (
          <div className="container section">
            <Reveal>
              {!session ? (
                <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', background: 'var(--white)', padding: '3rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <h2>Area Riservata</h2>
                  <p style={{ color: 'var(--gray)', margin: '1rem 0 2rem 0' }}>
                    {isSignUp ? 'Crea un account per gestire le tue polizze.' : 'Accedi per gestire le tue polizze e i sinistri.'}
                  </p>
                  
                  <form onSubmit={handleAuth}>
                    <div className="form-group">
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="La tua email" 
                        value={authEmail} 
                        onChange={e => setAuthEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        type="password" 
                        className="form-control" 
                        placeholder="Password" 
                        value={authPassword} 
                        onChange={e => setAuthPassword(e.target.value)} 
                        required 
                      />
                    </div>
                    {authError && <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem' }}>{authError}</p>}
                    
                    <button type="submit" className="btn-login" style={{ width: '100%', borderRadius: '6px' }} disabled={authLoading}>
                      {authLoading ? 'Attendere...' : (isSignUp ? 'Registrati' : 'Accedi')}
                    </button>
                  </form>
                  
                  <div style={{ marginTop: '1.5rem' }}>
                    <button className="btn-flat" onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }} style={{ fontSize: '0.9rem' }}>
                      {isSignUp ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '12px', padding: '3rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <div>
                      <h3>Benvenuto, {session.user.email}</h3>
                      <p style={{ color: 'var(--gray)' }}>Le tue polizze attive</p>
                    </div>
                    <button className="btn-flat" style={{ width: 'auto', color: 'red' }} onClick={handleLogout}>Logout</button>
                  </div>
                  
                  {userPolicies.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}>
                      <p>Non hai ancora nessuna polizza collegata al tuo account.</p>
                      <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Se hai stipulato una polizza con noi, verrà inserita a breve dai nostri consulenti.</p>
                    </div>
                  ) : (
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                          <th style={{ padding: '1rem' }}>Polizza</th>
                          <th style={{ padding: '1rem' }}>Premio</th>
                          <th style={{ padding: '1rem' }}>Scadenza</th>
                          <th style={{ padding: '1rem' }}>Stato</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userPolicies.map((policy) => (
                          <tr key={policy.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '1rem' }}><strong>{policy.policy_name}</strong></td>
                            <td style={{ padding: '1rem' }}>€ {policy.premium}</td>
                            <td style={{ padding: '1rem' }}>{new Date(policy.expiration_date).toLocaleDateString('it-IT')}</td>
                            <td style={{ padding: '1rem' }}>
                              <span style={{ 
                                background: policy.status === 'Attiva' ? '#dcfce7' : '#fee2e2', 
                                color: policy.status === 'Attiva' ? '#166534' : '#991b1b', 
                                padding: '0.3rem 0.6rem', 
                                borderRadius: '20px', 
                                fontSize: '0.8rem', 
                                fontWeight: 'bold' 
                              }}>
                                {policy.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </Reveal>
          </div>
        )}

        {/* Area Admin (CRM) */}
        {activeTab === 'admin' && (
          <div className="container section">
            <Reveal>
              {!isAdminLoggedIn ? (
                <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', background: 'var(--white)', padding: '3rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <h2>Admin Login</h2>
                  <p style={{ color: 'var(--gray)', margin: '1rem 0 2rem 0' }}>Inserisci la password di amministrazione per accedere al CRM dei contatti.</p>
                  <form onSubmit={handleAdminLogin}>
                    <div className="form-group">
                      <input 
                        type="password" 
                        className="form-control" 
                        value={adminPassword} 
                        onChange={e => setAdminPassword(e.target.value)} 
                        placeholder="Password..."
                        required 
                      />
                    </div>
                    {adminError && <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem' }}>{adminError}</p>}
                    <button type="submit" className="btn-login" style={{ width: '100%', borderRadius: '6px' }}>Accedi</button>
                  </form>
                </div>
              ) : (
                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '12px', padding: '3rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <div>
                      <h2>Dashboard Contatti</h2>
                      <p style={{ color: 'var(--gray)' }}>Elenco delle richieste ricevute dal sito web</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button className="btn-flat" style={{ width: 'auto' }} onClick={fetchContacts}>Aggiorna</button>
                      <button className="btn-flat" style={{ width: 'auto', color: 'red' }} onClick={() => { setIsAdminLoggedIn(false); setAdminPassword(''); setAdminContacts([]); }}>Logout</button>
                    </div>
                  </div>
                  
                  {adminContacts.length === 0 ? (
                    <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '2rem 0' }}>Nessuna richiesta di contatto ricevuta.</p>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem' }}>Data</th>
                            <th style={{ padding: '1rem' }}>Mittente</th>
                            <th style={{ padding: '1rem' }}>Oggetto</th>
                            <th style={{ padding: '1rem' }}>Messaggio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminContacts.map((c, i) => (
                            <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                              <td style={{ padding: '1rem', whiteSpace: 'nowrap', color: 'var(--gray)' }}>
                                {new Date(c.created_at).toLocaleDateString('it-IT')} <br/>
                                {new Date(c.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td style={{ padding: '1rem' }}>
                                <strong>{c.name}</strong><br/>
                                <a href={`mailto:${c.email}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{c.email}</a><br/>
                                {c.phone && <span style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{c.phone}</span>}
                              </td>
                              <td style={{ padding: '1rem' }}>
                                <span style={{ background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>{c.subject}</span>
                              </td>
                              <td style={{ padding: '1rem', fontSize: '0.95rem' }}>
                                {c.message}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </Reveal>
          </div>
        )}

        {/* Preventivatore Wizard */}
        <QuoteWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />

      </main>

      <footer>
        <div className="container">
          <Reveal>
            <div className="footer-grid">
              <div className="footer-col">
                <h4>DC Broker S.r.l.</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Il partner assicurativo affidabile per privati, aziende e professionisti dal 1990.</p>
              </div>
              <div className="footer-col">
                <h4>Link Utili</h4>
                <ul>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Informativa Privacy</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Cookie Policy</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Politica Aziendale</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Contatti</h4>
                <ul>
                  <li>📞 +39 02 12345678</li>
                  <li>📱 +39 340 1234567</li>
                  <li>✉️ info@dcbroker.it</li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Dati Societari</h4>
                <ul>
                  <li>P.IVA: 12345678901</li>
                  <li>Iscrizione RUI: B000123456</li>
                  <li>Soggetta a vigilanza IVASS</li>
                  <li style={{ marginTop: '1rem' }}><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('admin'); }} style={{ fontSize: '0.8rem', opacity: 0.5 }}>Area Admin (CRM)</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              &copy; 2026 DC Broker. Tutti i diritti riservati.
            </div>
          </Reveal>
        </div>
      </footer>
    </div>
  )
}

export default App

