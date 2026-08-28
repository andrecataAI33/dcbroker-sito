import React, { useState } from 'react'
import { supabase } from './supabaseClient'

const QuoteWizard = ({ isOpen, onClose, isInline = false }) => {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState('')
  const [details, setDetails] = useState({ revenue: '', sector: '', age: '', vehicleValue: '' })
  const [lead, setLead] = useState({ name: '', email: '', phone: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [estimatedPrice, setEstimatedPrice] = useState(null)

  if (!isOpen && !isInline) return null

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  const handleCategorySelect = (cat) => {
    setCategory(cat)
    nextStep()
  }

  const handleDetailChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value })
  }

  const handleLeadChange = (e) => {
    setLead({ ...lead, [e.target.name]: e.target.value })
  }

  const calculatePrice = () => {
    let base = 300
    if (category === 'Azienda') {
      base = details.revenue === 'high' ? 1200 : 600
      if (details.sector === 'edilizia') base += 400
    } else if (category === 'Persona') {
      base = parseInt(details.age) > 50 ? 550 : 250
    } else if (category === 'Veicolo') {
      base = parseInt(details.vehicleValue) > 30000 ? 800 : 400
    }
    return base
  }

  const submitLead = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const price = calculatePrice()
    const messageDetails = `
      Categoria: ${category}
      Dettagli: ${JSON.stringify(details)}
      Prezzo Stimato Mostrato: €${price}/anno
    `

    const { error } = await supabase
      .from('contact_requests')
      .insert([
        {
          name: lead.name,
          email: lead.email,
          phone: lead.phone || null,
          subject: `Preventivo Veloce: ${category}`,
          message: messageDetails
        }
      ])

    setIsSubmitting(false)
    if (error) {
      console.error("Errore salvataggio lead:", error)
      alert("Si è verificato un errore, riprova più tardi.")
    } else {
      setEstimatedPrice(price)
      nextStep()
    }
  }

  const resetAndClose = () => {
    setStep(1)
    setCategory('')
    setDetails({ revenue: '', sector: '', age: '', vehicleValue: '' })
    setLead({ name: '', email: '', phone: '' })
    setEstimatedPrice(null)
    if (onClose) onClose()
  }

  const wizardContent = (
    <div className={`wizard-content ${isInline ? 'wizard-inline' : 'modal-content'}`} onClick={e => e.stopPropagation()} style={isInline ? { maxWidth: '800px', margin: '0 auto', padding: '2rem 0', boxShadow: 'none' } : {}}>
      {!isInline && <button className="modal-close" onClick={resetAndClose}>&times;</button>}
      
      {/* Progress Bar */}
      <div className="wizard-progress">
        <div className="wizard-progress-bar" style={{ width: `${(step / 4) * 100}%` }}></div>
      </div>

        {step === 1 && (
          <div className="wizard-step fade-in">
            <h2>Cosa vuoi assicurare?</h2>
            <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>Seleziona la categoria principale per iniziare</p>
            <div className="wizard-options">
              <button className="wizard-card" onClick={() => handleCategorySelect('Azienda')}>
                <span className="wizard-icon">🏢</span>
                <h3>La mia Azienda</h3>
                <p>RC, CyberRisk, D&O</p>
              </button>
              <button className="wizard-card" onClick={() => handleCategorySelect('Persona')}>
                <span className="wizard-icon">👨‍👩‍👧</span>
                <h3>Me o la Famiglia</h3>
                <p>Salute, Vita, Infortuni</p>
              </button>
              <button className="wizard-card" onClick={() => handleCategorySelect('Veicolo')}>
                <span className="wizard-icon">🚗</span>
                <h3>Un Veicolo</h3>
                <p>Auto, Moto, Flotte</p>
              </button>
            </div>
          </div>
        )}

        {step === 2 && category === 'Azienda' && (
          <div className="wizard-step slide-left">
            <h2>Dettagli della tua Azienda</h2>
            <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>Aiutaci a calibrare il rischio</p>
            <div className="form-group">
              <label>Settore Operativo</label>
              <select className="form-control" name="sector" value={details.sector} onChange={handleDetailChange}>
                <option value="">Seleziona...</option>
                <option value="servizi">Servizi / IT</option>
                <option value="commercio">Commercio / Retail</option>
                <option value="edilizia">Edilizia / Costruzioni</option>
                <option value="produzione">Produzione / Manifattura</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fatturato Annuo Stimato</label>
              <select className="form-control" name="revenue" value={details.revenue} onChange={handleDetailChange}>
                <option value="">Seleziona...</option>
                <option value="low">Fino a 500.000 €</option>
                <option value="medium">500.000 € - 2.000.000 €</option>
                <option value="high">Oltre 2.000.000 €</option>
              </select>
            </div>
            <div className="wizard-actions">
              <button className="btn-flat" onClick={prevStep}>Indietro</button>
              <button className="btn-login" onClick={nextStep} disabled={!details.sector || !details.revenue}>Avanti</button>
            </div>
          </div>
        )}

        {step === 2 && category === 'Persona' && (
          <div className="wizard-step slide-left">
            <h2>Dati della persona</h2>
            <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>Età e stile di vita incidono sul premio</p>
            <div className="form-group">
              <label>Età dell'assicurato</label>
              <input type="number" className="form-control" name="age" value={details.age} onChange={handleDetailChange} placeholder="Es. 35" />
            </div>
            <div className="wizard-actions">
              <button className="btn-flat" onClick={prevStep}>Indietro</button>
              <button className="btn-login" onClick={nextStep} disabled={!details.age}>Avanti</button>
            </div>
          </div>
        )}

        {step === 2 && category === 'Veicolo' && (
          <div className="wizard-step slide-left">
            <h2>Dettagli Veicolo</h2>
            <div className="form-group">
              <label>Valore stimato del veicolo (€)</label>
              <input type="number" className="form-control" name="vehicleValue" value={details.vehicleValue} onChange={handleDetailChange} placeholder="Es. 15000" />
            </div>
            <div className="wizard-actions">
              <button className="btn-flat" onClick={prevStep}>Indietro</button>
              <button className="btn-login" onClick={nextStep} disabled={!details.vehicleValue}>Avanti</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-step slide-left">
            <h2>Ultimo passo! 🎯</h2>
            <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>Abbiamo elaborato la stima. Inserisci i tuoi dati per svelare il prezzo e ricevere il preventivo completo via email.</p>
            <form onSubmit={submitLead}>
              <div className="form-group">
                <input type="text" className="form-control" name="name" value={lead.name} onChange={handleLeadChange} placeholder="Il tuo Nome" required />
              </div>
              <div className="form-group">
                <input type="email" className="form-control" name="email" value={lead.email} onChange={handleLeadChange} placeholder="La tua Email" required />
              </div>
              <div className="form-group">
                <input type="tel" className="form-control" name="phone" value={lead.phone} onChange={handleLeadChange} placeholder="Cellulare (opzionale)" />
              </div>
              <div className="wizard-actions" style={{ marginTop: '2rem' }}>
                <button type="button" className="btn-flat" onClick={prevStep}>Indietro</button>
                <button type="submit" className="btn-login" disabled={isSubmitting}>
                  {isSubmitting ? 'Calcolo in corso...' : 'Scopri il Prezzo'}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 4 && (
          <div className="wizard-step fade-in text-center" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '4rem' }}>🎉</span>
            <h2 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Preventivo Calcolato!</h2>
            <p style={{ color: 'var(--gray)' }}>In base ai dati inseriti, la nostra stima ottimizzata è di circa:</p>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', margin: '2rem 0' }}>
              € {estimatedPrice} <span style={{ fontSize: '1rem', color: 'var(--gray)' }}>/anno</span>
            </div>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '2rem' }}>Un nostro consulente ti contatterà a breve sulla mail <strong>{lead.email}</strong> per confermare l'offerta e attivare la copertura.</p>
            <button className="btn-login" onClick={resetAndClose} style={{ width: '100%' }}>Torna alla Home</button>
          </div>
        )}

      </div>
  )

  if (isInline) {
    return wizardContent
  }

  return (
    <div className="modal-overlay" onClick={resetAndClose}>
      {wizardContent}
    </div>
  )
}

export default QuoteWizard
