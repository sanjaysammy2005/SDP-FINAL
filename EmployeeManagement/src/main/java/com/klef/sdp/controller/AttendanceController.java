package com.klef.sdp.controller;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.klef.sdp.enums.AttendanceStatus;
import com.klef.sdp.model.Attendance;
import com.klef.sdp.service.AttendanceService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
	@Autowired
    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping
    public ResponseEntity<Attendance> markAttendance(
            @RequestParam Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam AttendanceStatus status) {
        
        Attendance attendance = attendanceService.markAttendance(employeeId, date, status);
        
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(attendance.getId())
                .toUri();
        
        return ResponseEntity.created(location).body(attendance);
    }

    // New endpoint for Daily View
    @GetMapping("/employee/{employeeId}/date")
    public ResponseEntity<Attendance> getAttendanceByEmployeeAndDate(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return attendanceService.getAttendanceByEmployeeAndDate(employeeId, date)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendanceRecords() {
        return ResponseEntity.ok(attendanceService.getAllAttendanceRecords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Attendance> getAttendanceById(@PathVariable Long id) {
        return attendanceService.getAttendanceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Attendance>> getAttendanceByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByEmployeeId(employeeId));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Attendance>> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Attendance>> getAttendanceByStatus(@PathVariable AttendanceStatus status) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStatus(status));
    }

    @GetMapping("/employee/{employeeId}/range")
    public ResponseEntity<List<Attendance>> getAttendanceByEmployeeAndDateRange(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(attendanceService.getAttendanceByEmployeeAndDateRange(
                employeeId, startDate, endDate));
    }

    @GetMapping("/employee/{employeeId}/month")
    public ResponseEntity<List<Attendance>> getAttendanceByEmployeeAndMonth(
            @PathVariable Long employeeId,
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(attendanceService.getAttendanceByEmployeeAndMonth(employeeId, year, month));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendanceRecord(@PathVariable Long id) {
        attendanceService.deleteAttendanceRecord(id);
        return ResponseEntity.noContent().build();
    }
}