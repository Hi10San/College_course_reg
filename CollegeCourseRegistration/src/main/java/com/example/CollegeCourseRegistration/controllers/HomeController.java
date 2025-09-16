package com.example.CollegeCourseRegistration.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "🎓 Welcome to College Course Registration API! <br>" +
                "Available endpoints: <br>" +
                "➡ /students <br>" +
                "➡ /courses";
    }
}
