package com.group.project.receptionist;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/receptionist")
@CrossOrigin(origins = "*")
public class ReceptionistController {

    @GetMapping("/appointments")
    public ResponseEntity<?> getAllAppointments(@RequestParam(required = false) String date) {
        // TODO: Implement get all appointments logic
        return ResponseEntity.ok("Get all appointments endpoint - to be implemented");
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> scheduleAppointment(@RequestBody Object request) {
        // TODO: Implement schedule appointment logic
        return ResponseEntity.ok("Schedule appointment endpoint - to be implemented");
    }

    @PutMapping("/appointments/{appointmentId}")
    public ResponseEntity<?> updateAppointment(@PathVariable String appointmentId, @RequestBody Object request) {
        // TODO: Implement update appointment logic
        return ResponseEntity.ok("Update appointment endpoint - to be implemented");
    }

    @DeleteMapping("/appointments/{appointmentId}")
    public ResponseEntity<?> cancelAppointment(@PathVariable String appointmentId) {
        // TODO: Implement cancel appointment logic
        return ResponseEntity.ok("Cancel appointment endpoint - to be implemented");
    }

    @GetMapping("/schedule")
    public ResponseEntity<?> getSchedule(@RequestParam String date) {
        // TODO: Implement get schedule logic
        return ResponseEntity.ok("Get schedule endpoint - to be implemented");
    }
}


