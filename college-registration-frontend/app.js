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
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Admin forms
    const addStudentForm = document.getElementById('addStudentForm');
    const addCourseForm = document.getElementById('addCourseForm');

    if (addStudentForm) {
        addStudentForm.addEventListener('submit', handleAddStudent);
    }
    if (addCourseForm) {
        addCourseForm.addEventListener('submit', handleAddCourse);
    }

    // Course search
    const courseSearch = document.getElementById('courseSearch');
    if (courseSearch) {
        courseSearch.addEventListener('input', handleCourseSearch);
    }

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = e.target.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                scrollToSection(href.substring(1));
            }
        });
    });
}

function checkAuthentication() {
    // Note: Using memory variables instead of localStorage
    // authToken, currentUser, and userRole are already initialized above

    if (authToken && currentUser && userRole) {
        updateUIForAuthenticatedUser();
    }
}

function updateUIForAuthenticatedUser() {
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        authBtn.textContent = 'Logout';
        authBtn.onclick = handleLogout;
    }

    if (userRole === 'STUDENT') {
        const dashboardLink = document.getElementById('dashboardLink');
        if (dashboardLink) {
            dashboardLink.style.display = 'block';
        }
        loadStudentDashboard();
    } else if (userRole === 'ADMIN') {
        const adminLink = document.getElementById('adminLink');
        if (adminLink) {
            adminLink.style.display = 'block';
        }
        loadAdminPanel();
    }
}

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const messageEl = document.getElementById('loginMessage');

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data.username;
            userRole = data.role;

            showMessage(messageEl, 'Login successful!', 'success');
            setTimeout(() => {
                closeAuthModal();
                updateUIForAuthenticatedUser();
            }, 1000);
        } else {
            showMessage(messageEl, data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage(messageEl, 'Connection error. Please check if backend is running.', 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;
    const messageEl = document.getElementById('signupMessage');

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(messageEl, 'Signup successful! Please login.', 'success');
            setTimeout(() => {
                switchAuthTab('login');
            }, 1500);
        } else {
            showMessage(messageEl, data.message || 'Signup failed', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showMessage(messageEl, 'Connection error. Please check if backend is running.', 'error');
    }
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    userRole = null;

    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        authBtn.textContent = 'Login';
        authBtn.onclick = showAuthModal;
    }

    const dashboardLink = document.getElementById('dashboardLink');
    const adminLink = document.getElementById('adminLink');

    if (dashboardLink) dashboardLink.style.display = 'none';
    if (adminLink) adminLink.style.display = 'none';

    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('admin').style.display = 'none';

    scrollToSection('home');
}

// Course functions
async function loadCourses() {
    const coursesGrid = document.getElementById('coursesGrid');

    try {
        const response = await fetch(`${API_BASE_URL}/api/courses`);
        const courses = await response.json();

        if (courses && courses.length > 0) {
            displayCourses(courses);
        } else {
            coursesGrid.innerHTML = '<p class="loading">No courses available</p>';
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        coursesGrid.innerHTML = '<p class="loading">Error loading courses. Please check backend connection.</p>';
    }
}

function displayCourses(courses) {
    const coursesGrid = document.getElementById('coursesGrid');
    coursesGrid.innerHTML = courses.map(course => `
        <div class="course-card">
            <span class="course-code">${course.courseCode}</span>
            <h3 class="course-name">${course.courseName}</h3>
            <div class="course-info">
                <span>Capacity: ${course.capacity}</span>
                <span>Available: ${course.capacity - (course.enrolledStudents?.length || 0)}</span>
            </div>
        </div>
    `).join('');
}

function handleCourseSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const courseCards = document.querySelectorAll('.course-card');

    courseCards.forEach(card => {
        const courseName = card.querySelector('.course-name').textContent.toLowerCase();
        const courseCode = card.querySelector('.course-code').textContent.toLowerCase();

        if (courseName.includes(searchTerm) || courseCode.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Student Dashboard
async function loadStudentDashboard() {
    document.getElementById('dashboard').style.display = 'block';
    scrollToSection('dashboard');

    try {
        // Load student profile
        const profileResponse = await fetch(`${API_BASE_URL}/api/students/profile`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (profileResponse.ok) {
            const student = await profileResponse.json();
            document.getElementById('studentId').textContent = student.studentId;
            document.getElementById('studentName').textContent = student.name;

            // Display enrolled courses
            displayEnrolledCourses(student.enrolledCourses || []);
        }

        // Load available courses for enrollment
        const coursesResponse = await fetch(`${API_BASE_URL}/api/courses`);
        const courses = await coursesResponse.json();

        const courseSelect = document.getElementById('courseSelect');
        courseSelect.innerHTML = '<option value="">Select a course...</option>' +
            courses.map(course => `<option value="${course.courseCode}">${course.courseCode} - ${course.courseName}</option>`).join('');

    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function displayEnrolledCourses(courses) {
    const enrolledCoursesEl = document.getElementById('enrolledCourses');

    if (courses.length === 0) {
        enrolledCoursesEl.innerHTML = '<p class="loading">No enrolled courses</p>';
    } else {
        enrolledCoursesEl.innerHTML = courses.map(course => `
            <div class="enrolled-course-item">
                <strong>${course.courseCode}</strong> - ${course.courseName}
                <button class="btn btn-danger btn-sm" onclick="unenrollFromCourse('${course.courseCode}')">Drop</button>
            </div>
        `).join('');
    }
}

async function enrollInCourse() {
    const courseCode = document.getElementById('courseSelect').value;

    if (!courseCode) {
        alert('Please select a course');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/students/enroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ courseCode })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Successfully enrolled in course!');
            loadStudentDashboard();
        } else {
            alert(data.message || 'Enrollment failed');
        }
    } catch (error) {
        console.error('Enrollment error:', error);
        alert('Connection error');
    }
}

async function unenrollFromCourse(courseCode) {
    if (!confirm('Are you sure you want to drop this course?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/students/unenroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ courseCode })
        });

        if (response.ok) {
            alert('Successfully dropped course!');
            loadStudentDashboard();
        } else {
            alert('Failed to drop course');
        }
    } catch (error) {
        console.error('Unenroll error:', error);
        alert('Connection error');
    }
}

// Admin Panel
async function loadAdminPanel() {
    document.getElementById('admin').style.display = 'block';
    scrollToSection('admin');
    loadStudents();
    loadAdminCourses();
}

async function loadStudents() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/students`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const students = await response.json();
        displayStudents(students);
    } catch (error) {
        console.error('Error loading students:', error);
        document.getElementById('studentsTableBody').innerHTML = '<tr><td colspan="4">Error loading students</td></tr>';
    }
}

function displayStudents(students) {
    const tbody = document.getElementById('studentsTableBody');

    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="loading">No students found</td></tr>';
    } else {
        tbody.innerHTML = students.map(student => `
            <tr>
                <td>${student.studentId}</td>
                <td>${student.name}</td>
                <td>${student.enrolledCourses?.length || 0} courses</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteStudent('${student.studentId}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }
}

async function loadAdminCourses() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/courses`);
        const courses = await response.json();
        displayAdminCourses(courses);
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

function displayAdminCourses(courses) {
    const tbody = document.getElementById('coursesTableBody');

    if (courses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="loading">No courses found</td></tr>';
    } else {
        tbody.innerHTML = courses.map(course => `
            <tr>
                <td>${course.courseCode}</td>
                <td>${course.courseName}</td>
                <td>${course.capacity}</td>
                <td>${course.enrolledStudents?.length || 0}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteCourse('${course.courseCode}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }
}

async function handleAddStudent(e) {
    e.preventDefault();
    const studentId = document.getElementById('newStudentId').value;
    const name = document.getElementById('newStudentName').value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ studentId, name })
        });

        if (response.ok) {
            alert('Student added successfully!');
            closeAddStudentModal();
            loadStudents();
            e.target.reset();
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to add student');
        }
    } catch (error) {
        console.error('Error adding student:', error);
        alert('Connection error');
    }
}

