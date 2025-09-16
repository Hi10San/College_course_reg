package com.example.CollegeCourseRegistration.repositories;
import com.example.CollegeCourseRegistration.models.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, String> {
}
