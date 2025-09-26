package com.klef.sdp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import com.klef.sdp.enums.LeaveStatus;
import com.klef.sdp.model.LeaveRequest;
import com.klef.sdp.service.LeaveRequestService;
import java.net.URI;
import java.time.LocalDate;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    @PostMapping
    public ResponseEntity<LeaveRequest> createLeaveRequest(
            @RequestParam Long employeeId,
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) String description) {

        if (leaveRequestService.isLeaveRequestOverlapping(employeeId,
                LocalDate.parse(startDate), LocalDate.parse(endDate))) {
            return ResponseEntity.badRequest().body(null);
        }

        LeaveRequest createdRequest = leaveRequestService.createLeaveRequest(
                employeeId,
                LocalDate.parse(startDate),
                LocalDate.parse(endDate),
                description);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdRequest.getId())
                .toUri();

        return ResponseEntity.created(location).body(createdRequest);
    }

    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
        return ResponseEntity.ok(leaveRequestService.getAllLeaveRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequest> getLeaveRequestById(@PathVariable Long id) {
        return leaveRequestService.getLeaveRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /*@GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestsByEmployeeId(employeeId));
    }*/

    @GetMapping("/status/{status}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByStatus(@PathVariable LeaveStatus status) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestsByStatus(status));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LeaveRequest> updateLeaveRequestStatus(
            @PathVariable Long id,
            @RequestParam LeaveStatus status) {
        return ResponseEntity.ok(leaveRequestService.updateLeaveRequestStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeaveRequest(@PathVariable Long id) {
        leaveRequestService.deleteLeaveRequest(id);
        return ResponseEntity.noContent().build();
    }

    // New endpoint to get leave requests by manager
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByManager(@PathVariable Long managerId) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestsByManagerId(managerId));
    }
}