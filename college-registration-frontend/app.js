// API Base URL - Update this with your backend URL
const API_BASE_URL = 'http://localhost:8080';

// State management
let authToken = null;
let currentUser = null;
let userRole = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    checkAuthentication();
});

function initializeApp() {
    loadCourses();
}

function setupEventListeners() {
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Auth forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);

    // Admin forms
    document.getElementById('addStudentForm').addEventListener('submit', handleAddStudent);
    document.getElementById('addCourseForm').addEventListener('submit', handleAddCourse);

    // Course search
    document.getElementById('courseSearch').addEventListener('input', handleCourseSearch);
}

function checkAuthentication() {
    authToken = localStorage.getItem('authToken');
    currentUser = localStorage.getItem('currentUser');
    userRole = localStorage.getItem('userRole');

    if (authToken && currentUser && userRole) {
        updateUIForAuthenticatedUser();
    }
}

function updateUIForAuthenticatedUser() {
    const authBtn = document.getElementById('authBtn');
    authBtn.textContent = 'Logout';
    authBtn.onclick = handleLogout;

    if (userRole === 'STUDENT') {
        document.getElementById('dashboardLink').style.display = 'block';
        loadStudentDashboard();
    } else if (userRole === 'ADMIN') {
        document.getElementById('adminLink').style.display = 'block';
        loadAdminPanel();
    }
}

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;