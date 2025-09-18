package com.example.CollegeCourseRegistration.services;

import com.example.CollegeCourseRegistration.models.Course;
import com.example.CollegeCourseRegistration.models.Student;
import com.example.CollegeCourseRegistration.repositories.CourseRepository;
import com.example.CollegeCourseRegistration.repositories.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    private final CourseRepository courseRepository;

    // Constructor injection
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    // Fetch all courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Fetch course by courseCode
    public Optional<Course> getCourseById(String courseCode) {
        return courseRepository.findById(courseCode);
    }

    // Create a course
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    // Update a course by courseCode
    public Course updateCourse(String courseCode, Course updatedCourse) {
        return courseRepository.findById(courseCode)
                .map(course -> {
                    course.setCourseName(updatedCourse.getCourseName());
                    course.setCapacity(updatedCourse.getCapacity());
                    return courseRepository.save(course);
                })
                .orElseThrow(() -> new RuntimeException("Course not found with code: " + courseCode));
    }

    // Delete a course by courseCode
    public void deleteCourse(String courseCode) {
        if (!courseRepository.existsById(courseCode)) {
            throw new RuntimeException("Course not found with code: " + courseCode);
        }
        courseRepository.deleteById(courseCode);
    }

    // Fetch students in course
    public List<Student> getEnrolledStudents(String courseCode) {
        Course course = courseRepository.findById(courseCode)
                .orElseThrow(() -> new RuntimeException("Course not found with courseCode: " + courseCode));
        return course.getStudents();
    }



}
