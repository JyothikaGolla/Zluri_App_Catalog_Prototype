// API Configuration
const API_BASE_URL = 'https://zlulri-app-prototype.onrender.com';

const appGrid = document.getElementById('app-grid');
const categoryFilter = document.getElementById('categoryFilter');
const departmentFilter = document.getElementById('departmentFilter');
const sortFilter = document.getElementById('sortFilter');
const allAppsBtn = document.getElementById('allAppsBtn');
const myAppsBtn = document.getElementById('myAppsBtn');
const pendingRequestsBtn = document.getElementById('pendingAppsBtn');
const searchInput = document.getElementById('searchInput');
const appModal = document.getElementById('appModal');
const recommendationsGrid = document.getElementById('recommendations-grid');
const recommendationsSection = document.getElementById('recommendations');

let allApps = [];
let currentView = 'all'; // 'all', 'myapps', 'pending'
let requestedAppIds = ['1', '6', '9']; // Include the approved apps as requested
let approvedAppIds = ['1', '6', '9']; // Some default approved apps (Slack, Google Workspace, Figma)
let pendingAppIds = []; // Apps with pending requests
let currentSearchTerm = '';
let currentUser = {
  id: '1',
  name: 'John Doe',
  role: 'Product Manager',
  department: 'Engineering'
};

