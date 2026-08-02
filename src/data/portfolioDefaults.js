import projects from '../components/Projects/data'
import experience from '../components/Experience/data'

export const SKILL_CATEGORY_OPTIONS = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'databases-cloud', label: 'Databases & Cloud' },
  { value: 'mobile-testing-tools', label: 'Mobile, Testing & Tools' },
  { value: 'other', label: 'Other' },
]

export const DEFAULT_SITE_CONTENT = {
  home: {
    name: 'Ravindra',
    role: 'web developer.',
    tagline: 'Front-End Development / React.JS / MERN-Stack',
  },
  about: {
    paragraphs: [
      "I'm a Software Developer at PRIC Technology Private Limited with expertise in Next.js, React, Firebase, and Google Cloud Functions. I implement features for the core product including Sessions, Events, Courses, Telegram group subscriptions, and user-facing modules like Booking pages, Account management with purchase history, form editing, and Ticket transfer functionality. I also built an advanced Event QR Scanning System with real-time analytics, activity-based ticket validation, and Bluetooth printing capabilities.",
      "Previously, I contributed to Xpatris, a sponsored college project, working on authentication and admin modules. With a B.Tech from MIT Aurangabad (2023) and a Diploma from Government Polytechnic Jalna, I'm driven by building robust, user-centric solutions that solve real-world problems and create lasting impact.",
    ],
  },
  skills: {
    paragraphs: [
      'I have strong front-end skills with HTML, CSS, and JavaScript, and extensive experience building interfaces with React and Redux. I build full-stack applications using the MERN stack and Next.js, and work with Firebase (Auth, Firestore, Storage) and Google Cloud Functions on the backend. I also use Tailwind CSS and React-Bootstrap for UI, and follow CI/CD and testing practices to ensure reliability.',
      'At PRIC Technology I implemented product features including booking pages, account management, Sessions, Events, Courses, ticket transfers, editable responses, Telegram group subscriptions, and real-time analytics dashboards. I also developed an Event QR Scanning System with instant analytics and activity-based ticket validation.',
    ],
  },
  social: {
    linkedinUrl: 'https://www.linkedin.com/in/ravindra-shrimant-pawar/',
    githubUrl: 'https://github.com/Ravindra-24',
  },
  contact: {
    displayName: 'Ravindra Pawar',
    email: 'ravindra.pawar.mit@gmail.com',
    phone: '',
    location: 'Hadapsar, Pune, Maharashtra, India',
    portfolioUrl: 'https://ravindrapawar.vercel.app/',
    mapLatitude: 18.5089,
    mapLongitude: 73.9365,
  },
  cv: {
    fileUrl: '',
    storagePath: '',
    fileName: '',
  },
}

export const mergeSiteContentDefaults = (stored = {}) => ({
  ...DEFAULT_SITE_CONTENT,
  ...stored,
  home: { ...DEFAULT_SITE_CONTENT.home, ...stored.home },
  about: { ...DEFAULT_SITE_CONTENT.about, ...stored.about },
  skills: { ...DEFAULT_SITE_CONTENT.skills, ...stored.skills },
  social: { ...DEFAULT_SITE_CONTENT.social, ...stored.social },
  contact: { ...DEFAULT_SITE_CONTENT.contact, ...stored.contact },
  cv: { ...DEFAULT_SITE_CONTENT.cv, ...stored.cv },
})

export const DEFAULT_SKILLS = [
  'ReactJS',
  'NextJS',
  'JavaScript',
  'CSS3',
  'HTML',
  'NodeJS',
  'ExpressJS',
  'MongoDB',
  'Redux',
  'Firebase',
  'JWT',
  'Babel',
  'Webpack',
  'AWS EC2',
  'CI/CD pipeline',
  'AWS S3',
].map((name, index) => ({
  id: `seed-skill-${index + 1}`,
  name,
  category: 'other',
  order: index,
  published: true,
}))

export const DEFAULT_EDUCATION = [
  {
    id: 'seed-education-1',
    institution:
      'G. S. Mandal Maharashtra Institute of Technology, Chh. Sambhajinagar',
    degree: 'Bachelor of Technology in Computer Science and Engineering',
    dates: '2020 - 2023',
    order: 0,
    published: true,
  },
  {
    id: 'seed-education-2',
    institution: 'Government Polytechnic, Jalna',
    degree: 'Diploma in Computer Engineering',
    dates: '2017 - 2020',
    order: 1,
    published: true,
  },
]

export const DEFAULT_PROJECTS = projects.map((project, index) => ({
  ...project,
  id: `seed-project-${project.id}`,
  skills:
    typeof project.skills === 'string'
      ? project.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean)
      : project.skills,
  websiteUrl: project.url,
  githubUrl: project.github,
  imageUrl: project.image,
  storagePath: '',
  order: index,
  published: true,
}))

export const DEFAULT_EXPERIENCE = experience.map((item, index) => ({
  ...item,
  id: `seed-experience-${item.id}`,
  period: item.startEnd,
  order: index,
  published: true,
}))