async function handleAddCourse(e) {
    e.preventDefault();
    const courseCode = document.getElementById('newCourseCode').value;
    const courseName = document.getElementById('newCourseName').value;
    const capacity = parseInt(document.getElementById('newCourseCapacity').value);

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ courseCode, courseName, capacity })
        });

        if (response.ok) {
            alert('Course added successfully!');
            closeAddCourseModal();
            loadAdminCourses();
            loadCourses(); // Refresh public courses list
            e.target.reset();
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to add course');
        }
    } catch (error) {
        console.error('Error adding course:', error);
        alert('Connection error');
    }
}

async function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/students/${studentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            alert('Student deleted successfully!');
            loadStudents();
        } else {
            alert('Failed to delete student');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        alert('Connection error');
    }
}

async function deleteCourse(courseCode) {
    if (!confirm('Are you sure you want to delete this course?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseCode}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            alert('Course deleted successfully!');
            loadAdminCourses();
            loadCourses(); // Refresh public courses list
        } else {
            alert('Failed to delete course');
        }
    } catch (error) {
        console.error('Error deleting course:', error);
        alert('Connection error');
    }
}

// UI Helper functions
function showAuthModal() {
    document.getElementById('authModal').style.display = 'block';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function showAddStudentModal() {
    document.getElementById('addStudentModal').style.display = 'block';
}

function closeAddStudentModal() {
    document.getElementById('addStudentModal').style.display = 'none';
}

function showAddCourseModal() {
    document.getElementById('addCourseModal').style.display = 'block';
}

function closeAddCourseModal() {
    document.getElementById('addCourseModal').style.display = 'none';
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

    if (tab === 'login') {
        document.querySelector('.auth-tab:first-child').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.querySelector('.auth-tab:last-child').classList.add('active');
        document.getElementById('signupForm').classList.add('active');
    }
}

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    if (tab === 'students') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('studentsTab').classList.add('active');
    } else {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('coursesTab').classList.add('active');
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}