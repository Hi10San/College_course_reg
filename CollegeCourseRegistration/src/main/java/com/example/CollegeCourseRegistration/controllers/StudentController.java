package com.example.CollegeCourseRegistration.controllers;

import com.example.CollegeCourseRegistration.models.Student;
import com.example.CollegeCourseRegistration.models.Course;
import com.example.CollegeCourseRegistration.services.StudentService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService){
        this.studentService = studentService;
    }

    // GET /students/{studentId} -> student can fetch only their own record
    @PreAuthorize("#studentId == authentication.name")
    @GetMapping("/{studentId}")
    public Student getStudentById(@PathVariable String studentId){
        return studentService.getStudentById(studentId);
    }

    // PUT /students/{studentId} -> student can update only themselves
    @PreAuthorize("#studentId == authentication.name")
    @PutMapping("/{studentId}")
    public Student updateStudent(@PathVariable String studentId, @RequestBody Student updatedStudent){
        return studentService.updateStudent(studentId, updatedStudent);
    }

    // POST /students/{studentId}/enroll/{courseCode} -> only the student themselves can enroll
    @PreAuthorize("#studentId == authentication.name")
    @PostMapping("/{studentId}/enroll/{courseCode}")
    public String enrollStudent(@PathVariable String studentId, @PathVariable String courseCode) {
        return studentService.enrollCourse(studentId, courseCode);
    }

    // GET /students/{studentId}/courses -> only the student themselves can view
    @PreAuthorize("#studentId == authentication.name")
    @GetMapping("/{studentId}/courses")
    public List<Course> getStudentCourses(@PathVariable String studentId) {
        return studentService.getEnrolledCourses(studentId);
    }
}
