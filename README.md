# Ravindra Pawar - Portfolio Website

A professional, full-stack portfolio website showcasing my skills, experience, and projects as a Software Developer at PRIC Technology Private Limited.

## 🌐 Live Demo

[Visit Portfolio](https://portofolio-blond-gamma.vercel.app/)

## 📋 Features

- **Responsive Design** — Optimized for desktop, tablet, and mobile devices
- **Interactive Animations** — Smooth, engaging transitions and letter animations using GSAP and React
- **Skills Visualization** — 3D tag cloud showcasing tech stack
- **Project Showcase** — Detailed project cards with descriptions and links
- **Experience Timeline** — Professional work history with key achievements
- **Contact Form** — Integrated EmailJS for direct messaging with loading states and success modals
- **Dark Theme** — Modern, eye-catching design with cyan/purple accent colors
- **Firebase Integration** — Firestore database and Cloud Storage for data persistence

## 🛠️ Tech Stack

**Frontend:**
- React
- Sass/SCSS
- React-Bootstrap
- GSAP (animations)

**Backend & Services:**
- Firebase (Firestore Database, Cloud Storage)
- Google Cloud Console (OAuth 2.0 Authentication)
- EmailJS (contact form)

**Tools & Libraries:**
- React Router v6 (routing)
- Leaflet (maps)
- FontAwesome (icons)
- React Loaders (loading animations)
- TagCloud (3D tag visualization)

## 📁 Project Structure

```
src/
├── components/
│   ├── About/              # About section with skills intro
│   ├── Contact/            # Contact form with EmailJS integration
│   ├── Experience/         # Work experience and achievements
│   ├── Skills/             # Technical skills and expertise
│   ├── Projects/           # Portfolio projects showcase
│   ├── Education/          # Education background
│   ├── Certificates/       # Certifications and credentials
│   ├── Home/               # Landing page with logo animation
│   ├── Dashboard/          # (Protected) User dashboard
│   ├── Login/              # Google Sign-In integration
│   └── ...
├── firebase.js             # Firebase configuration
├── App.js                  # Main app component
└── index.js                # React entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (see `.nvmrc` for version pinning)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ravindra-24/Portofolio.git
   cd Portofolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # EmailJS Configuration
   REACT_APP_EMAILJS_SERVICE_ID=your_service_id
   REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
   REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key

   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

   **Note:** Never commit `.env.local` to version control. It's listed in `.gitignore`.

### Development

Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000). Changes auto-reload.

### Build

Create a production-optimized build:
```bash
npm run build
```

Output is in the `build/` folder, ready for deployment.

### Testing

Run tests:
```bash
npm test
```

## 📧 Contact Form Setup

The contact form uses **EmailJS** for email delivery without a backend server.

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template with variables: `name`, `email`, `subject`, `message`
4. Add your Service ID, Template ID, and Public Key to `.env.local`

**Test:** Fill out the contact form to verify it works. You'll see a loading state and success/error modal.

## 🔐 Security

- All sensitive credentials are stored in `.env.local` (not committed to version control)
- Firebase Firestore security rules protect real-time data
- Google OAuth 2.0 credentials stored securely for authentication
- EmailJS public key is intentionally exposed (safe by design)
- User authentication uses Google Sign-In via Google Cloud Console

## 📝 Portfolio CMS Setup

The protected `/dashboard` manages Home, About, Skills, Projects, Experience,
Education, Certificates, and the downloadable CV. Public pages continue using
the original content until the dashboard migration completes.

### 1. Enable authentication

In Firebase Console, open **Authentication → Sign-in method** and enable the
Google provider. Add the deployed domain to **Authentication → Settings →
Authorized domains**.

### 2. Bootstrap the administrator

1. Sign in at `/dashboard`.
2. The access-denied page displays the signed-in Firebase UID.
3. In Firestore Console, create a collection named `admins`.
4. Create an empty document whose document ID is that exact UID.
5. Sign out and sign back in.

An authenticated Google account is not an administrator unless its UID exists
in this collection.

### 3. Deploy Firebase rules and indexes

Authenticate the Firebase CLI and associate it with the Firebase project:

```bash
npx firebase login
npx firebase use --add
npx firebase deploy --only firestore:rules,firestore:indexes,storage
```

Wait for Firestore indexes to finish building before running the migration.
The rules allow public reads of published portfolio records and restrict all
content and file mutations to administrator UIDs.

### 4. Import and verify existing content

1. Open `/dashboard` as the administrator.
2. Choose **Import existing portfolio**.
3. Keep the page open while bundled project images upload.
4. Verify each dashboard section and its public page.

The importer uses deterministic IDs and can be safely retried. It creates
`portfolioMeta/migration-v1` only in the final successful database batch; that
marker switches the public site from its legacy sources to the CMS collections.

### CMS media limits

- Project and certificate images: JPEG, PNG, or WebP, maximum 5 MB.
- CV: PDF, maximum 10 MB.
- New uploads are stored below `portfolio/{section}/{documentId}`.

### CMS tests

```bash
npm run test:ci
npm run test:rules
npm run build
```

The rules test requires Java because the Firebase Firestore emulator runs on
the JVM.

## 📱 Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px – 1024px
- **Desktop:** > 1024px

## 🎨 Customization

### Colors & Theme

Edit `src/App.scss` and component SCSS files to customize colors and styling.

Current accent color: `#4FEFFF` (cyan)

### Content

Update component content in:
- `src/components/About/index.js` — About section
- `src/components/Experience/data.js` — Work experience
- `src/components/Projects/data.js` — Projects
- `src/components/Education/Education.js` — Education details
- `src/components/Skills/Skills.js` — Skills section

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import the repository
4. Add environment variables in Settings > Environment Variables
5. Deploy!

**Note:** Vercel requires Node.js 18+. The `engines` field in `package.json` specifies Node.js >= 20.

### Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build/`
4. Add environment variables in Site Settings > Build & Deploy > Environment
5. Deploy!

### Other Platforms

Ensure your hosting platform supports:
- Node.js 20+ or equivalent
- Static file serving (React build output)
- Environment variable configuration

## 📈 Performance

- **Load Time:** ~30% faster via optimized Next.js builds and Firebase caching
- **Uptime:** 99.9% via Firebase hosting and CDN
- **Mobile Score:** 90+ Lighthouse audit

## 📝 License

This project is open source and available under the MIT License.

## 👤 About Me

I'm a **Software Developer** at PRIC Technology Private Limited with expertise in:
- Full-stack web development (Next.js, React)
- Backend services (Firebase Firestore, Cloud Storage, Google Cloud Functions)
- Database design (Firestore, MongoDB)
- Authentication (Google OAuth 2.0, Firebase Auth)
- UI/UX implementation
- Real-time analytics & dashboarding

**Quick Links:**
- [LinkedIn](https://www.linkedin.com/in/ravindra-shrimant-pawar/)
- [GitHub](https://github.com/Ravindra-24)
- [Email](mailto:ravindra.pawar.mit@gmail.com)

---
