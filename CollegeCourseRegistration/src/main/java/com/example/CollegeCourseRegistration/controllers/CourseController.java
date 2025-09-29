package com.example.CollegeCourseRegistration.controllers;

import com.example.CollegeCourseRegistration.models.Course;
import com.example.CollegeCourseRegistration.models.Student;
import com.example.CollegeCourseRegistration.services.CourseService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/courses")
public class CourseController {
    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // GET /courses -> accessible by everyone
    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    // GET /courses/{courseCode} -> accessible by everyone
    @GetMapping("/{courseCode}")
    public ResponseEntity<Course> getCourseById(@PathVariable String courseCode) {
        Optional<Course> courseOpt = courseService.getCourseById(courseCode);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(courseOpt.get());
    }

    // GET /courses/{courseCode}/students -> accessible by everyone
    @GetMapping("/{courseCode}/students")
    public List<Student> getCourseStudents(@PathVariable String courseCode) {
        return courseService.getEnrolledStudents(courseCode);
    }
}
