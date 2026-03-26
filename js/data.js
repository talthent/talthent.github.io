const CAREER_DATA = [
  {
    year: 2014,
    device: { model: 'iPhone 6', era: 'classic', ios: 8 },
    company: 'Life On Air',
    role: 'iOS Developer',
    apps: [
      { name: 'Yevvo', icon: 'assets/yevvo.png' },
      { name: 'Meerkat', icon: 'assets/meerkat.png' }
    ],
    highlights: [
      'Joined Yevvo mid-project and rewrote major portions of the codebase',
      'Started working on Meerkat — live broadcast app on Twitter\'s social graph'
    ],
    wallpaper: 'assets/wallpapers/ios8.png'
  },
  {
    year: 2015,
    device: { model: 'iPhone 6s', era: 'classic', ios: 9 },
    company: 'Life On Air',
    role: 'iOS Developer',
    apps: [
      { name: 'Meerkat', icon: 'assets/meerkat.png' },
      { name: 'Houseparty', icon: 'assets/houseparty.png' }
    ],
    highlights: [
      'Meerkat gained major traction on Twitter\'s social graph',
      'Began building Houseparty from scratch — end-to-end architecture and product design'
    ],
    wallpaper: 'assets/wallpapers/ios9.png'
  },
  {
    year: 2016,
    device: { model: 'iPhone 7', era: 'classic', ios: 10 },
    company: 'Life On Air',
    role: 'iOS Developer',
    apps: [
      { name: 'Houseparty', icon: 'assets/houseparty.png' }
    ],
    highlights: [
      'Houseparty reached #2 on the overall App Store chart',
      'Integrated real-time messaging network and live video platform'
    ],
    wallpaper: 'assets/wallpapers/ios10.jpeg'
  },
  {
    year: 2017,
    device: { model: 'iPhone X', era: 'notch', ios: 11 },
    company: 'Glance Fashion',
    role: 'Senior iOS Developer',
    apps: [
      { name: 'Glance', icon: 'assets/glance.png' }
    ],
    highlights: [
      'Glance Fashion — social media platform for fashion videos',
      '#memory — built the macOS brain extension note-taking app, code review for iOS'
    ],
    wallpaper: 'assets/wallpapers/ios11.jpeg'
  },
  {
    year: 2018,
    device: { model: 'iPhone XS', era: 'notch', ios: 12 },
    company: 'Lemonade',
    role: 'Senior iOS Developer',
    apps: [
      { name: 'Lemonade', icon: 'assets/lemonade.jpg' }
    ],
    highlights: [
      'Joined Lemonade — fast-growing InsurTech reimagining insurance',
      'Built the entire iOS app from the ground up including the core AI-powered chat'
    ],
    wallpaper: 'assets/wallpapers/ios12.jpeg'
  },
  {
    year: 2019,
    device: { model: 'iPhone 11 Pro', era: 'notch', ios: 13, material: 'steel' },
    company: 'Lemonade',
    role: 'Senior iOS Developer',
    apps: [
      { name: 'Lemonade', icon: 'assets/lemonade.jpg' },
      { name: 'Potluck', icon: 'assets/potluck.jpg' }
    ],
    highlights: [
      'Core chat feature powering onboarding, claims, and customer experience AI',
      'Co-founded Potluck Recipes with my wife — a cookbook app for family recipes'
    ],
    wallpaper: 'assets/wallpapers/ios13.png'
  },
  {
    year: 2020,
    device: { model: 'iPhone 12 Pro', era: 'flat', ios: 14, material: 'steel' },
    company: 'Lemonade',
    role: 'Senior iOS Developer',
    apps: [
      { name: 'Lemonade', icon: 'assets/lemonade.jpg' },
      { name: 'Potluck', icon: 'assets/potluck.jpg' }
    ],
    highlights: [
      'Lemonade IPO — helped expand from single app to global multi-product platform',
      'Promoted to Lead iOS Developer — guiding technical direction for the iOS team'
    ],
    wallpaper: 'assets/wallpapers/ios14.jpg'
  },
  {
    year: 2021,
    device: { model: 'iPhone 13 Pro', era: 'flat', ios: 15, material: 'steel' },
    company: 'Lemonade',
    role: 'Lead iOS Developer',
    apps: [
      { name: 'Lemonade', icon: 'assets/lemonade.jpg' },
      { name: 'Potluck', icon: 'assets/potluck.jpg' }
    ],
    highlights: [
      'Scaling the app through new product launches',
      'Improving performance, reliability, and developer experience across the mobile stack'
    ],
    wallpaper: 'assets/wallpapers/ios15.jpg'
  },
  {
    year: 2022,
    device: { model: 'iPhone 14 Pro', era: 'island', ios: 16, material: 'steel' },
    company: 'Lemonade',
    role: 'Mobile Platform Team Lead',
    apps: [
      { name: 'Lemonade', icon: 'assets/lemonade.jpg' },
      { name: 'Potluck', icon: 'assets/potluck.jpg' }
    ],
    highlights: [
      'Oversaw mobile platform architecture — scalability and consistency across products',
      'Mentored engineers and drove cross-platform collaboration'
    ],
    wallpaper: 'assets/wallpapers/ios16.jpg'
  },
  {
    year: 2023,
    device: { model: 'iPhone 15 Pro', era: 'island', ios: 17, material: 'titanium' },
    company: 'Lemonade',
    role: 'Engineering Manager',
    apps: [
      { name: 'Lemonade', icon: 'assets/lemonade.jpg' },
      { name: 'Potluck', icon: 'assets/potluck.jpg' }
    ],
    highlights: [
      'Led the Client & Experience Platform — unifying web and mobile foundations',
      'Managed a multidisciplinary team of mobile and frontend developers'
    ],
    wallpaper: 'assets/wallpapers/ios17.jpg'
  },
  {
    year: 2024,
    device: { model: 'iPhone 16 Pro', era: 'island', ios: 18, material: 'titanium' },
    company: 'Lemonade',
    role: 'Engineering Manager',
    apps: [
      { name: 'Lemonade', icon: 'assets/lemonade.jpg' },
      { name: 'Potluck', icon: 'assets/potluck.jpg' },
      { name: '#memory', icon: 'assets/memory.png' }
    ],
    highlights: [
      'Drove alignment, scalability, and impact across Lemonade\'s client technology stack',
      'Streamlined development across web and mobile platforms'
    ],
    wallpaper: 'assets/wallpapers/ios18.png'
  },
  {
    year: 2025,
    device: { model: 'iPhone 17 Pro', era: 'island', ios: 26, material: 'titanium' },
    company: 'Lemonade',
    role: 'Engineering Manager',
    apps: [
      { name: 'Lemonade', icon: 'assets/lemonade.jpg' },
      { name: 'Potluck', icon: 'assets/potluck.jpg' },
      { name: '#memory', icon: 'assets/memory.png' }
    ],
    highlights: [
      'Transitioned back to hands-on technical leadership',
      'Chose to return to what I love — building great mobile products'
    ],
    wallpaper: 'assets/wallpapers/ios26.jpg'
  },
  {
    year: 2026,
    device: { model: 'iPhone 17 Pro', era: 'island', ios: 26, material: 'titanium' },
    company: 'Lemonade',
    role: 'Mobile Tech Lead',
    apps: [
      { name: 'Lemonade', icon: 'assets/lemonade.jpg' },
      { name: 'Potluck', icon: 'assets/potluck.jpg' },
      { name: '#memory', icon: 'assets/memory.png' }
    ],
    highlights: [
      'Leading migration to SPM modular architecture with TCA and SwiftUI',
      'Pioneering AI-assisted development with Claude Code, Cursor & MCPs'
    ],
    wallpaper: 'assets/wallpapers/ios26.jpg'
  }
];

