// This file centralizes all mock data to keep UI components clean before Supabase integration.

// --- CLIENT DASHBOARD DATA ---
export const dashboardServices = [
  {
    id: "web",
    name: "Web Development",
    icon: "web",
    progress: 75,
    status: "In Progress",
    description: "Custom e-commerce platform with payment integration",
    team: ["Asif", "Manju"],
    deadline: "August 20, 2026",
    deliverables: ["Homepage UI", "Database Schema", "API Endpoints"],
  },
  {
    id: "app",
    name: "Mobile App",
    icon: "smartphone",
    progress: 40,
    status: "In Progress",
    description: "React Native app for iOS and Android",
    team: ["Buden", "Vinaya"],
    deadline: "September 15, 2026",
    deliverables: ["App Wireframes", "Navigation Structure"],
  },
  {
    id: "data",
    name: "Data Analytics",
    icon: "analytics",
    progress: 20,
    status: "Planning",
    description: "Dashboard with real-time analytics",
    team: ["Asif"],
    deadline: "October 1, 2026",
    deliverables: ["Requirements Doc"],
  },
];

export const dashboardMeetings = [
  {
    id: 1,
    title: "Sprint Review",
    date: "May 15, 2026",
    time: "3:00 PM",
    type: "Video Call",
  },
  {
    id: 2,
    title: "Design Approval",
    date: "May 18, 2026",
    time: "11:00 AM",
    type: "In-Person",
  },
];

export const dashboardUpdates = [
  {
    id: 1,
    text: "Homepage design approved",
    time: "2 hours ago",
    by: "Asif K",
  },
  {
    id: 2,
    text: "API documentation completed",
    time: "5 hours ago",
    by: "Manjunath N",
  },
  {
    id: 3,
    text: "Mobile wireframes ready for review",
    time: "1 day ago",
    by: "Buden Sab",
  },
];

// --- REVIEWS PAGE DATA ---
export const featuredReview = {
  name: "Green Build Constructions",
  role: "Management Team",
  rating: 5,
  review: "Aster Tech didn't just build us a website; they transformed our entire digital identity. From the initial consultation to the final deployment, their enterprise-grade approach was evident. Our online lead generation has skyrocketed by 300% since the launch of the new Luminal Frontier design.",
  image: "GB"
};

export const reviews = [
  {
    id: 1,
    name: "Sarah Mitchell",
    company: "TechFlow Inc.",
    role: "CEO & Founder",
    avatar: "SM",
    rating: 5,
    review: "Aster Tech transformed our outdated website into a modern digital experience. Their attention to detail and understanding of our brand was exceptional. Revenue increased by 40% within three months of launch.",
    color: "primary",
    delay: "0",
  },
  {
    id: 2,
    name: "Raj Patel",
    company: "HealthFirst",
    role: "Director of Operations",
    avatar: "RP",
    rating: 5,
    review: "The healthcare app they built for us has revolutionized patient engagement. Telemedicine appointments increased by 200%. The team was professional and understood our compliance requirements perfectly.",
    color: "secondary",
    delay: "100",
  },
  {
    id: 3,
    name: "Emma Chen",
    company: "RetailMax",
    role: "Marketing Head",
    avatar: "EC",
    rating: 5,
    review: "Their ML-powered analytics dashboard gave us insights we never knew existed. Inventory waste reduced by 35% and our forecasting accuracy improved dramatically. Highly recommend!",
    color: "primary-container",
    delay: "200",
  },
  {
    id: 4,
    name: "Michael Torres",
    company: "UrbanFit",
    role: "Product Manager",
    avatar: "MT",
    rating: 5,
    review: "The fitness tracking app exceeded all expectations. Integration with wearables was seamless and user retention is through the roof. Our premium subscriptions grew 150% post-launch.",
    color: "secondary",
    delay: "0",
  },
  {
    id: 5,
    name: "David Kim",
    company: "EduPath",
    role: "CTO",
    avatar: "DK",
    rating: 5,
    review: "Aster Tech built our entire learning platform from scratch. The React Native app works flawlessly across iOS and Android. Student completion rates improved by 60%. Incredible work!",
    color: "primary",
    delay: "100",
  },
  {
    id: 6,
    name: "Lisa Wang",
    company: "ShopSmart",
    role: "E-Commerce Director",
    avatar: "LW",
    rating: 5,
    review: "Our new e-commerce platform handles 10x more traffic than before. Page load times dropped by 70% and conversion rates doubled. The SEO work also brought us 250% more organic traffic.",
    color: "primary-container",
    delay: "200",
  },
];

export const reviewStats = [
  { label: "Happy Clients", value: "45+", icon: "group", color: "primary" },
  { label: "Projects Delivered", value: "50+", icon: "task_alt", color: "secondary" },
  { label: "5-Star Rating", value: "98%", icon: "star", color: "primary-container" },
  { label: "Client Retention", value: "92%", icon: "favorite", color: "primary" },
];
