package com.example.CollegeCourseRegistration.repositories;
import com.example.CollegeCourseRegistration.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;
public interface StudentRepository extends JpaRepository<Student,String> {
}
