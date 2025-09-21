const appGrid = document.getElementById('app-grid');
const categoryFilter = document.getElementById('categoryFilter');
const departmentFilter = document.getElementById('departmentFilter');
const sortFilter = document.getElementById('sortFilter');
const myAppsBtn = document.getElementById('myAppsBtn');
const searchInput = document.getElementById('searchInput');
const appModal = document.getElementById('appModal');
const recommendationsGrid = document.getElementById('recommendations-grid');
const recommendationsSection = document.getElementById('recommendations');

let allApps = [];
let myAppsView = false;
let requestedAppIds = [];
let currentSearchTerm = '';
let currentUser = {
  id: '1',
  name: 'John Doe',
  role: 'Product Manager',
  department: 'Engineering'
};

// Enhanced app data with ratings, departments, and more details
const enhancedApps = [
  {
    _id: '1',
    name: 'Slack',
    description: 'Team communication and collaboration platform',
    category: 'Communication',
    department: ['Engineering', 'Marketing', 'Sales'],
    rating: 4.5,
    users: 1250,
    features: ['Real-time messaging', 'File sharing', 'Video calls', 'App integrations'],
    accessRequirements: 'Manager approval required',
    icon: '💬'
  },
  {
    _id: '2',
    name: 'Figma',
    description: 'Collaborative design and prototyping tool',
    category: 'Development',
    department: ['Engineering', 'Marketing'],
    rating: 4.8,
    users: 340,
    features: ['Real-time collaboration', 'Prototyping', 'Design systems', 'Developer handoff'],
    accessRequirements: 'Team lead approval',
    icon: '🎨'
  },
  {
    _id: '3',
    name: 'Salesforce',
    description: 'Customer relationship management platform',
    category: 'Sales',
    department: ['Sales', 'Marketing'],
    rating: 4.2,
    users: 890,
    features: ['Lead management', 'Opportunity tracking', 'Reports & analytics', 'Mobile app'],
    accessRequirements: 'Sales manager approval + training required',
    icon: '📈'
  },
  {
    _id: '4',
    name: 'Notion',
    description: 'All-in-one workspace for notes, docs, and collaboration',
    category: 'Productivity',
    department: ['Engineering', 'Marketing', 'HR'],
    rating: 4.6,
    users: 670,
    features: ['Document creation', 'Database management', 'Task tracking', 'Templates'],
    accessRequirements: 'Self-service approval',
    icon: '📝'
  },
  {
    _id: '5',
    name: 'Zoom',
    description: 'Video conferencing and online meetings',
    category: 'Communication',
    department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
    rating: 4.3,
    users: 1500,
    features: ['HD video meetings', 'Screen sharing', 'Recording', 'Webinars'],
    accessRequirements: 'Auto-approved for all employees',
    icon: '📹'
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
    
    const res = await fetch(`https://zlulri-app-prototype.onrender.com/api/apps?${queryParams}`);
    const data = await res.json();
    
    // Handle both old and new API response formats
    allApps = data.apps || data;
    
    // Fallback to enhanced mock data if server doesn't return the expected format
    if (!allApps || allApps.length === 0 || !allApps[0].rating) {
      allApps = enhancedApps;
    }
  } catch (error) {
    console.warn('Server error, using fallback data:', error);
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
    const res = await fetch(`https://zlulri-app-prototype.onrender.com/api/requests?userId=${currentUser.id}`);
    const data = await res.json();
    
    // Handle both old and new API response formats
    const requests = data.requests || data;
    requestedAppIds = requests.map(r => r.appId);
    
    // For enhanced requests with populated app data
    if (requests.length > 0 && requests[0].appId && typeof requests[0].appId === 'object') {
      // If appId is populated, extract the actual ID
      requestedAppIds = requests.map(r => r.appId._id || r.appId);
    }
  } catch (error) {
    console.warn('Error fetching requests, using mock data:', error);
    // Mock pending requests
    requestedAppIds = ['1', '3'];
  }
  updateStats();
}

// Fetch all apps (enhanced with mock data)
async function fetchApps() {
  try {
    const res = await fetch('https://zlulri-app-prototype.onrender.com/api/apps');
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
    // Fallback to enhanced mock data
    allApps = enhancedApps;
  }
  
  updateStats();
  renderApps(filteredApps());
  showRecommendations();
}

