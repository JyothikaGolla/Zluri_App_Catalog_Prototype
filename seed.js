const mongoose = require('mongoose');
const App = require('./backend/models/App');
const Request = require('./backend/models/Request');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    // Delete existing data first
    await App.deleteMany({});
    await Request.deleteMany({});

    const apps = [
      {
        name: "Slack",
        description: "Team communication and collaboration platform with channels, direct messaging, and file sharing",
        category: "Communication",
        department: ["Engineering", "Marketing", "Sales", "HR", "Finance"],
        rating: 4.5,
        users: 1250,
        features: ["Real-time messaging", "File sharing", "Video calls", "App integrations", "Channel organization"],
        accessRequirements: "Auto-approved for all employees",
        icon: "💬",
        status: "Active"
      },
      {
        name: "Zoom",
        description: "Video conferencing and online meeting platform with HD video, screen sharing, and recording",
        category: "Communication",
        department: ["Engineering", "Marketing", "Sales", "HR", "Finance"],
        rating: 4.3,
        users: 1500,
        features: ["HD video meetings", "Screen sharing", "Recording", "Webinars", "Breakout rooms"],
        accessRequirements: "Auto-approved for all employees",
        icon: "📹",
        status: "Active"
      },
      {
        name: "Jira",
        description: "Project management and issue tracking tool for agile software development teams",
        category: "Productivity",
        department: ["Engineering"],
        rating: 4.1,
        users: 340,
        features: ["Issue tracking", "Sprint planning", "Kanban boards", "Reporting", "Custom workflows"],
        accessRequirements: "Team lead approval required",
        icon: "📋",
        status: "Active"
      },
      {
        name: "Confluence",
        description: "Team wiki and documentation platform for creating, sharing, and collaborating on content",
        category: "Productivity",
        department: ["Engineering", "Marketing", "HR"],
        rating: 4.0,
        users: 420,
        features: ["Wiki pages", "Team spaces", "Document collaboration", "Templates", "Search"],
        accessRequirements: "Manager approval required",
        icon: "📚",
        status: "Active"
      },
      {
        name: "GitHub",
        description: "Source code management and collaboration platform with version control and CI/CD",
        category: "Development",
        department: ["Engineering"],
        rating: 4.7,
        users: 280,
        features: ["Git repositories", "Pull requests", "Code review", "Actions CI/CD", "Project boards"],
        accessRequirements: "Engineering manager approval",
        icon: "🐙",
        status: "Active"
      },
      {
        name: "Google Workspace",
        description: "Comprehensive suite including Gmail, Docs, Drive, Sheets, and collaboration tools",
        category: "Productivity",
        department: ["Engineering", "Marketing", "Sales", "HR", "Finance"],
        rating: 4.4,
        users: 1600,
        features: ["Email", "Document editing", "Cloud storage", "Video meetings", "Calendar"],
        accessRequirements: "Auto-approved for all employees",
        icon: "📧",
        status: "Active"
      },
      {
        name: "Microsoft Teams",
        description: "Team collaboration platform with chat, video meetings, and Office 365 integration",
        category: "Communication",
        department: ["Engineering", "Marketing", "Sales", "HR", "Finance"],
        rating: 4.2,
        users: 890,
        features: ["Team chat", "Video conferencing", "File sharing", "Office integration", "Apps"],
        accessRequirements: "Manager approval required",
        icon: "👥",
        status: "Active"
      },
      {
        name: "Salesforce",
        description: "Customer relationship management platform for managing leads, opportunities, and customer data",
        category: "Sales",
        department: ["Sales", "Marketing"],
        rating: 4.2,
        users: 890,
        features: ["Lead management", "Opportunity tracking", "Reports & analytics", "Mobile app", "Automation"],
        accessRequirements: "Sales manager approval + training required",
        icon: "📈",
        status: "Active"
      },
      {
        name: "Asana",
        description: "Project and task management tool for organizing work and tracking team progress",
        category: "Productivity",
        department: ["Marketing", "HR"],
        rating: 4.3,
        users: 560,
        features: ["Task management", "Project timelines", "Team collaboration", "Custom fields", "Reporting"],
        accessRequirements: "Team lead approval",
        icon: "✅",
        status: "Active"
      },
      {
        name: "ZoomInfo",
        description: "Business intelligence and data platform for sales prospecting and market research",
        category: "Sales",
        department: ["Sales", "Marketing"],
        rating: 4.0,
        users: 120,
        features: ["Contact database", "Company insights", "Email finder", "CRM integration", "Analytics"],
        accessRequirements: "Sales director approval + budget approval",
        icon: "🔍",
        status: "Active"
      },
      {
        name: "Figma",
        description: "Collaborative design and prototyping tool for creating user interfaces and experiences",
        category: "Development",
        department: ["Engineering", "Marketing"],
        rating: 4.8,
        users: 340,
        features: ["Real-time collaboration", "Prototyping", "Design systems", "Developer handoff", "Version control"],
        accessRequirements: "Team lead approval",
        icon: "🎨",
        status: "Active"
      },
      {
        name: "Notion",
        description: "All-in-one workspace for notes, documents, databases, and team collaboration",
        category: "Productivity",
        department: ["Engineering", "Marketing", "HR"],
        rating: 4.6,
        users: 670,
        features: ["Document creation", "Database management", "Task tracking", "Templates", "Team wikis"],
        accessRequirements: "Self-service approval",
        icon: "📝",
        status: "Active"
      },
      {
        name: "HubSpot",
        description: "Inbound marketing, sales, and customer service platform with CRM capabilities",
        category: "Marketing",
        department: ["Marketing", "Sales"],
        rating: 4.4,
        users: 450,
        features: ["Marketing automation", "Lead scoring", "Email campaigns", "Analytics", "CRM"],
        accessRequirements: "Marketing manager approval",
        icon: "🚀",
        status: "Active"
      },
      {
        name: "Tableau",
        description: "Data visualization and business intelligence platform for creating interactive dashboards",
        category: "Productivity",
        department: ["Engineering", "Marketing", "Sales", "Finance"],
        rating: 4.3,
        users: 180,
        features: ["Data visualization", "Interactive dashboards", "Data connections", "Sharing", "Mobile"],
        accessRequirements: "Manager + IT approval required",
        icon: "📊",
        status: "Active"
      },
      {
        name: "Adobe Creative Cloud",
        description: "Complete suite of creative applications including Photoshop, Illustrator, and InDesign",
        category: "Marketing",
        department: ["Marketing"],
        rating: 4.5,
        users: 89,
        features: ["Photo editing", "Vector graphics", "Layout design", "Video editing", "Cloud sync"],
        accessRequirements: "Creative director approval + license cost approval",
        icon: "🎭",
        status: "Active"
      }
    ];

    const insertedApps = await App.insertMany(apps);
    console.log("Enhanced sample apps added!");

    // Add some sample requests
    const sampleRequests = [
      {
        userId: "1",
        appId: insertedApps[0]._id, // Slack
        status: "Approved",
        requestedBy: "John Doe",
        requestedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        approvedBy: "Jane Smith",
        approvedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        justification: "Need for team communication",
        priority: "High"
      },
      {
        userId: "1",
        appId: insertedApps[7]._id, // Salesforce
        status: "Pending",
        requestedBy: "John Doe",
        requestedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        justification: "Required for new project management",
        priority: "Medium"
      },
      {
        userId: "1",
        appId: insertedApps[10]._id, // Figma
        status: "Approved",
        requestedBy: "John Doe",
        requestedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        approvedBy: "Tech Lead",
        approvedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        justification: "Design collaboration tool needed",
        priority: "Medium"
      }
    ];

    await Request.insertMany(sampleRequests);
    console.log("Sample requests added!");

    mongoose.disconnect();
  })
  .catch(err => console.error(err));