const ABOUT_DATA = {
  intro: 'I love working on products that obsess over tiny details — really thinking about what the user feels at every interaction.',
  personal: 'Outside of work I\'m a pianist who performs every once in a while, a swimmer, working on my silversmith skills, and a foodie when time allows. Married to Shani, father of two.',
  skills: {
    'Frameworks & Architecture': ['SwiftUI', 'TCA', 'Combine', 'UIKit', 'Swift Concurrency', 'SPM Modular Arch', 'Ionic Capacitor'],
    'Testing': ['XCTest', 'Snapshot Testing', 'UI Testing', 'OCR-based WebView Testing'],
    'Tools & CI/CD': ['Fastlane', 'GitHub Actions', 'Xcode Cloud', 'Custom CI Scripts'],
    'AI-Assisted Development': ['Claude Code', 'Cursor', 'MCP Integrations']
  },
  personal_interests: [
    { icon: '\u{1F3B9}', label: 'Pianist & performer' },
    { icon: '\u{1F3CA}', label: 'Swimming' },
    { icon: '\u{1F528}', label: 'Silversmithing' },
    { icon: '\u{1F37D}', label: 'Foodie' },
    { icon: '\u{1F3B5}', label: 'Military band commander' }
  ],
  contact: {
    location: 'Tel Aviv, Israel',
    phone: '+972 52 572 3333',
    email: 'talthent@gmail.com',
    linkedin: 'https://www.linkedin.com/in/tal-cohen-ios/',
    github: 'https://github.com/talthent'
  }
};

// CSS gradient fallbacks for iOS wallpapers
const WALLPAPER_GRADIENTS = {
  8:  'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
  9:  'linear-gradient(135deg, #667db6, #0082c8, #667db6)',
  10: 'linear-gradient(135deg, #2c3e50, #3498db)',
  11: 'linear-gradient(135deg, #0f9b8e, #24c6dc, #514a9d)',
  12: 'linear-gradient(135deg, #ff6e7f, #bfe9ff)',
  13: 'linear-gradient(135deg, #0a0a2e, #1a1a4e, #2d1b69)',
  14: 'linear-gradient(135deg, #a8edea, #fed6e3)',
  15: 'linear-gradient(135deg, #c9d6ff, #e2e2e2)',
  16: 'linear-gradient(135deg, #f12711, #f5af19)',
  17: 'linear-gradient(135deg, #fceabb, #f8b500)',
  18: 'linear-gradient(135deg, #4158d0, #c850c0, #ffcc70)',
  26: 'linear-gradient(135deg, #a18cd1, #fbc2eb)'
};
