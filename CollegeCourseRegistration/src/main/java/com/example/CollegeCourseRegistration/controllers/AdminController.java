package com.example.CollegeCourseRegistration.controllers;

import com.example.CollegeCourseRegistration.models.Student;
import com.example.CollegeCourseRegistration.models.Course;
import com.example.CollegeCourseRegistration.services.StudentService;
import com.example.CollegeCourseRegistration.services.CourseService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')") // All endpoints restricted to ADMIN
public class AdminController {

    private final StudentService studentService;
    private final CourseService courseService;

    public AdminController(StudentService studentService, CourseService courseService) {
        this.studentService = studentService;
        this.courseService = courseService;
    }

    // ===================== STUDENT MANAGEMENT =====================
    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @PostMapping("/students")
    public Student createStudent(@RequestBody Student student) {
        return studentService.createStudent(student);
    }

    @GetMapping("/students/{studentId}")
    public Student getStudentById(@PathVariable String studentId) {
        return studentService.getStudentById(studentId);
    }

    @PutMapping("/students/{studentId}")
    public Student updateStudent(@PathVariable String studentId, @RequestBody Student updatedStudent) {
        return studentService.updateStudent(studentId, updatedStudent);
    }

    @DeleteMapping("/students/{studentId}")
    public String deleteStudent(@PathVariable String studentId) {
        return studentService.deleteStudent(studentId);
    }

    // ===================== COURSE MANAGEMENT =====================
    @GetMapping("/courses")
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @PostMapping("/courses")
    public Course createCourse(@RequestBody Course course) {
        return courseService.createCourse(course);
    }

    @GetMapping("/courses/{courseCode}")
    public ResponseEntity<Course> getCourseById(@PathVariable String courseCode) {
        Optional<Course> courseOpt = courseService.getCourseById(courseCode);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(courseOpt.get());
    }

    @PutMapping("/courses/{courseCode}")
    public Course updateCourse(@PathVariable String courseCode, @RequestBody Course course) {
        return courseService.updateCourse(courseCode, course);
    }

    @DeleteMapping("/courses/{courseCode}")
    public ResponseEntity<String> deleteCourse(@PathVariable String courseCode) {
        try {
            courseService.deleteCourse(courseCode);
            return ResponseEntity.ok("Course with code " + courseCode + " deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/courses/{courseCode}/students")
    public List<Student> getCourseStudents(@PathVariable String courseCode) {
        return courseService.getEnrolledStudents(courseCode);
    }
}