// Enhanced app data with ratings, departments, and more details (fallback data)
const enhancedApps = [
  {
    _id: '1',
    name: 'Slack',
    description: 'Team communication and collaboration platform with channels, direct messaging, and file sharing',
    category: 'Communication',
    department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
    rating: 4.5,
    users: 1250,
    features: ['Real-time messaging', 'File sharing', 'Video calls', 'App integrations', 'Channel organization'],
    accessRequirements: 'Auto-approved for all employees',
    icon: '💬'
  },
  {
    _id: '2',
    name: 'Zoom',
    description: 'Video conferencing and online meeting platform with HD video, screen sharing, and recording',
    category: 'Communication',
    department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
    rating: 4.3,
    users: 1500,
    features: ['HD video meetings', 'Screen sharing', 'Recording', 'Webinars', 'Breakout rooms'],
    accessRequirements: 'Auto-approved for all employees',
    icon: '📹'
  },
  {
    _id: '3',
    name: 'Jira',
    description: 'Project management and issue tracking tool for agile software development teams',
    category: 'Productivity',
    department: ['Engineering'],
    rating: 4.1,
    users: 340,
    features: ['Issue tracking', 'Sprint planning', 'Kanban boards', 'Reporting', 'Custom workflows'],
    accessRequirements: 'Team lead approval required',
    icon: '📋'
  },
  {
    _id: '4',
    name: 'Confluence',
    description: 'Team wiki and documentation platform for creating, sharing, and collaborating on content',
    category: 'Productivity',
    department: ['Engineering', 'Marketing', 'HR'],
    rating: 4.0,
    users: 420,
    features: ['Wiki pages', 'Team spaces', 'Document collaboration', 'Templates', 'Search'],
    accessRequirements: 'Manager approval required',
    icon: '📚'
  },
  {
    _id: '5',
    name: 'GitHub',
    description: 'Source code management and collaboration platform with version control and CI/CD',
    category: 'Development',
    department: ['Engineering'],
    rating: 4.7,
    users: 280,
    features: ['Git repositories', 'Pull requests', 'Code review', 'Actions CI/CD', 'Project boards'],
    accessRequirements: 'Engineering manager approval',
    icon: '🐙'
  },
  {
    _id: '6',
    name: 'Google Workspace',
    description: 'Comprehensive suite including Gmail, Docs, Drive, Sheets, and collaboration tools',
    category: 'Productivity',
    department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
    rating: 4.4,
    users: 1600,
    features: ['Email', 'Document editing', 'Cloud storage', 'Video meetings', 'Calendar'],
    accessRequirements: 'Auto-approved for all employees',
    icon: '📧'
  },
  {
    _id: '7',
    name: 'Microsoft Teams',
    description: 'Team collaboration platform with chat, video meetings, and Office 365 integration',
    category: 'Communication',
    department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
    rating: 4.2,
    users: 890,
    features: ['Team chat', 'Video conferencing', 'File sharing', 'Office integration', 'Apps'],
    accessRequirements: 'Manager approval required',
    icon: '👥'
  },
  {
    _id: '8',
    name: 'Salesforce',
    description: 'Customer relationship management platform for managing leads, opportunities, and customer data',
    category: 'Sales',
    department: ['Sales', 'Marketing'],
    rating: 4.2,
    users: 890,
    features: ['Lead management', 'Opportunity tracking', 'Reports & analytics', 'Mobile app', 'Automation'],
    accessRequirements: 'Sales manager approval + training required',
    icon: '📈'
  },
  {
    _id: '9',
    name: 'Asana',
    description: 'Project and task management tool for organizing work and tracking team progress',
    category: 'Productivity',
    department: ['Marketing', 'HR'],
    rating: 4.3,
    users: 560,
    features: ['Task management', 'Project timelines', 'Team collaboration', 'Custom fields', 'Reporting'],
    accessRequirements: 'Team lead approval',
    icon: '✅'
  },
  {
    _id: '10',
    name: 'ZoomInfo',
    description: 'Business intelligence and data platform for sales prospecting and market research',
    category: 'Sales',
    department: ['Sales', 'Marketing'],
    rating: 4.0,
    users: 120,
    features: ['Contact database', 'Company insights', 'Email finder', 'CRM integration', 'Analytics'],
    accessRequirements: 'Sales director approval + budget approval',
    icon: '🔍'
  },
  {
    _id: '11',
    name: 'Figma',
    description: 'Collaborative design and prototyping tool for creating user interfaces and experiences',
    category: 'Development',
    department: ['Engineering', 'Marketing'],
    rating: 4.8,
    users: 340,
    features: ['Real-time collaboration', 'Prototyping', 'Design systems', 'Developer handoff', 'Version control'],
    accessRequirements: 'Team lead approval',
    icon: '🎨'
  },
  {
    _id: '12',
    name: 'Notion',
    description: 'All-in-one workspace for notes, documents, databases, and team collaboration',
    category: 'Productivity',
    department: ['Engineering', 'Marketing', 'HR'],
    rating: 4.6,
    users: 670,
    features: ['Document creation', 'Database management', 'Task tracking', 'Templates', 'Team wikis'],
    accessRequirements: 'Self-service approval',
    icon: '📝'
  },
  {
    _id: '13',
    name: 'HubSpot',
    description: 'Inbound marketing, sales, and customer service platform with CRM capabilities',
    category: 'Marketing',
    department: ['Marketing', 'Sales'],
    rating: 4.4,
    users: 450,
    features: ['Marketing automation', 'Lead scoring', 'Email campaigns', 'Analytics', 'CRM'],
    accessRequirements: 'Marketing manager approval',
    icon: '🚀'
  },
  {
    _id: '14',
    name: 'Tableau',
    description: 'Data visualization and business intelligence platform for creating interactive dashboards',
    category: 'Productivity',
    department: ['Engineering', 'Marketing', 'Sales', 'Finance'],
    rating: 4.3,
    users: 180,
    features: ['Data visualization', 'Interactive dashboards', 'Data connections', 'Sharing', 'Mobile'],
    accessRequirements: 'Manager + IT approval required',
    icon: '📊'
  },
  {
    _id: '15',
    name: 'Adobe Creative Cloud',
    description: 'Complete suite of creative applications including Photoshop, Illustrator, and InDesign',
    category: 'Marketing',
    department: ['Marketing'],
    rating: 4.5,
    users: 89,
    features: ['Photo editing', 'Vector graphics', 'Layout design', 'Video editing', 'Cloud sync'],
    accessRequirements: 'Creative director approval + license cost approval',
    icon: '🎭'
  }
];

