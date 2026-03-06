const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const cron = require('node-cron');

const app = express();
const port = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'kazify-secret-key-2026';

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kazify';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err.message));

// ==================== MODELS ====================

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  userType: { type: String, enum: ['youth', 'employer', 'admin'], default: 'youth' },
  location: { type: String },
  skills: [String],
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Job Schema
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  salary: { type: String },
  category: { type: String },
  description: { type: String },
  requirements: [String],
  link: { type: String },
  source: { type: String, default: 'KYOH' },
  posted: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const Job = mongoose.model('Job', jobSchema);

// Internship Schema
const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String, required: true },
  stipend: { type: String },
  deadline: { type: String, required: true },
  category: { type: String },
  requirements: [String],
  link: { type: String },
  source: { type: String, default: 'KYOH' },
  posted: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const Internship = mongoose.model('Internship', internshipSchema);

// Scholarship Schema
const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  provider: { type: String, required: true },
  level: { type: String, required: true },
  coverage: { type: String },
  deadline: { type: String, required: true },
  category: { type: String },
  requirements: [String],
  link: { type: String },
  source: { type: String, default: 'KYOH' },
  posted: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

// Training Schema
const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  provider: { type: String, required: true },
  duration: { type: String, required: true },
  level: { type: String, required: true },
  price: { type: String },
  category: { type: String },
  description: { type: String },
  link: { type: String },
  source: { type: String, default: 'KYOH' },
  posted: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const Training = mongoose.model('Training', trainingSchema);

// Marketplace Product Schema with verification status
const marketplaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seller: { type: String, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  contact: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String },
  posted: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: false }
});

const Marketplace = mongoose.model('Marketplace', marketplaceSchema);

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, userType, location, skills } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      userType: userType || 'youth',
      location,
      skills: skills ? skills.split(',').map(s => s.trim()) : []
    });
    
    await user.save();
    
    const token = jwt.sign({ userId: user._id, userType: user.userType }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      message: 'Registration successful', 
      token, 
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, userType: user.userType }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id, userType: user.userType }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      message: 'Login successful', 
      token, 
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, userType: user.userType }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// ==================== JOBS ROUTES ====================

// Get all jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const { search, location, category } = req.query;
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    if (location && location !== 'all') {
      query.location = { $regex: location, $options: 'i' };
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const jobs = await Job.find(query).sort({ posted: -1 }).limit(100);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// Post a job (employer)
app.post('/api/jobs', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.userType !== 'employer' && decoded.userType !== 'admin') {
      return res.status(403).json({ message: 'Only employers can post jobs' });
    }
    
    const job = new Job(req.body);
    await job.save();
    
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Error posting job', error: error.message });
  }
});

// ==================== INTERNSHIPS ROUTES ====================

// Get all internships
app.get('/api/internships', async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const internships = await Internship.find(query).sort({ posted: -1 }).limit(100);
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching internships', error: error.message });
  }
});

// Post an internship
app.post('/api/internships', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const internship = new Internship(req.body);
    await internship.save();
    
    res.status(201).json({ message: 'Internship posted successfully', internship });
  } catch (error) {
    res.status(500).json({ message: 'Error posting internship', error: error.message });
  }
});

// ==================== SCHOLARSHIPS ROUTES ====================

// Get all scholarships
app.get('/api/scholarships', async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const scholarships = await Scholarship.find(query).sort({ posted: -1 }).limit(100);
    res.json(scholarships);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scholarships', error: error.message });
  }
});

// Post a scholarship
app.post('/api/scholarships', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const scholarship = new Scholarship(req.body);
    await scholarship.save();
    
    res.status(201).json({ message: 'Scholarship posted successfully', scholarship });
  } catch (error) {
    res.status(500).json({ message: 'Error posting scholarship', error: error.message });
  }
});

// ==================== TRAINING ROUTES ====================

