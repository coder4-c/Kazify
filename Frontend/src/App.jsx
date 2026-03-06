import React, { useState, useEffect } from 'react';

// Import real data from credible sources
import { jobsData, internshipsData, scholarshipsData, trainingData, marketplaceData } from './data/opportunities';
import AIChatbot from './components/AIChatbot';

// Main App Component
export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const renderContent = () => {
    // Show login/register sections for unauthenticated users
    if (!isAuthenticated && (activeSection === 'login' || activeSection === 'register')) {
      if (activeSection === 'login') {
        return <LoginSection onLogin={handleLogin} />;
      }
      if (activeSection === 'register') {
        return <RegisterSection onRegister={handleLogin} />;
      }
    }
    
    if (!isAuthenticated) {
      return <LandingPage onLogin={() => setActiveSection('login')} onRegister={() => setActiveSection('register')} />;
    }
    
    switch (activeSection) {
      case 'home':
        return <HomeSection onNavigate={setActiveSection} />;
      case 'jobs':
        return <JobsSection />;
      case 'internships':
        return <InternshipsSection />;
      case 'training':
        return <TrainingSection />;
      case 'scholarships':
        return <ScholarshipsSection />;
      case 'marketplace':
        return <MarketplaceSection />;
      case 'profiles':
        return <ProfilesSection user={user} />;
      case 'login':
        return <LoginSection onLogin={handleLogin} />;
      case 'register':
        return <RegisterSection onRegister={handleLogin} />;
      default:
        return <HomeSection />;
    }
  };

  const handleLogin = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setActiveSection('home');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div style={styles.app}>
      <Navigation 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        user={user}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        getGreeting={getGreeting}
      />
      <main style={styles.main}>
        {renderContent()}
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
}

// Landing Page Component (for unauthenticated users)
function LandingPage({ onLogin, onRegister }) {
  return (
    <div style={styles.landingPage}>
      <div style={styles.landingHero}>
        <h1 style={styles.landingTitle}>Welcome to Kazify</h1>
        <p style={styles.landingSubtitle}>Your gateway to employment, training, and entrepreneurship opportunities</p>
        <div style={styles.landingButtons}>
          <button style={styles.landingBtnPrimary} onClick={onRegister}>Get Started</button>
          <button style={styles.landingBtnSecondary} onClick={onLogin}>Login</button>
        </div>
        <p style={styles.landingNote}>Sign up or login to access job listings, internships, scholarships, and more!</p>
      </div>
    </div>
  );
}

