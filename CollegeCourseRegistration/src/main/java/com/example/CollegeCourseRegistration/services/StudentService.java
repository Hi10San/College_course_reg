package com.example.CollegeCourseRegistration.services;

import com.example.CollegeCourseRegistration.models.Student;
import com.example.CollegeCourseRegistration.models.Course;

import com.example.CollegeCourseRegistration.repositories.StudentRepository;
import com.example.CollegeCourseRegistration.repositories.CourseRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository; // add this




    public StudentService(StudentRepository studentRepository, CourseRepository courseRepository) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    // Fetch all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Create new student
    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    // Get student by ID
    public Student getStudentById(String studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with studentId: " + studentId));
    }


    // Update student
    public Student updateStudent(String studentId, Student updatedStudent) {
        return studentRepository.findById(studentId)
                .map(student -> {
                    student.setName(updatedStudent.getName());
                    student.setRegisteredCourses(updatedStudent.getRegisteredCourses());
                    return studentRepository.save(student);
                })
                .orElseThrow(() -> new RuntimeException("Student not found with studentId: " + studentId));
    }

    // Delete student
    public String deleteStudent(String studentId) {
        studentRepository.deleteById(studentId);
        return "Student with studentId: " + studentId + " has been removed";
    }

    // enroll student
    public String enrollCourse(String studentId, String courseCode) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with studentId: " + studentId));

        Course course = courseRepository.findById(courseCode)
                .orElseThrow(() -> new RuntimeException("Course not found with courseCode: " + courseCode));

        // Check if student already enrolled
        if (student.getRegisteredCourses().contains(course)) {
            return "Student is already enrolled in this course";
        }

        // Check course capacity
        if (course.getStudents().size() >= course.getCapacity()) {
            return "Course is full";
        }

        // Add student to course and course to student (bidirectional)
        student.getRegisteredCourses().add(course);
        course.getStudents().add(student);

        // Save both entities
        studentRepository.save(student);
        courseRepository.save(course);

        return "Enrollment successful";
    }

    //Fetch Enrolled Courses for a Student
    public List<Course> getEnrolledCourses(String studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with studentId: " + studentId));
        return student.getRegisteredCourses();
    }


}

