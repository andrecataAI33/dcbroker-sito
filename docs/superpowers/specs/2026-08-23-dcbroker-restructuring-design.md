# Documento di Specifica e Design: Ristrutturazione DC Broker

**Data:** 23 Agosto 2026  
**Autore:** Antigravity (AI Coding Assistant)  
**Stato:** In attesa di approvazione dell'utente

---

## 1. Obiettivo del Progetto
Ristrutturare l'attuale sezione Aziende del sito `https://www.dcbroker.it/aziende/` creando una moderna Single Page Application (SPA) in **React** supportata da un backend leggero in **FastAPI (Python)**. 
Il sistema includerà:
- Una landing page dal design moderno ed interattivo con effetti grafici d'avanguardia (Stile A: sfumature, giochi di luce, glassmorphism, effetti hover 3D).
- Un preventivatore rapido per polizze **CyberRisk**.
- Un portale clienti protetto da autenticazione tramite **Clerk** (con supporto a Google login) per consentire alle aziende di monitorare le proprie polizze e scambiare documenti.

---

## 2. Linee Guida di Design Visivo (Frontend)
- **Tema & Colori:** Integrazione dei colori originali di DC Broker:
  - Azzurro Primario: `#4eb7fe`
  - Grigio Scuro / Nero Istituzionale: `#333333`
  - Sfondo Neutro: Grigio chiarissimo `#f6f6f6` e Bianco `#ffffff`
- **Logo:** Utilizzo del logo originale DC Broker in formato PNG con sfondo trasparente per adattarsi dinamicamente ai cambi di sfondo.
- **Effetti:** Transizioni fluide su hover per le card di servizio, layout a griglia interattiva, e sezione Hero con sfumature scure e bagliori d'effetto.

---

## 3. Architettura dei Componenti

### 3.1. Frontend (React)
- **Componenti Pubblici:**
  - `HeroSection`: Presentazione istituzionale con CTA per preventivi e contatti.
  - `ServicesGrid`: Griglia interattiva con hover 3D per evidenziare i 4 servizi principali:
    1. *CyberRisk* (core)
    2. *Polizza D&O* (core)
    3. *Cauzioni & Fideiussioni* (core)
    4. *Assicurazione Credito* (core)
  - `QuotingWizard`: Processo a più passaggi per raccogliere i dati di CyberRisk ed elaborare un preventivo stimato.
- **Componenti Privati (Portale Clienti):**
  - `ClerkAuthProvider`: Gestione del login/registrazione tramite Clerk.
  - `ClientDashboard`: Vista delle polizze attive, stato dei pagamenti, e scadenze.
  - `DocumentManager`: Interfaccia di upload/download dei documenti contrattuali.

### 3.2. Backend (FastAPI / Python)
- **Moduli API:**
  - `/api/quotes`: Endpoint POST per calcolare la tariffa CyberRisk in base al fatturato ed alle misure di sicurezza dichiarate.
  - `/api/policies`: Endpoint protetti (tramite JWT di Clerk) per elencare le polizze del cliente e gestire lo storico.
  - `/api/documents`: Endpoint per l'upload sicuro e la firma dei documenti (integrazione con storage).

### 3.3. Database & Integrazioni
- **Database:** SQLite/PostgreSQL gestito tramite **MCP Toolbox for Databases** per consentire l'interoperabilità e il controllo del DB da parte dell'agente.
- **Autenticazione:** Integrazione SDK di **Clerk** lato frontend e convalida dei JWT lato backend FastAPI.

---

## 4. Piano di Rilascio e TDD
1. **Scaffolding:** Configurazione dei repository frontend e backend con test unitari iniziali (Pytest per FastAPI, Vitest/Jest per React).
2. **Implementazione TDD:** Sviluppo guidato dai test degli endpoint di calcolo preventivi e della dashboard utente.
3. **Integrazione Clerk & Database:** Collegamento dei flussi di autenticazione e persistenza dei preventivi.