// Navigation Component
function Navigation({ activeSection, setActiveSection, user, isAuthenticated, onLogout, getGreeting }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'internships', label: 'Internships' },
    { id: 'training', label: 'Training' },
    { id: 'scholarships', label: 'Scholarships' },
    { id: 'marketplace', label: 'Marketplace' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        <div style={styles.logo} onClick={() => setActiveSection('home')}>
          <span style={styles.logoIcon}>🚀</span>
          <span style={styles.logoText}>Kazify</span>
        </div>
        
        <button 
          style={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>

        <div style={{...styles.navLinks, ...(mobileMenuOpen ? styles.navLinksMobile : {})}}>
          {navItems.map(item => (
            <button
              key={item.id}
              style={{
                ...styles.navLink,
                ...(activeSection === item.id ? styles.navLinkActive : {})
              }}
              onClick={() => {
                setActiveSection(item.id);
                setMobileMenuOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div style={styles.authButtons}>
          {isAuthenticated && user ? (
            <div style={styles.userMenu}>
              <span style={styles.greeting}>{getGreeting()}, {user.firstName}!</span>
              <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
            </div>
          ) : (
            <>
              <button 
                style={styles.loginBtn}
                onClick={() => setActiveSection('login')}
              >
                Login
              </button>
              <button 
                style={styles.registerBtn}
                onClick={() => setActiveSection('register')}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// Home Section
function HomeSection({ onNavigate }) {
  const navigateTo = (section) => {
    if (onNavigate) onNavigate(section);
  };
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    businesses: 0,
    opportunities: 0
  });

  useEffect(() => {
    // Animate stats
    const interval = setInterval(() => {
      setStats(prev => ({
        users: prev.users < 10000 ? prev.users + 200 : 10000,
        jobs: prev.jobs < 2000 ? prev.jobs + 50 : 2000,
        businesses: prev.businesses < 500 ? prev.businesses + 10 : 500,
        opportunities: prev.opportunities < 300 ? prev.opportunities + 5 : 300
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.home}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Welcome to Kazify
          </h1>
          <p style={styles.heroSubtitle}>
            Your gateway to employment, training, and entrepreneurship opportunities in Kenya
          </p>
          <div style={styles.heroButtons}>
          <button style={styles.heroBtnPrimary} onClick={() => navigateTo('jobs')}>Find Jobs</button>
          <button style={styles.heroBtnSecondary} onClick={() => navigateTo('jobs')}>Post a Job</button>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{stats.users.toLocaleString()}+</span>
              <span style={styles.statLabel}>Youth Users</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{stats.jobs.toLocaleString()}+</span>
              <span style={styles.statLabel}>Job Opportunities</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{stats.businesses.toLocaleString()}+</span>
              <span style={styles.statLabel}>Businesses</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{stats.opportunities}+</span>
              <span style={styles.statLabel}>Opportunities</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={styles.services}>
        <h2 style={styles.sectionTitle}>Our Services</h2>
        <div style={styles.servicesGrid}>
          <ServiceCard
            icon="💼"
            title="Jobs & Employment"
            description="Find full-time, part-time, and casual jobs from top employers across Kenya"
            onClick={() => navigateTo('jobs')}
          />
          <ServiceCard
            icon="📚"
            title="Internships"
            description="Gain valuable work experience through internships with leading companies"
            onClick={() => navigateTo('internships')}
          />
          <ServiceCard
            icon="🎓"
            title="Training Programs"
            description="Access digital skills, entrepreneurship, and technical training"
            onClick={() => navigateTo('training')}
          />
          <ServiceCard
            icon="🏆"
            title="Scholarships"
            description="Discover scholarships, grants, and fellowship opportunities"
            onClick={() => navigateTo('scholarships')}
          />
          <ServiceCard
            icon="🛒"
            title="Marketplace"
            description="Sell your products and services to a nationwide audience"
            onClick={() => navigateTo('marketplace')}
          />
          <ServiceCard
            icon="👤"
            title="Youth Profiles"
            description="Create your profile and let employers find you"
            onClick={() => navigateTo('profiles')}
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section style={styles.howItWorks}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.steps}>
          <StepCard
            number="1"
            title="Create Your Profile"
            description="Sign up and build your professional profile with skills and experience"
            onClick={() => navigateTo('profiles')}
          />
          <StepCard
            number="2"
            title="Search Opportunities"
            description="Browse through thousands of jobs, internships, and training programs"
            onClick={() => navigateTo('jobs')}
          />
          <StepCard
            number="3"
            title="Apply & Connect"
            description="Submit applications and connect with employers directly"
            onClick={() => navigateTo('jobs')}
          />
          <StepCard
            number="4"
            title="Start Your Career"
            description="Get hired and start your journey to success"
            onClick={() => navigateTo('jobs')}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to Transform Your Future?</h2>
        <p style={styles.ctaText}>Join thousands of Kenyan youth already using Kazify to advance their careers</p>
        <button style={styles.ctaButton}>Get Started Today</button>
      </section>
    </div>
  );
}

// Service Card Component
function ServiceCard({ icon, title, description, onClick }) {
  return (
    <div style={styles.serviceCard} onClick={onClick}>
      <span style={styles.serviceIcon}>{icon}</span>
      <h3 style={styles.serviceTitle}>{title}</h3>
      <p style={styles.serviceDesc}>{description}</p>
    </div>
  );
}

// Step Card Component
function StepCard({ number, title, description, onClick }) {
  return (
    <div style={styles.stepCard} onClick={onClick}>
      <div style={styles.stepNumber}>{number}</div>
      <h3 style={styles.stepTitle}>{title}</h3>
      <p style={styles.stepDesc}>{description}</p>
    </div>
  );
}

// Jobs Section
function JobsSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [locationFilter, categoryFilter]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs(jobsData); // Fallback to static data
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || job.location.includes(locationFilter);
    const matchesCategory = categoryFilter === 'all' || job.category === categoryFilter;
    return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>Job Opportunities</h1>
      <p style={styles.pageSubtitle}>Find your dream job from top employers across Kenya and globally</p>
      
      <div style={styles.sourceNote}>
        <span>📢</span> Jobs from Google, Microsoft, Safaricom, KPMG, Amazon, and more credible sources
      </div>

      <div style={styles.filterBar}>
        <select style={styles.filterSelect} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
          <option value="all">All Locations</option>
          <option value="Nairobi">Nairobi</option>
          <option value="Remote">Remote</option>
          <option value="Mombasa">Mombasa</option>
          <option value="Kisumu">Kisumu</option>
        </select>
        <select style={styles.filterSelect} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
          <option value="Engineering">Engineering</option>
          <option value="Telecommunications">Telecommunications</option>
        </select>
        <input 
          type="text" 
          placeholder="Search jobs..." 
          style={styles.searchInput} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={styles.jobsList}>
        {loading ? (
          <div style={styles.loading}>Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div style={styles.noData}>
            <p>No jobs found. Showing sample opportunities:</p>
            {jobsData.slice(0, 5).map(job => (
              <div key={job.id} style={styles.jobCard}>
                <div style={styles.jobHeader}>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <span style={styles.jobType}>{job.type}</span>
                </div>
                <p style={styles.jobCompany}>🏢 {job.company}</p>
                <div style={styles.jobDetails}>
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary}</span>
                </div>
                <a href={job.link} target="_blank" rel="noopener noreferrer" style={styles.applyBtnLink}>
                  <button style={styles.applyBtn}>Apply Now</button>
                </a>
              </div>
            ))}
          </div>
        ) : (
          filteredJobs.map(job => (
            <div key={job.id} style={styles.jobCard}>
              <div style={styles.jobHeader}>
                <h3 style={styles.jobTitle}>{job.title}</h3>
                <span style={styles.jobType}>{job.type}</span>
              </div>
              <p style={styles.jobCompany}>🏢 {job.company}</p>
              <div style={styles.jobDetails}>
                <span>📍 {job.location}</span>
                <span>💰 {job.salary || 'Competitive'}</span>
                <span>🕐 {new Date(job.posted).toLocaleDateString()}</span>
              </div>
              {job.category && (
                <div style={styles.jobCategory}>
                  <span style={styles.categoryBadge}>{job.category}</span>
                </div>
              )}
              <a href={job.link || '#'} target="_blank" rel="noopener noreferrer" style={styles.applyBtnLink}>
                <button style={styles.applyBtn}>Apply Now</button>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Internships Section
function InternshipsSection() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, [categoryFilter]);

  const fetchInternships = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/internships');
      const data = await response.json();
      setInternships(data);
    } catch (error) {
      console.error('Error fetching internships:', error);
      setInternships(internshipsData);
    } finally {
      setLoading(false);
    }
  };

  const filteredInternships = internships.filter(intern => 
    categoryFilter === 'all' || intern.category === categoryFilter
  );

  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>Internship Opportunities</h1>
      <p style={styles.pageSubtitle}>Gain valuable work experience with leading companies</p>

      <div style={styles.sourceNote}>
        <span>🎓</span> Internships from Google, Microsoft, PwC, IBM, UN, and more
      </div>

      <div style={styles.filterBar}>
        <select style={styles.filterSelect} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
          <option value="Engineering">Engineering</option>
          <option value="Development">Development</option>
          <option value="Telecommunications">Telecommunications</option>
        </select>
      </div>

      <div style={styles.jobsList}>
        {loading ? (
          <div style={styles.loading}>Loading internships...</div>
        ) : filteredInternships.length === 0 ? (
          <div style={styles.noData}>No internships found in this category.</div>
        ) : (
          filteredInternships.map(intern => (
            <div key={intern.id} style={styles.jobCard}>
              <div style={styles.jobHeader}>
                <h3 style={styles.jobTitle}>{intern.title}</h3>
                <span style={{...styles.jobType, background: '#e8f5e9', color: '#2e7d32'}}>Internship</span>
              </div>
              <p style={styles.jobCompany}>🏢 {intern.company}</p>
              <div style={styles.jobDetails}>
                <span>📍 {intern.location}</span>
                <span>⏱️ {intern.duration}</span>
                <span>💰 {intern.stipend}</span>
                <span>📅 Deadline: {intern.deadline}</span>
              </div>
              {intern.category && (
                <div style={styles.jobCategory}>
                  <span style={styles.categoryBadge}>{intern.category}</span>
                </div>
              )}
              <a href={intern.link || '#'} target="_blank" rel="noopener noreferrer">
                <button style={styles.applyBtn}>Apply Now</button>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Training Section
function TrainingSection() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTraining();
  }, [categoryFilter, levelFilter]);

  const fetchTraining = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/training');
      const data = await response.json();
      setTrainings(data);
    } catch (error) {
      console.error('Error fetching training:', error);
      setTrainings(trainingData);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainings = trainings.filter(training => 
    (categoryFilter === 'all' || training.category === categoryFilter) &&
    (levelFilter === 'all' || (training.level && training.level.toLowerCase().includes(levelFilter.toLowerCase())))
  );

  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>Training & Skill Development</h1>
      <p style={styles.pageSubtitle}>Upgrade your skills with training from Google, Microsoft, Cisco, and more</p>

      <div style={styles.sourceNote}>
        <span>📚</span> Training from Google, Microsoft, AWS, Cisco, Moringa School, and more credible institutions
      </div>

      <div style={styles.filterBar}>
        <select style={styles.filterSelect} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Marketing">Marketing</option>
          <option value="Management">Management</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Business">Business</option>
          <option value="Design">Design</option>
        </select>
        <select style={styles.filterSelect} value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
          <option value="all">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div style={styles.jobsList}>
        {loading ? (
          <div style={styles.loading}>Loading training programs...</div>
        ) : filteredTrainings.length === 0 ? (
          <div style={styles.noData}>No training programs found in this category.</div>
        ) : (
          filteredTrainings.map(training => (
            <div key={training.id} style={styles.jobCard}>
              <div style={styles.jobHeader}>
                <h3 style={styles.jobTitle}>{training.title}</h3>
                <span style={{...styles.jobType, background: '#fff3e0', color: '#e65100'}}>{training.level}</span>
              </div>
              <p style={styles.jobCompany}>🏫 {training.provider}</p>
              {training.description && <p style={styles.jobDesc}>{training.description}</p>}
              <div style={styles.jobDetails}>
                <span>⏱️ {training.duration}</span>
                <span>💰 {training.price || 'Contact for pricing'}</span>
                {training.category && <span>🏷️ {training.category}</span>}
              </div>
              <a href={training.link || '#'} target="_blank" rel="noopener noreferrer">
                <button style={styles.applyBtn}>Enroll Now</button>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Scholarships Section
function ScholarshipsSection() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScholarships();
  }, [categoryFilter]);

  const fetchScholarships = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/scholarships');
      const data = await response.json();
      setScholarships(data);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      setScholarships(scholarshipsData);
    } finally {
      setLoading(false);
    }
  };

  const filteredScholarships = scholarships.filter(scholarship => 
    categoryFilter === 'all' || scholarship.category === categoryFilter
  );

  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>Scholarships & Grants</h1>
      <p style={styles.pageSubtitle}>Fund your education with scholarships from top organizations</p>

      <div style={styles.sourceNote}>
        <span>🎓</span> Scholarships from Mastercard Foundation, Chevening, Fulbright, Commonwealth, and more
      </div>

      <div style={styles.filterBar}>
        <select style={styles.filterSelect} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="International">International</option>
          <option value="Local">Local (Kenya)</option>
        </select>
      </div>

      <div style={styles.jobsList}>
        {loading ? (
          <div style={styles.loading}>Loading scholarships...</div>
        ) : filteredScholarships.length === 0 ? (
          <div style={styles.noData}>No scholarships found in this category.</div>
        ) : (
          filteredScholarships.map(scholarship => (
            <div key={scholarship.id} style={styles.jobCard}>
              <div style={styles.jobHeader}>
                <h3 style={styles.jobTitle}>{scholarship.title}</h3>
                <span style={{...styles.jobType, background: '#e3f2fd', color: '#1565c0'}}>{scholarship.level}</span>
              </div>
              <p style={styles.jobCompany}>🏫 {scholarship.provider}</p>
              <div style={styles.jobDetails}>
                <span>🎓 {scholarship.coverage}</span>
                <span>📅 Deadline: {scholarship.deadline}</span>
                <span>🏷️ {scholarship.category}</span>
              </div>
              {scholarship.requirements && scholarship.requirements.length > 0 && (
                <div style={styles.requirementsList}>
                  <strong>Requirements:</strong>
                  <ul style={styles.requirementsUl}>
                    {scholarship.requirements.map((req, idx) => (
                      <li key={idx} style={styles.requirementsLi}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
              <a href={scholarship.link || '#'} target="_blank" rel="noopener noreferrer">
                <button style={styles.applyBtn}>Apply Now</button>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Marketplace Section
function MarketplaceSection() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitData, setSubmitData] = useState({
    name: '',
    seller: '',
    category: 'Fashion',
    price: '',
    description: '',
    contact: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/marketplace');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching marketplace:', error);
      setProducts(marketplaceData);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    // This would submit to the API
    alert('Your product has been submitted for verification. You will be notified once approved.');
    setShowSubmitForm(false);
    setSubmitData({
      name: '',
      seller: '',
      category: 'Fashion',
      price: '',
      description: '',
      contact: ''
    });
  };

  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>Youth Business Marketplace</h1>
      <p style={styles.pageSubtitle}>Discover products and services from young entrepreneurs</p>

      <button 
        style={styles.submitProductBtn}
        onClick={() => setShowSubmitForm(!showSubmitForm)}
      >
        {showSubmitForm ? '✕ Cancel' : '📝 Submit Your Product'}
      </button>

      {showSubmitForm && (
        <div style={styles.submitForm}>
          <h3>Submit Your Product for Verification</h3>
          <p>Your product will be reviewed before being published.</p>
          <form onSubmit={handleSubmitProduct} style={styles.authForm}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Product Name</label>
              <input 
                type="text" 
                value={submitData.name}
                onChange={(e) => setSubmitData({...submitData, name: e.target.value})}
                style={styles.formInput}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Your Name/Business</label>
              <input 
                type="text" 
                value={submitData.seller}
                onChange={(e) => setSubmitData({...submitData, seller: e.target.value})}
                style={styles.formInput}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Category</label>
              <select 
                value={submitData.category}
                onChange={(e) => setSubmitData({...submitData, category: e.target.value})}
                style={styles.formInput}
              >
                <option value="Fashion">Fashion</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Crafts">Crafts</option>
                <option value="Digital Services">Digital Services</option>
                <option value="Design">Design</option>
                <option value="Services">Services</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Price</label>
              <input 
                type="text" 
                value={submitData.price}
                onChange={(e) => setSubmitData({...submitData, price: e.target.value})}
                style={styles.formInput}
                placeholder="e.g., KSh 1,000"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Description</label>
              <textarea 
                value={submitData.description}
                onChange={(e) => setSubmitData({...submitData, description: e.target.value})}
                style={{...styles.formInput, minHeight: '80px'}}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Contact (Email/Phone)</label>
              <input 
                type="text" 
                value={submitData.contact}
                onChange={(e) => setSubmitData({...submitData, contact: e.target.value})}
                style={styles.formInput}
                required
              />
            </div>
            <button type="submit" style={styles.applyBtn}>Submit for Verification</button>
          </form>
        </div>
      )}

      <div style={styles.filterBar}>
        <select style={styles.filterSelect} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Digital Services">Digital Services</option>
          <option value="Fashion">Fashion</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Crafts">Crafts</option>
          <option value="Design">Design</option>
          <option value="Services">Services</option>
        </select>
        <input 
          type="text" 
          placeholder="Search products..." 
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={styles.marketplaceGrid}>
        {loading ? (
          <div style={styles.loading}>Loading marketplace...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={styles.noData}>No products found. Be the first to submit your product!</div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} style={styles.productCard}>
              <div style={styles.productImage}>{product.image || '📦'}</div>
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.productSeller}>By: {product.seller}</p>
              {product.description && <p style={styles.productDesc}>{product.description}</p>}
              <div style={styles.productDetails}>
                <span style={styles.productCategory}>{product.category}</span>
                <span style={styles.productPrice}>{product.price}</span>
              </div>
              <a href={`mailto:${product.contact}`} style={styles.buyBtnLink}>
                <button style={styles.buyBtn}>Contact Seller</button>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Profiles Section
function ProfilesSection() {
  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>Youth Profiles</h1>
      <p style={styles.pageSubtitle}>Showcase your skills and get discovered by employers</p>

      <div style={styles.profileCTA}>
        <h2>Create Your Profile</h2>
        <p>Stand out to employers with a professional profile</p>
        <button style={styles.ctaButton}>Create Profile</button>
      </div>
    </div>
  );
}

// Login Section
function LoginSection({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('youth');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onLogin(data.user, data.token);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authSection}>
      <div style={styles.authCard}>
        <h2 style={styles.authTitle}>Welcome Back</h2>
        <p style={styles.authSubtitle}>Login to your Kazify account</p>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleLogin} style={styles.authForm}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>I am a:</label>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="userType" 
                  value="youth"
                  checked={userType === 'youth'}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Youth/Job Seeker
              </label>
              <label style={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="userType" 
                  value="employer"
                  checked={userType === 'employer'}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Employer/Business
              </label>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.formInput}
              placeholder="your@email.com"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.formInput}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" style={styles.authSubmitBtn} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.authSwitch}>
          Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); window.location.reload(); }} style={styles.authLink}>Sign Up</a>
        </p>
      </div>
    </div>
  );
}

// Register Section
function RegisterSection({ onRegister }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'youth',
    location: '',
    skills: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least 1 special character';
    }
    if (!hasLetter) {
      return 'Password must contain at least 1 letter';
    }
    if (!hasNumber) {
      return 'Password must contain at least 1 number';
    }
    return '';
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    if (e.target.name === 'password') {
      setPasswordError(validatePassword(e.target.value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate password
    const error = validatePassword(formData.password);
    if (error) {
      setPasswordError(error);
      return;
    }
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          userType: formData.userType,
          location: formData.location,
          skills: formData.skills
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Registration successful! Welcome to Kazify.');
        onRegister(data.user, data.token);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authSection}>
      <div style={styles.authCard}>
        <h2 style={styles.authTitle}>Join Kazify</h2>
        <p style={styles.authSubtitle}>Create your account and start exploring opportunities</p>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.authForm}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>First Name</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={styles.formInput}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Last Name</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={styles.formInput}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.formInput}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={styles.formInput}
              placeholder="+254..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Location</label>
            <select name="location" value={formData.location} onChange={handleChange} style={styles.formInput}>
              <option value="">Select County</option>
              <option value="nairobi">Nairobi</option>
              <option value="mombasa">Mombasa</option>
              <option value="kisumu">Kisumu</option>
              <option value="nakuru">Nakuru</option>
              <option value="eldoret">Eldoret</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Account Type</label>
            <select name="userType" value={formData.userType} onChange={handleChange} style={styles.formInput}>
              <option value="youth">Youth/Job Seeker</option>
              <option value="employer">Employer/Business</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Skills (comma separated)</label>
            <input 
              type="text" 
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              style={styles.formInput}
              placeholder="e.g., Web Development, Marketing, Design"
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.formInput}
                placeholder="Min 8 chars, 1 special, 1 letter, 1 number"
                required
              />
              {passwordError && <span style={styles.errorMsg}>{passwordError}</span>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.formInput}
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.authSubmitBtn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Footer Component
function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        <div style={styles.footerSection}>
          <h3 style={styles.footerTitle}>Kazify</h3>
          <p style={styles.footerText}>Connecting Kenyan youth to employment, training, and entrepreneurship opportunities.</p>
        </div>
        <div style={styles.footerSection}>
          <h4 style={styles.footerSubtitle}>Quick Links</h4>
          <ul style={styles.footerLinks}>
            <li>Jobs</li>
            <li>Internships</li>
            <li>Training</li>
            <li>Scholarships</li>
            <li>Marketplace</li>
          </ul>
        </div>
        <div style={styles.footerSection}>
          <h4 style={styles.footerSubtitle}>Contact Us</h4>
          <ul style={styles.footerLinks}>
            <li>📍 Nairobi, Kenya</li>
            <li>📞 +254 700 000 000</li>
            <li>✉️ info@kyoh.go.ke</li>
          </ul>
        </div>
        <div style={styles.footerSection}>
          <h4 style={styles.footerSubtitle}>Follow Us</h4>
          <div style={styles.socialLinks}>
            <span>📘 Facebook</span>
            <span>🐦 Twitter</span>
            <span>📸 Instagram</span>
            <span>💼 LinkedIn</span>
          </div>
        </div>
      </div>
      <div style={styles.footerBottom}>
        <p>© 2026 Kazify. All rights reserved.</p>
      </div>
    </footer>
  );
}

// Styles
const styles = {
  app: {
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f8f9fa',
  },
  nav: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  logoIcon: {
    fontSize: '32px',
  },
  logoText: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2563eb',
    letterSpacing: '-0.5px',
  },
  mobileMenuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  navLinks: {
    display: 'flex',
    gap: '5px',
    flexWrap: 'wrap',
  },
  navLinksMobile: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: '15px',
  },
  navLink: {
    padding: '10px 15px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#333',
    borderRadius: '5px',
    transition: 'all 0.3s',
  },
  navLinkActive: {
    backgroundColor: '#2e7d32',
    color: '#fff',
  },
  authButtons: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  loginBtn: {
    padding: '8px 20px',
    border: '2px solid #2e7d32',
    background: 'none',
    color: '#2e7d32',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  registerBtn: {
    padding: '8px 20px',
    border: 'none',
    background: '#2e7d32',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  welcomeMsg: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  greeting: {
    color: '#1b5e20',
    fontWeight: '600',
    fontSize: '16px',
    marginRight: '15px',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
  },
  logoutBtn: {
    padding: '8px 15px',
    border: 'none',
    background: '#d32f2f',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  errorAlert: {
    background: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  main: {
    minHeight: 'calc(100vh - 200px)',
  },
  landingPage: {
    minHeight: 'calc(100vh - 200px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%)',
  },
  landingHero: {
    textAlign: 'center',
    color: '#fff',
    padding: '40px',
    maxWidth: '700px',
  },
  landingTitle: {
    fontSize: 'clamp(28px, 6vw, 48px)',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  landingSubtitle: {
    fontSize: 'clamp(16px, 3vw, 22px)',
    marginBottom: '40px',
    opacity: 0.95,
  },
  landingButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  landingBtnPrimary: {
    padding: '15px 40px',
    fontSize: '18px',
    background: '#fff',
    color: '#2e7d32',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  landingBtnSecondary: {
    padding: '15px 40px',
    fontSize: '18px',
    background: 'transparent',
    color: '#fff',
    border: '2px solid #fff',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  landingNote: {
    fontSize: '16px',
    opacity: 0.9,
  },
  home: {
    width: '100%',
  },
  hero: {
    background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%)',
    padding: '80px 20px',
    textAlign: 'center',
    color: '#fff',
  },
  heroContent: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: 'clamp(28px, 5vw, 48px)',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  heroSubtitle: {
    fontSize: 'clamp(16px, 3vw, 20px)',
    marginBottom: '30px',
    opacity: 0.9,
  },
  heroButtons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '50px',
    flexWrap: 'wrap',
  },
  heroBtnPrimary: {
    padding: '15px 40px',
    fontSize: '18px',
    background: '#fff',
    color: '#2e7d32',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  heroBtnSecondary: {
    padding: '15px 40px',
    fontSize: '18px',
    background: 'transparent',
    color: '#fff',
    border: '2px solid #fff',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  heroStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: '14px',
    opacity: 0.9,
  },
  services: {
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '36px',
    textAlign: 'center',
    marginBottom: '50px',
    color: '#1b5e20',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  serviceCard: {
    background: '#fff',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    textAlign: 'center',
    transition: 'transform 0.3s',
    cursor: 'pointer',
  },
  serviceIcon: {
    fontSize: '50px',
    display: 'block',
    marginBottom: '20px',
  },
  serviceTitle: {
    fontSize: '22px',
    marginBottom: '15px',
    color: '#1b5e20',
  },
  serviceDesc: {
    color: '#666',
    lineHeight: '1.6',
  },
  howItWorks: {
    padding: '80px 20px',
    background: '#f1f8e9',
  },
  steps: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '25px',
  },
  stepCard: {
    textAlign: 'center',
    padding: '30px',
    cursor: 'pointer',
  },
  stepNumber: {
    width: '60px',
    height: '60px',
    background: '#2e7d32',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 auto 20px',
  },
  stepTitle: {
    fontSize: '20px',
    marginBottom: '15px',
    color: '#1b5e20',
  },
  stepDesc: {
    color: '#666',
  },
  cta: {
    padding: '80px 20px',
    background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
    textAlign: 'center',
    color: '#fff',
  },
  ctaTitle: {
    fontSize: '36px',
    marginBottom: '20px',
  },
  ctaText: {
    fontSize: '18px',
    marginBottom: '30px',
    opacity: 0.9,
  },
  ctaButton: {
    padding: '15px 50px',
    fontSize: '18px',
    background: '#fff',
    color: '#2e7d32',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  section: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  pageTitle: {
    fontSize: '36px',
    color: '#1b5e20',
    marginBottom: '10px',
  },
  pageSubtitle: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '30px',
  },
  filterBar: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  filterSelect: {
    padding: '12px 20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    minWidth: '150px',
  },
  searchInput: {
    padding: '12px 20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    flex: '1',
    minWidth: '200px',
  },
  jobsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  jobCard: {
    background: '#fff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  jobHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  jobTitle: {
    fontSize: '20px',
    color: '#1b5e20',
    margin: 0,
  },
  jobType: {
    padding: '5px 12px',
    background: '#e8f5e9',
    color: '#2e7d32',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  jobCompany: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '15px',
  },
  jobDetails: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '20px',
    color: '#555',
    fontSize: '14px',
  },
  applyBtn: {
    padding: '10px 25px',
    background: '#2e7d32',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  marketplaceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  productCard: {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  productImage: {
    fontSize: '60px',
    textAlign: 'center',
    padding: '20px',
    background: '#f5f5f5',
    borderRadius: '10px',
    marginBottom: '15px',
  },
  productName: {
    fontSize: '18px',
    color: '#1b5e20',
    marginBottom: '5px',
  },
  productSeller: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
  },
  productDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  productCategory: {
    padding: '4px 10px',
    background: '#f5f5f5',
    borderRadius: '15px',
    fontSize: '12px',
    color: '#666',
  },
  productPrice: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  buyBtn: {
    width: '100%',
    padding: '10px',
    background: '#2e7d32',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  sourceNote: {
    background: '#e3f2fd',
    padding: '12px 20px',
    borderRadius: '8px',
    marginBottom: '25px',
    color: '#1565c0',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  jobDesc: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  categoryBadge: {
    padding: '4px 12px',
    background: '#f5f5f5',
    borderRadius: '15px',
    fontSize: '12px',
    color: '#666',
  },
  jobCategory: {
    marginBottom: '15px',
  },
  requirementsList: {
    marginBottom: '15px',
    fontSize: '13px',
  },
  requirementsUl: {
    marginTop: '8px',
    paddingLeft: '20px',
  },
  requirementsLi: {
    color: '#555',
    marginBottom: '4px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666',
  },
  noData: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
  },
  buyBtnLink: {
    textDecoration: 'none',
  },
  submitProductBtn: {
    padding: '12px 25px',
    background: '#ff9800',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    marginBottom: '20px',
  },
  profileCTA: {
    textAlign: 'center',
    padding: '60px 20px',
    background: '#fff',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  authSection: {
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
  },
  authCard: {
    background: '#fff',
    padding: 'clamp(20px, 5vw, 40px)',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    width: '100%',
    margin: '20px',
  },
  authTitle: {
    fontSize: '28px',
    color: '#1b5e20',
    textAlign: 'center',
    marginBottom: '10px',
  },
  authSubtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '30px',
  },
  authForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
  },
  formLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  formInput: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
  },
  radioGroup: {
    display: 'flex',
    gap: '20px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  authSubmitBtn: {
    padding: '14px',
    background: '#2e7d32',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
  },
  authSwitch: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666',
  },
  errorMsg: {
    color: '#d32f2f',
    fontSize: '13px',
    marginTop: '5px',
  },
  footer: {
    background: '#1b5e20',
    color: '#fff',
    padding: '60px 20px 20px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
  },
  footerSection: {},
  footerTitle: {
    fontSize: '20px',
    marginBottom: '15px',
  },
  footerSubtitle: {
    fontSize: '16px',
    marginBottom: '15px',
    color: '#a5d6a7',
  },
  footerText: {
    opacity: 0.9,
    lineHeight: '1.6',
  },
  footerLinks: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    lineHeight: '2',
  },
  socialLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  footerBottom: {
    textAlign: 'center',
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.2)',
  },
};

// Add responsive styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @media (max-width: 1024px) {
    .hero-title { font-size: 40px !important; }
    .section-title { font-size: 30px !important; }
  }
  
  @media (max-width: 768px) {
    .nav-container { flex-direction: column; gap: 15px; }
    .nav-links { display: none; }
    .mobile-menu-btn { display: block !important; }
    .hero-title { font-size: 32px !important; }
    .hero-subtitle { font-size: 18px !important; }
    .hero-stats { flex-direction: column; gap: 20px !important; }
    .services-grid { grid-template-columns: 1fr !important; }
    .steps { grid-template-columns: 1fr !important; }
    .marketplace-grid { grid-template-columns: 1fr !important; }
    .jobs-list { gap: 15px; }
    .job-card { padding: 15px !important; }
    .filter-bar { flex-direction: column; }
    .filter-select, .search-input { width: 100% !important; min-width: unset !important; }
    .auth-card { padding: 20px !important; margin: 10px !important; }
    .form-row { grid-template-columns: 1fr !important; }
    .footer-content { grid-template-columns: 1fr !important; text-align: center; }
    .landing-title { font-size: 32px !important; }
    .landing-buttons { flex-direction: column !important; }
    .greeting { font-size: 14px !important; margin-right: 10px !important; }
    .user-menu { flex-direction: column; gap: 10px; }
    .logout-btn { width: 100%; }
  }
  
  @media (max-width: 480px) {
    .hero-title { font-size: 26px !important; }
    .hero-stats { gap: 15px !important; }
    .stat-number { font-size: 24px !important; }
    .section-title { font-size: 24px !important; }
    .page-title { font-size: 24px !important; }
    .nav-logo-full { display: none !important; }
    .logo { gap: 5px !important; }
    .logo-icon { font-size: 20px !important; }
    .logo-text { font-size: 18px !important; }
    .service-card { padding: 20px !important; }
    .service-icon { font-size: 40px !important; }
    .product-card { padding: 15px !important; }
    .auth-buttons { gap: 5px !important; }
    .login-btn, .register-btn { padding: 6px 12px !important; font-size: 14px !important; }
  }
`;
document.head.appendChild(styleSheet);