// Get all training programs
app.get('/api/training', async (req, res) => {
  try {
    const { category, level } = req.query;
    let query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    if (level && level !== 'all') {
      query.level = { $regex: level, $options: 'i' };
    }
    
    const training = await Training.find(query).sort({ posted: -1 }).limit(100);
    res.json(training);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching training', error: error.message });
  }
});

// Post a training program
app.post('/api/training', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const training = new Training(req.body);
    await training.save();
    
    res.status(201).json({ message: 'Training posted successfully', training });
  } catch (error) {
    res.status(500).json({ message: 'Error posting training', error: error.message });
  }
});

// ==================== MARKETPLACE ROUTES ====================

// Get approved marketplace products
app.get('/api/marketplace', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { status: 'approved', isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { seller: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Marketplace.find(query).sort({ posted: -1 }).limit(100);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching marketplace', error: error.message });
  }
});

// Submit product for verification (youth)
app.post('/api/marketplace', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const product = new Marketplace({
      ...req.body,
      sellerId: decoded.userId,
      status: 'pending' // Always pending initially
    });
    
    await product.save();
    
    res.status(201).json({ 
      message: 'Product submitted for verification. You will be notified once approved.', 
      product 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting product', error: error.message });
  }
});

// Get pending products (admin only)
app.get('/api/admin/marketplace/pending', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.userType !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const products = await Marketplace.find({ status: 'pending' }).sort({ posted: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending products', error: error.message });
  }
});

// Verify/reject product (admin only)
app.put('/api/admin/marketplace/:id/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.userType !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { status, rejectionReason } = req.body;
    const product = await Marketplace.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        rejectionReason,
        isActive: status === 'approved'
      },
      { new: true }
    );
    
    res.json({ message: `Product ${status}`, product });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying product', error: error.message });
  }
});

// Get my marketplace submissions
app.get('/api/marketplace/my', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const products = await Marketplace.find({ sellerId: decoded.userId }).sort({ posted: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your products', error: error.message });
  }
});

// ==================== SEED DATA ====================