// Update dashboard statistics
function updateStats() {
  document.getElementById('totalApps').textContent = allApps.length;
  document.getElementById('myAppsCount').textContent = requestedAppIds.length;
  document.getElementById('pendingRequests').textContent = requestedAppIds.length;
}

// Show personalized recommendations
function showRecommendations() {
  const userDeptApps = allApps
    .filter(app => app.department.includes(currentUser.department))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
  
  if (userDeptApps.length > 0 && !myAppsView) {
    recommendationsSection.style.display = 'block';
    renderApps(userDeptApps, recommendationsGrid);
  } else {
    recommendationsSection.style.display = 'none';
  }
}

// Fetch user requests
async function fetchMyRequests() {
  try {
    const res = await fetch(`https://zlulri-app-prototype.onrender.com/api/requests?userId=${currentUser.id}`);
    const requests = await res.json();
    requestedAppIds = requests.map(r => r.appId);
  } catch (error) {
    // Mock pending requests
    requestedAppIds = ['1', '3'];
  }
  updateStats();
}

// Enhanced render function with detailed app cards
function renderApps(apps, container = appGrid) {
  container.innerHTML = '';
  apps.forEach(app => {
    const isRequested = requestedAppIds.includes(app._id);
    const hasAccess = Math.random() > 0.7; // Mock access status
    
    const node = document.createElement('div');
    node.className = 'app-card';
    node.innerHTML = `
      <div class="app-icon">${app.icon || '🔧'}</div>
      <h3>${app.name}</h3>
      <p>${app.description}</p>
      <div class="app-meta">
        <span class="app-category">${app.category}</span>
        <div class="app-rating">
          <span class="stars">${'★'.repeat(Math.floor(app.rating))}</span>
          <span>${app.rating}</span>
        </div>
      </div>
      <p style="font-size: 0.85rem; color: #666;">${app.users} users</p>
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
        await requestAccess(app._id, app.name);
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
        <button class="request-btn ${isRequested ? 'pending' : ''}" 
                onclick="${isRequested ? '' : `requestAccess('${app._id}', '${app.name}')`}"
                ${isRequested ? 'disabled' : ''}>
          ${isRequested ? 'Request Pending' : 'Request Access'}
        </button>
      </div>
    ` : ''}
  `;
  
  appModal.style.display = 'block';
}

// Request access to an application
async function requestAccess(appId, appName) {
  try {
    const res = await fetch('https://zlulri-app-prototype.onrender.com/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: currentUser.id, 
        appId: appId, 
        requestedBy: currentUser.name,
        requestedDate: new Date().toISOString(),
        justification: `Request for ${appName} access for work purposes`
      })
    });
    const data = await res.json();
    
    if (res.ok) {
      alert(`Access request for ${appName} has been submitted for approval.`);
      requestedAppIds.push(appId);
    } else {
      alert(data.message || `Error submitting request for ${appName}`);
    }
  } catch (error) {
    console.warn('Error submitting request, using fallback:', error);
    alert(`Access request for ${appName} has been submitted for approval.`);
    requestedAppIds.push(appId);
  }
  
  updateStats();
  renderApps(filteredApps());
  showRecommendations();
  appModal.style.display = 'none';
}

// Enhanced filtering with multiple criteria
function filteredApps() {
  let apps = allApps;
  
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
  
  // Filter by My Apps view
  if (myAppsView) {
    apps = apps.filter(a => requestedAppIds.includes(a._id));
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
categoryFilter.addEventListener('change', () => {
  // Re-fetch apps with new filters
  fetchApps();
});

departmentFilter.addEventListener('change', () => {
  // Re-fetch apps with new filters
  fetchApps();
});

sortFilter.addEventListener('change', () => {
  // Re-fetch apps with new sorting
  fetchApps();
});

searchInput.addEventListener('input', (e) => {
  currentSearchTerm = e.target.value.trim();
  // Debounce search to avoid too many API calls
  clearTimeout(window.searchTimeout);
  window.searchTimeout = setTimeout(() => {
    fetchApps();
  }, 300);
});

myAppsBtn.addEventListener('click', async () => {
  myAppsView = !myAppsView;
  myAppsBtn.textContent = myAppsView ? 'All Apps' : 'My Apps';
  
  searchInput.placeholder = myAppsView 
    ? 'Search your apps by name...' 
    : 'Search apps by name...';
  
  await fetchMyRequests();
  renderApps(filteredApps());
  showRecommendations();
});

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