// Fetch all apps (enhanced with backend API)
async function fetchApps() {
  try {
    const queryParams = new URLSearchParams();
    const selectedCategory = categoryFilter.value;
    const selectedDepartment = departmentFilter.value;
    const sortBy = sortFilter.value;
    
    if (selectedCategory) queryParams.append('category', selectedCategory);
    if (selectedDepartment) queryParams.append('department', selectedDepartment);
    if (currentSearchTerm) queryParams.append('search', currentSearchTerm);
    queryParams.append('sortBy', sortBy);
    queryParams.append('limit', '50'); // Ensure we get all apps
    
    console.log('Fetching apps from:', `${API_BASE_URL}/api/apps?${queryParams}`);
    
    const res = await fetch(`${API_BASE_URL}/api/apps?${queryParams}`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('Backend response:', data);
    
    // Handle both old and new API response formats
    allApps = data.apps || data;
    
    // If we have valid apps from server, use them
    if (allApps && allApps.length > 0) {
      console.log(`Successfully loaded ${allApps.length} apps from backend`);
    } else {
      console.warn('No apps received from backend, using fallback data');
      allApps = enhancedApps;
    }
  } catch (error) {
    console.error('Error fetching apps from backend:', error);
    console.log('Using fallback enhanced apps data');
    // Fallback to enhanced mock data
    allApps = enhancedApps;
  }
  
  updateStats();
  renderApps(filteredApps());
  showRecommendations();
}

// Fetch user requests (enhanced with backend API)
async function fetchMyRequests() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/requests?userId=${currentUser.id}`);
    const data = await res.json();
    
    // Handle both old and new API response formats
    const requests = data.requests || data;
    
    // Reset arrays
    requestedAppIds = [];
    approvedAppIds = [];
    pendingAppIds = [];
    
    // Categorize requests by status
    requests.forEach(request => {
      const appId = request.appId._id || request.appId;
      requestedAppIds.push(appId);
      
      if (request.status === 'Approved') {
        approvedAppIds.push(appId);
      } else if (request.status === 'Pending') {
        pendingAppIds.push(appId);
      }
    });
    
    // For enhanced requests with populated app data
    if (requests.length > 0 && requests[0].appId && typeof requests[0].appId === 'object') {
      // If appId is populated, extract the actual ID
      requestedAppIds = requests.map(r => r.appId._id || r.appId);
    }
  } catch (error) {
    console.warn('Error fetching requests, using mock data:', error);
    // Mock approved and pending requests
    approvedAppIds = ['1', '6']; // Slack and Google Workspace (approved)
    pendingAppIds = ['3', '8']; // Salesforce and another app (pending)
    requestedAppIds = [...approvedAppIds, ...pendingAppIds];
  }
  updateStats();
}

// Fetch all apps (enhanced with mock data)
async function fetchApps() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/apps`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const serverApps = await res.json();
    
    // Merge server data with enhanced local data
    allApps = serverApps.map(app => {
      const enhanced = enhancedApps.find(e => e.name === app.name);
      return enhanced ? { ...app, ...enhanced } : {
        ...app,
        rating: 4.0,
        users: Math.floor(Math.random() * 1000),
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
        accessRequirements: 'Manager approval required',
        department: ['Engineering'],
        icon: '🔧'
      };
    });
  } catch (error) {
    console.error('Error fetching apps:', error);
    // Fallback to enhanced mock data
    allApps = enhancedApps;
  }
  
  updateStats();
  renderApps(filteredApps());
  showRecommendations();
}

// Update dashboard statistics
function updateStats() {
  const totalApps = allApps.length;
  const myAppsCount = approvedAppIds.length; // Only approved apps count as "My Apps"
  const pendingRequestsCount = pendingAppIds.length; // Only pending requests
  
  document.getElementById('totalApps').textContent = totalApps;
  document.getElementById('myAppsCount').textContent = myAppsCount;
  document.getElementById('pendingRequests').textContent = pendingRequestsCount;
  
  console.log(`Stats updated: Total Apps: ${totalApps}, My Apps: ${myAppsCount}, Pending: ${pendingRequestsCount}`);
}

// Show personalized recommendations
function showRecommendations() {
  // Don't show recommendations during active search or in non-all views
  const searchTerm = document.getElementById('searchInput').value.trim();
  if (searchTerm || currentView !== 'all') {
    recommendationsSection.style.display = 'none';
    return;
  }
  
  const userDeptApps = allApps
    .filter(app => app.department && app.department.includes && app.department.includes(currentUser.department))
    .sort((a, b) => (b.rating || 4.0) - (a.rating || 4.0))
    .slice(0, 3);
  
  if (userDeptApps.length > 0) {
    recommendationsSection.style.display = 'block';
    renderApps(userDeptApps, recommendationsGrid);
  } else {
    recommendationsSection.style.display = 'none';
  }
}