// Seed initial data from credible sources
const seedData = async () => {
  const jobCount = await Job.countDocuments();
  const internshipCount = await Internship.countDocuments();
  const scholarshipCount = await Scholarship.countDocuments();
  const trainingCount = await Training.countDocuments();
  
  // Only seed if empty
  if (jobCount === 0) {
    const jobs = [
      { title: 'Software Engineering Intern', company: 'Google', location: 'Nairobi, Kenya', type: 'Internship', salary: 'Competitive', category: 'Technology', link: 'https://careers.google.com/', source: 'Google' },
      { title: 'Cloud Solutions Architect', company: 'Microsoft', location: 'Nairobi, Kenya', type: 'Full-time', salary: 'KSh 150,000 - 200,000', category: 'Technology', link: 'https://careers.microsoft.com/', source: 'Microsoft' },
      { title: 'Graduate Trainee Program', company: 'Safaricom', location: 'Nairobi, Kenya', type: 'Full-time', salary: 'KSh 60,000 - 80,000', category: 'Telecommunications', link: 'https://www.safaricom.co.ke/careers', source: 'Safaricom' },
      { title: 'Data Analyst', company: 'KPMG Kenya', location: 'Nairobi, Kenya', type: 'Full-time', salary: 'KSh 100,000 - 140,000', category: 'Finance', link: 'https://home.kpmg.com/ke/en/home/careers.html', source: 'KPMG' },
      { title: 'Digital Marketing Associate', company: 'Amazon', location: 'Nairobi, Kenya', type: 'Full-time', salary: 'KSh 70,000 - 90,000', category: 'Marketing', link: 'https://www.amazon.jobs/', source: 'Amazon' },
      { title: 'Electrical Engineer', company: 'Kenya Power', location: 'Nairobi, Kenya', type: 'Full-time', salary: 'KSh 80,000 - 120,000', category: 'Engineering', link: 'https://kplc.co.ke/', source: 'Kenya Power' },
      { title: 'Frontend Developer', company: 'Andela', location: 'Remote (Kenya)', type: 'Full-time', salary: 'KSh 100,000 - 150,000', category: 'Technology', link: 'https://andela.com/careers/', source: 'Andela' },
      { title: 'Customer Success Manager', company: 'Salesforce', location: 'Nairobi, Kenya', type: 'Full-time', salary: 'KSh 90,000 - 130,000', category: 'Technology', link: 'https://careers.salesforce.com/', source: 'Salesforce' },
      { title: 'Agricultural Extension Officer', company: 'FAO Kenya', location: 'Various Counties', type: 'Full-time', salary: 'KSh 50,000 - 70,000', category: 'Agriculture', link: 'http://www.fao.org/kenya/', source: 'FAO' },
      { title: 'HR Coordinator', company: 'UNDP Kenya', location: 'Nairobi, Kenya', type: 'Full-time', salary: 'KSh 80,000 - 100,000', category: 'Human Resources', link: 'https://www.ke.undp.org/', source: 'UNDP' }
    ];
    await Job.insertMany(jobs);
    console.log('Jobs seeded');
  }
  
  if (internshipCount === 0) {
    const internships = [
      { title: 'Google Summer Internship', company: 'Google', location: 'Nairobi, Kenya', duration: '3-4 months', stipend: 'Competitive + Benefits', deadline: 'March 31, 2026', category: 'Technology', link: 'https://careers.google.com/students/', source: 'Google' },
      { title: 'Microsoft Learn Internship', company: 'Microsoft', location: 'Remote', duration: '6 weeks', stipend: 'KSh 30,000', deadline: 'April 15, 2026', category: 'Technology', link: 'https://microsoft.com/microsoftinternship', source: 'Microsoft' },
      { title: 'Finance Internship', company: 'PwC Kenya', location: 'Nairobi, Kenya', duration: '6 months', stipend: 'KSh 40,000', deadline: 'March 25, 2026', category: 'Finance', link: 'https://www.pwc.com/ke/en/careers.html', source: 'PwC' },
      { title: 'Marketing Internship', company: 'Coca-Cola Kenya', location: 'Nairobi, Kenya', duration: '3 months', stipend: 'KSh 25,000', deadline: 'April 1, 2026', category: 'Marketing', link: 'https://coca-colacompany.com/careers/', source: 'Coca-Cola' },
      { title: 'Engineering Intern', company: 'Kenya Airways', location: 'Nairobi, Kenya', duration: '6 months', stipend: 'KSh 35,000', deadline: 'March 20, 2026', category: 'Engineering', link: 'https://kenya-airways.com/careers', source: 'Kenya Airways' },
      { title: 'Data Science Fellowship', company: 'IBM', location: 'Remote', duration: '12 weeks', stipend: 'KSh 50,000', deadline: 'April 30, 2026', category: 'Technology', link: 'https://www.ibm.com/careers', source: 'IBM' },
      { title: 'UN Youth Internship', company: 'United Nations Kenya', location: 'Nairobi, Kenya', duration: '3-6 months', stipend: 'KSh 20,000', deadline: 'March 15, 2026', category: 'Development', link: 'https://www.ungm.org/', source: 'UN' },
      { title: 'Telecommunications Internship', company: 'Airtel Africa', location: 'Nairobi, Kenya', duration: '3 months', stipend: 'KSh 28,000', deadline: 'April 10, 2026', category: 'Telecommunications', link: 'https://africa.airtel.com/careers/', source: 'Airtel' }
    ];
    await Internship.insertMany(internships);
    console.log('Internships seeded');
  }
  
  if (scholarshipCount === 0) {
    const scholarships = [
      { title: 'Mastercard Foundation Scholars Program', provider: 'Mastercard Foundation', level: 'Undergraduate & Masters', coverage: 'Full Tuition + Living Allowance + Travel', deadline: 'March 30, 2026', category: 'International', link: 'https://mastercardfdn.org/scholars/', source: 'Mastercard Foundation' },
      { title: 'Chevening Scholarship', provider: 'UK Government', level: 'Masters', coverage: 'Full Tuition + Living Allowance + Travel', deadline: 'November 3, 2026', category: 'International', link: 'https://www.chevening.org/', source: 'UK Government' },
      { title: 'Fulbright Scholarship', provider: 'US Government', level: 'Masters/PhD', coverage: 'Full Tuition + Living Stipend + Travel', deadline: 'August 1, 2026', category: 'International', link: 'https://fulbrightkenya.org/', source: 'US Government' },
      { title: 'Kenya Government Scholarship', provider: 'Ministry of Education', level: 'Undergraduate', coverage: 'Full Tuition', deadline: 'April 1, 2026', category: 'Local', link: 'https://education.go.ke/', source: 'Government of Kenya' },
      { title: 'Erasmus Mundus Scholarship', provider: 'EU Commission', level: 'Masters/PhD', coverage: 'Full Tuition + Monthly Allowance + Travel', deadline: 'January 15, 2027', category: 'International', link: 'https://eacea.ec.europa.eu/erasmus-plus/', source: 'EU Commission' },
      { title: 'Google PhD Fellowship', provider: 'Google', level: 'PhD', coverage: 'Full Funding + Mentorship', deadline: 'April 30, 2026', category: 'Technology', link: 'https://research.google/fellowships/', source: 'Google' },
      { title: 'Commonwealth Scholarship', provider: 'Commonwealth Trust', level: 'Masters/PhD', coverage: 'Full Tuition + Living Allowance', deadline: 'September 2026', category: 'International', link: 'https://cscuk.fcdo.gov.uk/', source: 'Commonwealth' },
      { title: 'DAAD Scholarship', provider: 'German Academic Exchange', level: 'Masters/PhD', coverage: 'Full Tuition + Monthly Allowance + Health Insurance', deadline: 'October 2026', category: 'International', link: 'https://www.daad-kenya.or.ke/', source: 'DAAD' },
      { title: 'Equity Africa Scholarship', provider: 'Equity Group Foundation', level: 'Undergraduate', coverage: 'Full Tuition + Living Allowance', deadline: 'March 31, 2026', category: 'Local', link: 'https://equitygroupholdings.com/', source: 'Equity Group' },
      { title: 'World Bank Graduate Scholarship', provider: 'World Bank', level: 'Masters', coverage: 'Full Tuition + Living Stipend + Travel', deadline: 'March 31, 2026', category: 'International', link: 'https://www.worldbank.org/', source: 'World Bank' }
    ];
    await Scholarship.insertMany(scholarships);
    console.log('Scholarships seeded');
  }
  
  if (trainingCount === 0) {
    const training = [
      { title: 'Google Career Certificates', provider: 'Google/Coursera', duration: '3-6 months', level: 'Beginner-Intermediate', price: 'Financial Aid Available', category: 'Technology', description: 'Earn job-ready skills in UX Design, Data Analytics, Project Management, and more.', link: 'https://grow.google/certificates/', source: 'Google' },
      { title: 'Microsoft Azure Certification', provider: 'Microsoft', duration: '2-4 months', level: 'Intermediate-Advanced', price: 'KSh 15,000 - 25,000', category: 'Technology', description: 'Become a certified Azure professional with hands-on labs and exams.', link: 'https://learn.microsoft.com/certifications/', source: 'Microsoft' },
      { title: 'AWS Cloud Practitioner', provider: 'Amazon Web Services', duration: '6-8 weeks', level: 'Beginner', price: 'KSh 20,000', category: 'Technology', description: 'Learn cloud fundamentals and prepare for AWS certification.', link: 'https://aws.amazon.com/training/', source: 'AWS' },
      { title: 'Digital Marketing Masterclass', provider: 'HubSpot Academy', duration: '4-6 weeks', level: 'Beginner', price: 'Free', category: 'Marketing', description: 'Comprehensive digital marketing training with certification.', link: 'https://academy.hubspot.com/', source: 'HubSpot' },
      { title: 'Data Science Professional Certificate', provider: 'IBM/Coursera', duration: '6 months', level: 'Intermediate', price: 'Financial Aid Available', category: 'Technology', description: 'Learn Python, SQL, Data Analysis, and Machine Learning.', link: 'https://www.coursera.org/professional-certificates/ibm-data-science', source: 'IBM' },
      { title: 'Moringa School Bootcamp', provider: 'Moringa School', duration: '6 months', level: 'Beginner-Intermediate', price: 'KSh 150,000 or Income Share Agreement', category: 'Technology', description: 'Full-stack software development training with job placement.', link: 'https://moringaschool.com/', source: 'Moringa School' },
      { title: 'Google Digital Skills for Africa', provider: 'Google', duration: '40+ hours', level: 'Beginner', price: 'Free', category: 'Technology', description: 'Free digital skills training covering fundamentals of online business.', link: 'https://learndigital.withgoogle.com/digitalskillsafrica/', source: 'Google' },
      { title: 'Project Management Professional (PMP)', provider: 'PMI Kenya', duration: '3-4 months', level: 'Advanced', price: 'KSh 80,000', category: 'Management', description: 'Prepare for PMP certification with exam prep training.', link: 'https://www.pmi.org/kenya', source: 'PMI' },
      { title: 'Facebook Blueprint Certification', provider: 'Meta', duration: '2-3 months', level: 'Intermediate', price: 'Free', category: 'Marketing', description: 'Learn Facebook advertising and marketing with certifications.', link: 'https://www.facebook.com/business/learn', source: 'Meta' },
      { title: 'Agribusiness Management Training', provider: 'Kenya Agricultural Training Institute', duration: '3 months', level: 'Beginner-Intermediate', price: 'KSh 25,000', category: 'Agriculture', description: 'Modern farming techniques and agribusiness management.', link: 'https://kati.ac.ke/', source: 'KATI' },
      { title: 'Cybersecurity Fundamentals', provider: 'Cisco Networking Academy', duration: '3 months', level: 'Beginner', price: 'Free', category: 'Technology', description: 'Learn essential cybersecurity skills and prepare for certification.', link: 'https://www.netacad.com/', source: 'Cisco' },
      { title: 'Entrepreneurship Development Program', provider: 'KEPSA', duration: '2 months', level: 'Beginner', price: 'Free', category: 'Business', description: 'Business development skills for aspiring entrepreneurs.', link: 'https://kepsa.or.ke/', source: 'KEPSA' }
    ];
    await Training.insertMany(training);
    console.log('Training seeded');
  }
  
  console.log('Data seeding complete!');
};

// ==================== DAILY UPDATE FUNCTION ====================

// Function to update data from external sources (can be enhanced with actual APIs)
const updateFromExternalSources = async () => {
  console.log('Starting daily update from external sources...');
  
  try {
    // This is where you would fetch from actual APIs
    // For now, we'll add new sample data periodically
    // In production, you would integrate with:
    // - Google Careers API
    // - LinkedIn Jobs API
    // - Scholarship portals
    // - Training provider APIs
    
    console.log('Daily update complete!');
  } catch (error) {
    console.error('Error during daily update:', error.message);
  }
};

// Schedule daily update at midnight
cron.schedule('0 0 * * *', () => {
  updateFromExternalSources();
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'KYOH API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ==================== START SERVER ====================

app.listen(port, async () => {
  console.log(`KYOH Backend listening on port ${port}`);
  
  // Seed initial data
  await seedData();
  
  console.log('Server ready!');
});

module.exports = app;
