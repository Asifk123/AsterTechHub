export const stats = [
  { label: "Total Projects", value: "24", icon: "folder", change: "+2 this month", color: "primary" },
  { label: "Active Clients", value: "18", icon: "group", change: "+3 this month", color: "secondary" },
  { label: "Revenue", value: "₹48.5K", icon: "payments", change: "+12% vs last month", color: "primary" },
  { label: "Pending Approvals", value: "5", icon: "verified_user", change: "Requires Action", color: "secondary" },
];

export const recentProjects = [
  { 
    id: 1, name: "E-Commerce Platform", client: "TechFlow Inc.", status: "In Progress", progress: 65, value: "₹8,500",
    deadline: "Aug 20, 2026", team: "Asif, Manju", deliverables: "Homepage UI, Database Schema, API Endpoints",
    activityLog: [{ id: 1, text: "Initial wireframes approved", time: "2 days ago", type: "check" }]
  },
  { 
    id: 2, name: "Mobile App v2", client: "StartupXYZ", status: "Review", progress: 90, value: "₹12,000",
    deadline: "Sep 15, 2026", team: "Buden, Vinaya", deliverables: "App Wireframes, Navigation Structure",
    activityLog: [{ id: 2, text: "Sent to client for final review", time: "5 hours ago", type: "send" }]
  },
  { 
    id: 3, name: "Data Analytics", client: "DataCorp", status: "Planning", progress: 25, value: "₹6,500",
    deadline: "Oct 1, 2026", team: "Asif", deliverables: "Requirements Doc, Data Schema",
    activityLog: [{ id: 3, text: "Kickoff meeting completed", time: "1 week ago", type: "event" }]
  },
  { 
    id: 4, name: "Brand Refresh", client: "CreativeCo", status: "In Progress", progress: 45, value: "₹3,200",
    deadline: "Nov 5, 2026", team: "Manju", deliverables: "Logo Design, Color Palette",
    activityLog: []
  },
  { 
    id: 5, name: "Green Build Website", client: "Green Build", status: "In Progress", progress: 85, value: "₹15,000",
    deadline: "Aug 15, 2026", team: "Asif, Vinaya", deliverables: "Main Landing Page, Sustainability Dashboard",
    activityLog: [
      { id: 1, text: "Initial layout approved", time: "3 days ago", type: "check" },
      { id: 2, text: "Deployment set for next week", time: "Yesterday", type: "event" }
    ]
  },
];

export const teamPerformance = [
  { name: "Manjunath N", role: "Operational Director", tasks: 8, completed: 6, avatar: "MP" },
  { name: "Buden Sab I ", role: "Managing Director", tasks: 5, completed: 4, avatar: "RS" },
  { name: "Vinaya Kashi", role: "Marketing Leader", tasks: 12, completed: 10, avatar: "VK" },
  { name: "Asif K", role: "CEO", tasks: 4, completed: 3, avatar: "AK" },
];

export type Meeting = {
  id: number;
  title: string;
  description: string;
  time: string;
  date: string;
  status: "Active" | "Completed";
  priority: "High" | "Normal";
};

export const teamMeetings: Meeting[] = [
  { id: 1, title: "Product Planning & Sprint Kickoff", description: "All team members must attend. We will discuss the Supabase integration strategy.", time: "02:00 PM", date: "Today", status: "Active", priority: "High" }
];

export const pendingRequests = [
  { id: 101, name: "Rahul Sharma", email: "rahul@example.com", type: "Potential Client", date: "2 hours ago" },
  { id: 102, name: "Sneha Kapoor", email: "sneha.k@dev.com", type: "Team Applicant", date: "5 hours ago" },
  { id: 103, name: "Vikram Singh", email: "vikram@startup.io", type: "Potential Client", date: "Yesterday" },
];

export const messages = [
  { id: 1, from: "Sarah M", subject: "E-Commerce timeline question", time: "10 min ago", unread: true },
  { id: 2, from: "John D", subject: "Mobile app mockups approved", time: "1 hour ago", unread: true },
  { id: 3, from: "Emily R", subject: "Budget discussion needed", time: "3 hours ago", unread: false },
];

export const invoices = [
  { id: "INV-001", client: "TechFlow Inc.", amount: "₹4,250", status: "Paid", date: "Mar 15" },
  { id: "INV-002", client: "StartupXYZ", amount: "₹6,000", status: "Pending", date: "Mar 20" },
  { id: "INV-003", client: "DataCorp", amount: "₹3,250", status: "Overdue", date: "Mar 10" },
];

export type TaskStatus = "Todo" | "InProgress" | "Review" | "Done";

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: string; // avatar initials
  priority: "High" | "Medium" | "Low";
}

export const initialTasks: KanbanTask[] = [
  { id: "t1", title: "Setup Database", description: "Initialize Supabase and create schemas", status: "Todo", assignee: "AK", priority: "High" },
  { id: "t2", title: "Design Login Page", description: "Create Figma mockups for auth flow", status: "InProgress", assignee: "RS", priority: "Medium" },
  { id: "t3", title: "Fix Navbar Bug", description: "Mobile menu not closing on click", status: "Review", assignee: "MP", priority: "Low" },
  { id: "t4", title: "Client Meeting Prep", description: "Prepare slides for DataCorp pitch", status: "Todo", assignee: "PN", priority: "High" },
  { id: "t5", title: "Optimize Images", description: "Compress assets for better Lighthouse score", status: "Done", assignee: "MP", priority: "Low" },
];
