package com.example.CollegeCourseRegistration.controllers;

import com.example.CollegeCourseRegistration.models.Course;
import com.example.CollegeCourseRegistration.models.Student;
import com.example.CollegeCourseRegistration.services.CourseService;
import com.example.CollegeCourseRegistration.services.StudentService;
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

    // GET /courses
    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    // GET /courses/{courseCode}
    @GetMapping("/{courseCode}")
    public ResponseEntity<Course> getCourseById(@PathVariable String courseCode) {
        Optional<Course> courseOpt = courseService.getCourseById(courseCode);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
        return ResponseEntity.ok(courseOpt.get());
    }

    // POST /courses
    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return courseService.createCourse(course);
    }

    // PUT /courses/{courseCode}
    @PutMapping("/{courseCode}")
    public Course updateCourse(@PathVariable String courseCode, @RequestBody Course course) {
        return courseService.updateCourse(courseCode, course);
    }

    // DELETE /courses/{courseCode}
    @DeleteMapping("/{courseCode}")
    public ResponseEntity<String> deleteCourse(@PathVariable String courseCode) {
        try {
            courseService.deleteCourse(courseCode);
            return ResponseEntity.ok("Course with code " + courseCode + " deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Fetch Student in a course
    @GetMapping("/{courseCode}/students")
    public List<Student> getCourseStudents(@PathVariable String courseCode) {
        return courseService.getEnrolledStudents(courseCode);
    }

}