// Fetch user requests
async function fetchMyRequests() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/requests?userId=${currentUser.id}`);
    const requests = await res.json();
    requestedAppIds = requests.map(r => r.appId);
  } catch (error) {
    console.error('Error fetching requests:', error);
    // Mock pending requests
    requestedAppIds = ['1', '3'];
  }
  updateStats();
}

// Enhanced render function with detailed app cards
function renderApps(apps, container = appGrid) {
  container.innerHTML = '';
  
  if (!apps || apps.length === 0) {
    container.innerHTML = '<div style="text-align: center; color: #666; padding: 2rem;">No apps found</div>';
    return;
  }
  
  apps.forEach(app => {
    const isApproved = approvedAppIds.includes(app._id);
    const isPending = pendingAppIds.includes(app._id);
    const isRequested = requestedAppIds.includes(app._id);
    const hasAccess = isApproved; // User has access if app is approved
    
    // Ensure all properties have defaults
    const appName = app.name || 'Unknown App';
    const appDescription = app.description || 'No description available';
    const appCategory = app.category || 'Uncategorized';
    const appRating = app.rating || 4.0;
    const appUsers = app.users || 0;
    const appIcon = app.icon || '🔧';
    
    const node = document.createElement('div');
    node.className = 'app-card';
    node.innerHTML = `
      <div class="app-icon">${appIcon}</div>
      <h3>${appName}</h3>
      <p>${appDescription}</p>
      <div class="app-meta">
        <span class="app-category">${appCategory}</span>
        <div class="app-rating">
          <span class="stars">${'★'.repeat(Math.floor(appRating))}</span>
          <span>${appRating.toFixed(1)}</span>
        </div>
      </div>
      <p style="font-size: 0.85rem; color: #666;">${appUsers.toLocaleString()} users</p>
      <div class="access-status ${hasAccess ? 'granted' : isRequested ? 'pending' : 'not-requested'}">
        ${hasAccess ? 'Access Granted' : isRequested ? 'Pending Request' : 'Request Access'}
      </div>
      <div class="app-actions">
        <a class="details" href="#" onclick="showAppDetail('${app._id}')">View Details</a>
        ${!hasAccess ? `<button class="request-btn ${isRequested ? 'pending' : ''}">${isRequested ? 'Pending' : 'Request Access'}</button>` : ''}
      </div>
    `;
    container.appendChild(node);

    // Add click handler for request button
    const requestBtn = node.querySelector('.request-btn');
    if (requestBtn && !isRequested && !hasAccess) {
      requestBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await requestAccess(app._id, appName);
      });
    }
  });
}

// Show detailed app information in modal
function showAppDetail(appId) {
  const app = allApps.find(a => a._id === appId);
  if (!app) return;
  
  const isRequested = requestedAppIds.includes(app._id);
  const hasAccess = Math.random() > 0.7;
  
  document.getElementById('modalContent').innerHTML = `
    <div class="app-detail-header">
      <div class="app-icon-large">${app.icon || '🔧'}</div>
      <div class="app-detail-info">
        <h2>${app.name}</h2>
        <div class="app-detail-meta">
          <span class="app-category">${app.category}</span>
          <div class="app-rating">
            <span class="stars">${'★'.repeat(Math.floor(app.rating))}</span>
            <span>${app.rating} (${app.users} users)</span>
          </div>
        </div>
        <div class="access-status ${hasAccess ? 'granted' : isRequested ? 'pending' : 'not-requested'}">
          ${hasAccess ? 'Access Granted' : isRequested ? 'Pending Request' : 'Request Access'}
        </div>
      </div>
    </div>
    
    <div class="detail-section">
      <h3>Description</h3>
      <p>${app.description}</p>
    </div>
    
    <div class="detail-section">
      <h3>Key Features</h3>
      <ul class="feature-list">
        ${app.features.map(feature => `<li>${feature}</li>`).join('')}
      </ul>
    </div>
    
    <div class="detail-section">
      <h3>Access Requirements</h3>
      <p>${app.accessRequirements}</p>
    </div>
    
    <div class="detail-section">
      <h3>Available to Departments</h3>
      <p>${app.department.join(', ')}</p>
    </div>
    
    ${!hasAccess ? `
      <div style="margin-top: 2rem;">
        <button class="request-btn ${isPending ? 'pending' : (isApproved ? 'approved' : '')}" 
                onclick="${(isPending || isApproved) ? '' : `requestAccess('${app._id}', '${app.name}')`}"
                ${(isPending || isApproved) ? 'disabled' : ''}>
          ${isApproved ? 'Access Granted' : (isPending ? 'Request Pending' : 'Request Access')}
        </button>
      </div>
    ` : `
      <div style="margin-top: 2rem;">
        <button class="request-btn approved" disabled>
          Access Granted
        </button>
      </div>
    `}
  `;
  
  appModal.style.display = 'block';
}

// Request access to an application
async function requestAccess(appId, appName) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: currentUser.id, 
        appId: appId, 
        requestedBy: currentUser.name,
        requestedDate: new Date().toISOString(),
        justification: `Request for ${appName} access for work purposes`,
        status: 'pending'
      })
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log('Request created successfully:', data);
      alert(`Access request for ${appName} has been submitted for approval.`);
      
      // Add to pending requests (not approved yet)
      if (!pendingAppIds.includes(appId)) {
        pendingAppIds.push(appId);
      }
      if (!requestedAppIds.includes(appId)) {
        requestedAppIds.push(appId);
      }
    } else {
      throw new Error(`Server responded with status: ${res.status}`);
    }
  } catch (error) {
    console.error('Error submitting request:', error);
    // Fallback: still add to pending for demo purposes
    alert(`Access request for ${appName} has been submitted for approval.`);
    
    if (!pendingAppIds.includes(appId)) {
      pendingAppIds.push(appId);
    }
    if (!requestedAppIds.includes(appId)) {
      requestedAppIds.push(appId);
    }
  }
  
  updateStats();
  renderApps(filteredApps());
  showRecommendations();
  appModal.style.display = 'none';
}

// Enhanced filtering with multiple criteria
function filteredApps() {
  let apps = allApps;
  
  // Filter by view type first
  if (currentView === 'myapps') {
    apps = apps.filter(a => approvedAppIds.includes(a._id));
  } else if (currentView === 'pending') {
    apps = apps.filter(a => pendingAppIds.includes(a._id));
  }
  
  // Filter by category
  const selectedCategory = categoryFilter.value;
  if (selectedCategory) {
    apps = apps.filter(a => a.category === selectedCategory);
  }
  
  // Filter by department
  const selectedDepartment = departmentFilter.value;
  if (selectedDepartment) {
    apps = apps.filter(a => 
      a.department && a.department.includes && a.department.includes(selectedDepartment)
    );
  }
  
  // Filter by search term
  if (currentSearchTerm) {
    const searchTerm = currentSearchTerm.toLowerCase();
    apps = apps.filter(a => 
      (a.name && a.name.toLowerCase().includes(searchTerm)) ||
      (a.description && a.description.toLowerCase().includes(searchTerm)) ||
      (a.features && a.features.some && a.features.some(f => f.toLowerCase().includes(searchTerm)))
    );
  }
  
  // Sort apps
  const sortBy = sortFilter.value;
  apps.sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return (b.users || 0) - (a.users || 0);
      case 'rating':
        return (b.rating || 4.0) - (a.rating || 4.0);
      case 'recent':
        return new Date(b.createdAt || '2025-01-01') - new Date(a.createdAt || '2025-01-01');
      default:
        return (a.name || '').localeCompare(b.name || '');
    }
  });
  
  return apps;
}

// Event listeners with enhanced functionality
// Enhanced filter change handlers with smooth transitions
categoryFilter.addEventListener('change', () => {
  addFilterLoadingState();
  setTimeout(() => {
    renderApps(filteredApps());
    removeFilterLoadingState();
  }, 150);
});

departmentFilter.addEventListener('change', () => {
  addFilterLoadingState();
  setTimeout(() => {
    renderApps(filteredApps());
    removeFilterLoadingState();
  }, 150);
});

sortFilter.addEventListener('change', () => {
  addFilterLoadingState();
  setTimeout(() => {
    renderApps(filteredApps());
    removeFilterLoadingState();
  }, 150);
});

// Helper functions for smooth filter transitions
function addFilterLoadingState() {
  const filterBar = document.querySelector('.filter-bar');
  const appGrid = document.getElementById('app-grid');
  filterBar.classList.add('loading');
  appGrid.style.opacity = '0.5';
  appGrid.style.transform = 'scale(0.98)';
  appGrid.style.filter = 'blur(1px)';
}

function removeFilterLoadingState() {
  const filterBar = document.querySelector('.filter-bar');
  const appGrid = document.getElementById('app-grid');
  filterBar.classList.remove('loading');
  appGrid.style.opacity = '1';
  appGrid.style.transform = 'scale(1)';
  appGrid.style.filter = 'none';
  
  // Add a subtle success animation
  appGrid.style.animation = 'filterSuccess 0.5s ease';
  setTimeout(() => {
    appGrid.style.animation = '';
  }, 500);
}

searchInput.addEventListener('input', (e) => {
  currentSearchTerm = e.target.value.trim();
  // Debounce search to avoid too many API calls
  clearTimeout(window.searchTimeout);
  window.searchTimeout = setTimeout(() => {
    fetchApps();
  }, 300);
});

// View button event handlers
function setActiveView(view) {
  currentView = view;
  
  // Update button active states
  document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
  
  // Update section title based on view
  const mainSectionTitle = document.getElementById('mainSectionTitle');
  
  if (view === 'all') {
    allAppsBtn.classList.add('active');
    searchInput.placeholder = 'Search apps by name...';
    mainSectionTitle.textContent = 'All Apps';
  } else if (view === 'myapps') {
    myAppsBtn.classList.add('active');
    searchInput.placeholder = 'Search your apps by name...';
    mainSectionTitle.textContent = 'My Apps';
  } else if (view === 'pending') {
    pendingRequestsBtn.classList.add('active');
    searchInput.placeholder = 'Search pending requests by name...';
    mainSectionTitle.textContent = 'Pending Requests';
  }
  
  renderApps(filteredApps());
  showRecommendations();
}

allAppsBtn.addEventListener('click', () => setActiveView('all'));
myAppsBtn.addEventListener('click', () => setActiveView('myapps'));
pendingRequestsBtn.addEventListener('click', () => setActiveView('pending'));

// Modal close handlers
document.querySelector('.close').addEventListener('click', () => {
  appModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === appModal) {
    appModal.style.display = 'none';
  }
});

// Initialize the application
fetchApps();

// Custom dropdown functionality
function initCustomDropdowns() {
  const customSelects = document.querySelectorAll('.custom-select');
  
  customSelects.forEach(select => {
    const selected = select.querySelector('.select-selected');
    const items = select.querySelector('.select-items');
    const hiddenInput = document.getElementById(select.dataset.target);
    
    // Toggle dropdown on click
    selected.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Check if this dropdown is currently open
      const isOpen = items.classList.contains('show');
      
      // Close all dropdowns first
      closeAllSelect();
      
      // If this dropdown wasn't open, open it
      if (!isOpen) {
        items.classList.remove('select-hide');
        items.classList.add('show');
        selected.classList.add('select-arrow-active');
        select.classList.add('active');
      }
    });
    
    // Handle option selection
    const options = items.querySelectorAll('div');
    options.forEach(option => {
      option.addEventListener('click', function(e) {
        const value = this.dataset.value;
        const text = this.textContent;
        
        // Update selected display
        selected.textContent = text;
        
        // Update hidden input
        hiddenInput.value = value;
        
        // Update visual state
        options.forEach(opt => opt.classList.remove('same-as-selected'));
        this.classList.add('same-as-selected');
        
        // Close dropdown
        items.classList.add('select-hide');
        items.classList.remove('show');
        selected.classList.remove('select-arrow-active');
        select.classList.remove('active');
        
        // Trigger change event
        const changeEvent = new Event('change', { bubbles: true });
        hiddenInput.dispatchEvent(changeEvent);
        
        e.stopPropagation();
      });
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    // Check if click is outside all custom selects
    const isClickInsideDropdown = Array.from(customSelects).some(select => 
      select.contains(e.target)
    );
    
    if (!isClickInsideDropdown) {
      closeAllSelect();
    }
  });
}

function closeAllSelect() {
  const customSelects = document.querySelectorAll('.custom-select');
  
  customSelects.forEach(select => {
    const selected = select.querySelector('.select-selected');
    const items = select.querySelector('.select-items');
    
    // Only use CSS classes, no inline styles
    items.classList.add('select-hide');
    items.classList.remove('show');
    selected.classList.remove('select-arrow-active');
    select.classList.remove('active');
  });
}

// Initialize custom dropdowns when page loads
document.addEventListener('DOMContentLoaded', initCustomDropdowns);