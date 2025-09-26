package com.klef.sdp.controller;

import java.util.List;
//import java.util.Map;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.klef.sdp.enums.AttendanceStatus;
import com.klef.sdp.model.Attendance;
import com.klef.sdp.model.PayrollSummary;
import com.klef.sdp.service.AttendanceService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    @Autowired
    private AttendanceService attendanceService;

    // A simple endpoint to get a constant daily wage. In a real app, this would be dynamic.
    private static final double DAILY_WAGE = 500.00; // Example daily wage

    @GetMapping("/employee/{employeeId}/month")
    public ResponseEntity<PayrollSummary> getEmployeePayroll(
            @PathVariable Long employeeId,
            @RequestParam int year,
            @RequestParam int month) {
        
        List<Attendance> attendanceRecords = attendanceService.getAttendanceByEmployeeAndMonth(employeeId, year, month);

        int presentDays = 0;
        int leaveDays = 0;
        int absentDays = 0;

        for (Attendance record : attendanceRecords) {
            if (record.getStatus() == AttendanceStatus.PRESENT) {
                presentDays++;
            } else if (record.getStatus() == AttendanceStatus.LEAVE) {
                leaveDays++;
            } else {
                absentDays++;
            }
        }
        
        // Basic salary calculation
        double basicSalary = presentDays * DAILY_WAGE;

        // Example deduction calculation (e.g., half a day's wage for every absent day)
        double totalDeductions = absentDays * (DAILY_WAGE / 2);

        double netSalary = basicSalary - totalDeductions;

        String monthYear = LocalDate.of(year, month, 1)
                                   .getMonth()
                                   .toString()
                                   .substring(0, 1)
                                   .toUpperCase() + 
                           LocalDate.of(year, month, 1)
                                   .getMonth()
                                   .toString()
                                   .substring(1) + " " + year;

        PayrollSummary payrollSummary = new PayrollSummary(
            monthYear,
            presentDays,
            leaveDays,
            absentDays,
            DAILY_WAGE,
            basicSalary,
            totalDeductions,
            netSalary
        );

        return ResponseEntity.ok(payrollSummary);
    }
}
