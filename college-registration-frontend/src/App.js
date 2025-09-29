import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Plus, Search, AlertCircle, CheckCircle, X, Edit2, Trash2, UserPlus } from 'lucide-react';

// API Base URL - Change this to your Spring Boot server URL
const API_BASE_URL = 'http://localhost:8080';

const App = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Form states
  const [studentForm, setStudentForm] = useState({ studentId: '', name: '' });
  const [courseForm, setCourseForm] = useState({ courseCode: '', courseName: '', capacity: '' });
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  // Modal states
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  // Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  // API calls
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/students`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      showMessage('Failed to fetch students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/courses`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      showMessage('Failed to fetch courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      if (response.ok) {
        fetchStudents();
        showMessage('Student created successfully');
        resetStudentForm();
      } else {
        showMessage('Failed to create student', 'error');
      }
    } catch (error) {
      showMessage('Error creating student', 'error');
    }
  };

  const updateStudent = async (studentId, studentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      if (response.ok) {
        fetchStudents();
        showMessage('Student updated successfully');
        resetStudentForm();
      } else {
        showMessage('Failed to update student', 'error');
      }
    } catch (error) {
      showMessage('Error updating student', 'error');
    }
  };

  const deleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchStudents();
          showMessage('Student deleted successfully');
        } else {
          showMessage('Failed to delete student', 'error');
        }
      } catch (error) {
        showMessage('Error deleting student', 'error');
      }
    }
  };

  const createCourse = async (courseData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });
      if (response.ok) {
        fetchCourses();
        showMessage('Course created successfully');
        resetCourseForm();
      } else {
        showMessage('Failed to create course', 'error');
      }
    } catch (error) {
      showMessage('Error creating course', 'error');
    }
  };

  const updateCourse = async (courseCode, courseData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });
      if (response.ok) {
        fetchCourses();
        showMessage('Course updated successfully');
        resetCourseForm();
      } else {
        showMessage('Failed to update course', 'error');
      }
    } catch (error) {
      showMessage('Error updating course', 'error');
    }
  };

  const deleteCourse = async (courseCode) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/courses/${courseCode}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchCourses();
          showMessage('Course deleted successfully');
        } else {
          showMessage('Failed to delete course', 'error');
        }
      } catch (error) {
        showMessage('Error deleting course', 'error');
      }
    }
  };

  const enrollStudent = async (studentId, courseCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}/enroll/${courseCode}`, {
        method: 'POST'
      });
      if (response.ok) {
        const message = await response.text();
        showMessage(message);
        fetchStudents();
        fetchCourses();
        setShowEnrollModal(false);
      } else {
        showMessage('Enrollment failed', 'error');
      }
    } catch (error) {
      showMessage('Error during enrollment', 'error');
    }
  };

  // Form handlers
  const handleStudentSubmit = () => {
    if (!studentForm.studentId.trim() || !studentForm.name.trim()) {
      showMessage('Please fill in all fields', 'error');
      return;
    }
    if (editingStudent) {
      updateStudent(editingStudent.studentId, studentForm);
    } else {
      createStudent(studentForm);
    }
  };

  const handleCourseSubmit = () => {
    if (!courseForm.courseCode.trim() || !courseForm.courseName.trim() || !courseForm.capacity) {
      showMessage('Please fill in all fields', 'error');
      return;
    }
    const courseData = { ...courseForm, capacity: parseInt(courseForm.capacity) };
    if (editingCourse) {
      updateCourse(editingCourse.courseCode, courseData);
    } else {
      createCourse(courseData);
    }
  };

  const handleEnrollSubmit = () => {
    if (!selectedStudent || !selectedCourse) {
      showMessage('Please select both student and course', 'error');
      return;
    }
    enrollStudent(selectedStudent, selectedCourse);
  };

  const resetStudentForm = () => {
    setStudentForm({ studentId: '', name: '' });
    setEditingStudent(null);
    setShowStudentModal(false);
  };

  const resetCourseForm = () => {
    setCourseForm({ courseCode: '', courseName: '', capacity: '' });
    setEditingCourse(null);
    setShowCourseModal(false);
  };

  const startEditStudent = (student) => {
    setStudentForm({ studentId: student.studentId, name: student.name });
    setEditingStudent(student);
    setShowStudentModal(true);
  };

  const startEditCourse = (course) => {
    setCourseForm({
      courseCode: course.courseCode,
      courseName: course.courseName,
      capacity: course.capacity.toString()
    });
    setEditingCourse(course);
    setShowCourseModal(true);
  };

  // Filter functions
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.studentId.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(courseSearch.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">College Course Registration</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className={`fixed top-20 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg ${
          messageType === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {messageType === 'error' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
          <span>{message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'students'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Students</span>
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'courses'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="h-5 w-5" />
            <span>Courses</span>
          </button>
        </div>

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEnrollModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Enroll Student</span>
                </button>
                <button
                  onClick={() => setShowStudentModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Student</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Courses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {student.registeredCourses ? student.registeredCourses.length : 0} courses
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => startEditStudent(student)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteStudent(student.studentId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={() => setShowCourseModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Course</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCourses.map((course) => (
                    <tr key={course.courseCode} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {course.courseCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.courseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {course.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {course.students ? course.students.length : 0} students
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => startEditCourse(course)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteCourse(course.courseCode)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h2>
              <button onClick={resetStudentForm}>
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={studentForm.studentId}
                    onChange={(e) => setStudentForm({...studentForm, studentId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={editingStudent}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleStudentSubmit}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingStudent ? 'Update' : 'Create'}
                </button>
                <button
                  onClick={resetStudentForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h2>
              <button onClick={resetCourseForm}>
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={courseForm.courseCode}
                    onChange={(e) => setCourseForm({...courseForm, courseCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={editingCourse}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={courseForm.courseName}
                    onChange={(e) => setCourseForm({...courseForm, courseName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={courseForm.capacity}
                    onChange={(e) => setCourseForm({...courseForm, capacity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCourseSubmit}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingCourse ? 'Update' : 'Create'}
                </button>
                <button
                  onClick={resetCourseForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Enroll Student in Course</h2>
              <button onClick={() => setShowEnrollModal(false)}>
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Student
                  </label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a student...</option>
                    {students.map(student => (
                      <option key={student.studentId} value={student.studentId}>
                        {student.studentId} - {student.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Course
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a course...</option>
                    {courses.map(course => (
                      <option key={course.courseCode} value={course.courseCode}>
                        {course.courseCode} - {course.courseName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleEnrollSubmit}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Enroll
                </button>
                <button
                  onClick={() => setShowEnrollModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;