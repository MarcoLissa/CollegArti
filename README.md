# CollegArti

CollegArti è un'applicazione web dedicata alla gestione di eventi artistici. Gli utenti possono visualizzare eventi, richiedere di partecipare a eventi come artisti e caricare immagini relative agli eventi.

## Indice

1. [Panoramica](#panoramica)
2. [Requisiti](#requisiti)
3. [Installazione](#installazione)
4. [Configurazione](#configurazione)
5. [Utilizzo](#utilizzo)
6. [Contribuire](#contribuire)
7. [Licenza](#licenza)

## Panoramica

CollegArti permette agli utenti di:
- Visualizzare i dettagli degli eventi artistici.
- Richiedere di partecipare a eventi se sono artisti.
- Caricare e visualizzare immagini degli eventi.

## Requisiti

Per eseguire l'applicazione, è necessario avere:
- [Node.js](https://nodejs.org/) (versione LTS consigliata)
- [Angular CLI](https://angular.io/cli)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

## Installazione

1. **Clona il repository:**

   ```bash
   git clone https://github.com/tuo-username/collegarti.git
   ```

2. **Naviga nella directory del progetto:**

   ```bash
   cd collegarti
   ```

3. **Installa le dipendenze:**

   ```bash
   npm install
   ```

4. **Configura Firebase:**

   - Accedi alla console di Firebase: [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuovo progetto o usa uno esistente.
   - Configura Firestore e Storage come descritto nei passaggi precedenti.

## Configurazione

1. **Configura le variabili di ambiente:**

   Crea un file `.env` nella radice del progetto e aggiungi le seguenti variabili (modifica con i valori reali):

   ```env
   FIREBASE_API_KEY=tuo_api_key
   FIREBASE_AUTH_DOMAIN=tuo_progetto.firebaseapp.com
   FIREBASE_PROJECT_ID=tuo_progetto
   FIREBASE_STORAGE_BUCKET=tuo_progetto.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=tuo_messaging_sender_id
   FIREBASE_APP_ID=tuo_app_id
   ```

2. **Configura CORS per Firebase Storage:**

   - Crea un file `cors.json` con la configurazione CORS desiderata:

     ```json
     [
       {
         "origin": ["*"],
         "method": ["GET", "HEAD", "PUT", "POST"],
         "responseHeader": ["Content-Type"],
         "maxAgeSeconds": 3600
       }
     ]
     ```

   - Usa il comando `gsutil` per applicare la configurazione:

     ```bash
     gsutil cors set cors.json gs://tuo_progetto.appspot.com
     ```

## Utilizzo

1. **Avvia l'applicazione in modalità di sviluppo:**

   ```bash
   ng serve
   ```

   L'app sarà disponibile all'indirizzo [http://localhost:4200](http://localhost:4200).

2. **Compila e distribuisci l'app:**

   Per creare una versione di produzione dell'app:

   ```bash
   ng build --prod
   ```

   Distribuisci l'app su Firebase Hosting:

   ```bash
   firebase deploy
   ```

## Contribuire

Se desideri contribuire al progetto, segui questi passaggi:

1. **Fork del repository**
2. **Crea un branch per le tue modifiche**
3. **Fai le tue modifiche e aggiungi i tuoi commit**
4. **Fai push delle tue modifiche al tuo fork**
5. **Apri una pull request**

## Licenza

Questo progetto è concesso in licenza sotto la Licenza MIT. Consulta il file [LICENSE](LICENSE) per ulteriori dettagli.
