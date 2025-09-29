package com.example.CollegeCourseRegistration.controllers;

import com.example.CollegeCourseRegistration.models.Student;
import com.example.CollegeCourseRegistration.models.Course;
import com.example.CollegeCourseRegistration.services.StudentService;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
=======
import com.example.CollegeCourseRegistration.services.CourseService;
import org.springframework.web.bind.annotation.*;
>>>>>>> df131cdca1375f03440cc46f705166dc63fcabfb

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService){
        this.studentService = studentService;
    }

<<<<<<< HEAD
    // GET /students/{studentId} -> student can fetch only their own record
    @PreAuthorize("#studentId == authentication.name")
=======
    // GET /students -> fetch all students
    @GetMapping
    public List<Student> getAllStudents(){
        return studentService.getAllStudents();
    }

    // POST /students -> add a new student
    @PostMapping
    public Student createStudent(@RequestBody Student student){
        return studentService.createStudent(student);
    }

    // GET /students/{id} -> fetch a single student
>>>>>>> df131cdca1375f03440cc46f705166dc63fcabfb
    @GetMapping("/{studentId}")
    public Student getStudentById(@PathVariable String studentId){
        return studentService.getStudentById(studentId);
    }

<<<<<<< HEAD
    // PUT /students/{studentId} -> student can update only themselves
    @PreAuthorize("#studentId == authentication.name")
=======
    // PUT /students/{id} -> update student
>>>>>>> df131cdca1375f03440cc46f705166dc63fcabfb
    @PutMapping("/{studentId}")
    public Student updateStudent(@PathVariable String studentId, @RequestBody Student updatedStudent){
        return studentService.updateStudent(studentId, updatedStudent);
    }

<<<<<<< HEAD
    // POST /students/{studentId}/enroll/{courseCode} -> only the student themselves can enroll
    @PreAuthorize("#studentId == authentication.name")
=======
    // DELETE /students/{id} -> delete student
    @DeleteMapping("/{studentId}")
    public String deleteStudent(@PathVariable String studentId){
        return studentService.deleteStudent(studentId);
    }

    //Enroll student
>>>>>>> df131cdca1375f03440cc46f705166dc63fcabfb
    @PostMapping("/{studentId}/enroll/{courseCode}")
    public String enrollStudent(@PathVariable String studentId, @PathVariable String courseCode) {
        return studentService.enrollCourse(studentId, courseCode);
    }

<<<<<<< HEAD
    // GET /students/{studentId}/courses -> only the student themselves can view
    @PreAuthorize("#studentId == authentication.name")
=======
    //fetch enrolled courses for a student
>>>>>>> df131cdca1375f03440cc46f705166dc63fcabfb
    @GetMapping("/{studentId}/courses")
    public List<Course> getStudentCourses(@PathVariable String studentId) {
        return studentService.getEnrolledCourses(studentId);
    }
<<<<<<< HEAD
=======

>>>>>>> df131cdca1375f03440cc46f705166dc63fcabfb
}
