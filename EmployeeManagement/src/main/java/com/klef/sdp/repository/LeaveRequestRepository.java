package com.klef.sdp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.klef.sdp.enums.LeaveStatus;
import com.klef.sdp.model.LeaveRequest;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    
    // Corrected method name below
    List<LeaveRequest> findByEmployee_Id(Long employeeId);
    
    List<LeaveRequest> findByStatus(LeaveStatus status);
    
    boolean existsByEmployee_IdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatus(
            Long employeeId, LocalDate endDate, LocalDate startDate, LeaveStatus status);

    List<LeaveRequest> findByEmployee_Manager_Id(Long managerId);
}