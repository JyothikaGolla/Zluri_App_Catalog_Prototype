# 🚀 Zluri Employee App Catalog

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge)](https://jyothikagolla.github.io/Zluri_App_Catalog_Prototype/)
[![GitHub](https://img.shields.io/badge/Source%20Code-GitHub-black?style=for-the-badge&logo=github)](https://github.com/JyothikaGolla/Zluri_App_Catalog_Prototype)
[![Production API](https://img.shields.io/badge/API-Production-green?style=for-the-badge)](https://zlulri-app-prototype.onrender.com)

> **A modern, enterprise-grade employee application discovery platform that transforms chaotic software discovery into an intuitive, controlled experience.**

## 📖 Overview

The Zluri Employee App Catalog is a comprehensive solution designed to address the critical challenge of shadow IT and inefficient app discovery in enterprise environments. This self-service portal enables employees to discover, explore, and request access to approved organizational applications while providing IT teams with complete visibility and control over software provisioning.

### 🎯 Key Features

- **🔍 Smart App Discovery**: Advanced search and filtering with real-time results
- **👤 Personalized Recommendations**: Role-based app suggestions tailored to user departments
- **🎨 Modern UI/UX**: Glass-morphism design with smooth animations and responsive layout
- **📱 Three-View System**: Seamless navigation between All Apps, My Apps, and Pending Requests
- **⚡ Real-time Search**: Debounced search functionality with instant results
- **🔄 Request Management**: Streamlined approval workflows with status tracking
- **📊 Dynamic Statistics**: Live dashboard showing app counts and request status
- **🎭 Custom Components**: Professional dropdown components with smooth animations

## 🌟 Live Demo

### 🖥️ **Frontend Demo**: [jyothikagolla.github.io/Zluri_App_Catalog_Prototype](https://jyothikagolla.github.io/Zluri_App_Catalog_Prototype/)
### 🔗 **Full-Stack Application**: [zlulri-app-prototype.onrender.com](https://zlulri-app-prototype.onrender.com)

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup with modern structure
- **CSS3** - Glass-morphism design with advanced animations
- **JavaScript (ES6+)** - Vanilla JS with modern features
- **Responsive Design** - Mobile-first approach with flexible layouts

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **RESTful APIs** - JSON-based API architecture

### Deployment & DevOps
- **GitHub Pages** - Frontend static hosting
- **Render.com** - Full-stack application deployment
- **MongoDB Atlas** - Cloud database hosting
- **Environment Variables** - Secure configuration management

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/JyothikaGolla/Zluri_App_Catalog_Prototype.git
   cd Zluri_App_Catalog_Prototype
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create .env file in root directory
   echo "MONGO_URI=your_mongodb_connection_string" > .env
   ```

4. **Seed the database (optional)**
   ```bash
   node seed.js
   ```

5. **Start the development server**
   ```bash
   node server.js
   ```

6. **Access the application**
   - Open your browser and navigate to `http://localhost:5000`
   - The application serves both frontend and API endpoints

### Frontend-Only Development

For frontend-only development using the live API:

1. **Open the HTML file**
   ```bash
   # Using Live Server extension in VS Code
   # Or simply open index.html in your browser
   ```

2. **The frontend automatically connects to the production API**
   - No additional setup required
   - All data fetched from: `https://zlulri-app-prototype.onrender.com`

## 📁 Project Structure

```
Zluri_App_Catalog_Prototype/
├── 📄 index.html                    # Main frontend interface
├── 🎨 styles.css                    # Comprehensive styling with animations
├── ⚡ scripts.js                    # Frontend logic and API integration
├── 🖼️ app-icon.svg                  # Application icon
├── 🏢 logo.png                      # Company logo
├── 🌱 seed.js                       # Database seeding script
├── 🖥️ server.js                     # Express server configuration
├── 📦 package.json                  # Dependencies and scripts
├── 📋 Zluri_Employee_App_Catalog_Case_Study.md  # Comprehensive case study
└── 📂 backend/
    ├── 📂 models/
    │   ├── App.js                   # Application data model
    │   ├── User.js                  # User data model
    │   └── Request.js               # Request data model
    └── 📂 routes/
        ├── apps.js                  # App-related API endpoints
        └── requests.js              # Request management endpoints
```

## 🎨 Design System

### Visual Identity
- **Glass-morphism Design**: Modern translucent elements with backdrop blur
- **Professional Typography**: Clean, readable font hierarchy
- **Smooth Animations**: CSS transitions and custom dropdown interactions
- **Responsive Layout**: Mobile-first design with flexible breakpoints

### Color Palette
- **Primary Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Glass Elements**: `rgba(255, 255, 255, 0.95)` with backdrop blur
- **Accent Colors**: Professional blues and subtle highlights

### Components
- **Custom Dropdowns**: Replacing native selects with animated components
- **Interactive Cards**: Hover effects and smooth state transitions
- **Dynamic Statistics**: Live-updating counters and status indicators

## 🔧 API Documentation

### Base URL
- **Production**: `https://zlulri-app-prototype.onrender.com`
- **Local Development**: `http://localhost:5000`

### Endpoints

#### Apps
```http
GET /api/apps                        # Get all applications
GET /api/apps?category=Communication # Filter by category
GET /api/apps?search=slack           # Search applications
GET /api/apps?department=Engineering # Filter by department
```

#### Requests
```http
GET /api/requests?userId=1           # Get user requests
POST /api/requests                   # Create new request
```

### Response Format
```json
{
  "success": true,
  "data": [...],
  "count": 15
}
```

## 📊 Features Showcase

### 🎯 Smart Discovery
- **15 Enterprise Applications** across 5 categories
- **Multi-dimensional Filtering** by category, department, and popularity
- **Real-time Search** with debounced API calls
- **Personalized Recommendations** based on user role

### 💼 Enterprise Ready
- **Request Management**: Complete approval workflow simulation
- **Status Tracking**: Real-time updates on request progress
- **Role-based Access**: Different views for different user types
- **Professional Interface**: Enterprise-grade design and UX

### 📱 Modern UX
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Smooth Animations**: Professional transitions and interactions
- **Custom Components**: Enhanced dropdown and filter systems
- **Visual Hierarchy**: Clear information organization and flow

## 🔮 Roadmap

### Phase 1: Core Enhancement (Next 30 Days)
- [ ] SSO Integration (Okta/Azure AD)
- [ ] Advanced Analytics Dashboard
- [ ] Email Notification System
- [ ] Bulk Request Capabilities

### Phase 2: Enterprise Features (Next 90 Days)
- [ ] Machine Learning Recommendations
- [ ] Integration with ServiceNow/ITSM
- [ ] Advanced Reporting & ROI Analytics
- [ ] Mobile App Development

### Phase 3: Scale & Intelligence (Next 6 Months)
- [ ] Multi-tenant Architecture
- [ ] Advanced Security Features
- [ ] Comprehensive Audit Logging
- [ ] Enterprise Integration Hub

## 📈 Success Metrics

- **User Adoption**: 60% monthly catalog engagement target
- **Search Success**: 75% searches result in app exploration
- **Request Completion**: 25% of app views result in access requests
- **Shadow IT Reduction**: 40% reduction target within 12 months

## 🤝 Contributing

We welcome contributions to improve the Zluri Employee App Catalog! Please feel free to:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 License

This project is part of a product management case study and demonstration. Please see the case study document for detailed implementation guidelines and strategic analysis.

## 🙋‍♀️ Contact & Support

- **GitHub**: [@JyothikaGolla](https://github.com/JyothikaGolla)
- **Project Repository**: [Zluri_App_Catalog_Prototype](https://github.com/JyothikaGolla/Zluri_App_Catalog_Prototype)
- **Live Demo**: [View Application](https://jyothikagolla.github.io/Zluri_App_Catalog_Prototype/)

---

⭐ **Star this repository if you found it helpful!** ⭐
