package com.example.CollegeCourseRegistration.controllers;

import com.example.CollegeCourseRegistration.models.Student;
import com.example.CollegeCourseRegistration.models.Course;
import com.example.CollegeCourseRegistration.services.StudentService;
import com.example.CollegeCourseRegistration.services.CourseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService){
        this.studentService = studentService;
    }

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
    @GetMapping("/{studentId}")
    public Student getStudentById(@PathVariable String studentId){
        return studentService.getStudentById(studentId);
    }

    // PUT /students/{id} -> update student
    @PutMapping("/{studentId}")
    public Student updateStudent(@PathVariable String studentId, @RequestBody Student updatedStudent){
        return studentService.updateStudent(studentId, updatedStudent);
    }

    // DELETE /students/{id} -> delete student
    @DeleteMapping("/{studentId}")
    public String deleteStudent(@PathVariable String studentId){
        return studentService.deleteStudent(studentId);
    }

    //Enroll student
    @PostMapping("/{studentId}/enroll/{courseCode}")
    public String enrollStudent(@PathVariable String studentId, @PathVariable String courseCode) {
        return studentService.enrollCourse(studentId, courseCode);
    }

    //fetch enrolled courses for a student
    @GetMapping("/{studentId}/courses")
    public List<Course> getStudentCourses(@PathVariable String studentId) {
        return studentService.getEnrolledCourses(studentId);
    }

}
