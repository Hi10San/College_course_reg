package com.example.CollegeCourseRegistration.controllers;

import com.example.CollegeCourseRegistration.models.Course;
import com.example.CollegeCourseRegistration.models.Student;
import com.example.CollegeCourseRegistration.services.CourseService;
<<<<<<< HEAD
=======
import com.example.CollegeCourseRegistration.services.StudentService;
>>>>>>> df131cdca1375f03440cc46f705166dc63fcabfb
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

<<<<<<< HEAD
    // GET /courses -> accessible by everyone
=======
    // GET /courses
>>>>>>> df131cdca1375f03440cc46f705166dc63fcabfb
    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

<<<<<<< HEAD
    // GET /courses/{courseCode} -> accessible by everyone
=======
    // GET /courses/{courseCode}
>>>>>>> df131cdca1375f03440cc46f705166dc63fcabfb
    @GetMapping("/{courseCode}")
    public ResponseEntity<Course> getCourseById(@PathVariable String courseCode) {
        Optional<Course> courseOpt = courseService.getCourseById(courseCode);
        if (courseOpt.isEmpty()) {
<<<<<<< HEAD
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
=======
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
>>>>>>> df131cdca1375f03440cc46f705166dc63fcabfb
        }
        return ResponseEntity.ok(courseOpt.get());
    }

<<<<<<< HEAD
    // GET /courses/{courseCode}/students -> accessible by everyone
=======
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
>>>>>>> df131cdca1375f03440cc46f705166dc63fcabfb
    @GetMapping("/{courseCode}/students")
    public List<Student> getCourseStudents(@PathVariable String courseCode) {
        return courseService.getEnrolledStudents(courseCode);
    }
<<<<<<< HEAD
=======

>>>>>>> df131cdca1375f03440cc46f705166dc63fcabfb
}
