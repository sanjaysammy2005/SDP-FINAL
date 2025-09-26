package com.klef.sdp.service;

//import java.io.ObjectInputFilter.Status;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.sdp.model.Employee;
import com.klef.sdp.model.Manager;
import com.klef.sdp.repository.EmployeeRepo;
import com.klef.sdp.repository.ManagerRepo;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;



@Service
public class EmployeeService {
	@Autowired
    private EmployeeRepo repo;
	@Autowired
	private ManagerRepo mrepo;
	
    //@Autowired
    //private EmailService emailService;
    public void addEmployee(Employee employee) {
        repo.save(employee);
    }

    public List<Employee> getEmployees() {
        return repo.findAll();
    }
    public List<Employee> getEmployeesByManager(Long managerId) {
        return repo.findByManagerId(managerId);
    }
    @Transactional
    public Employee updateEmployeeStatus(Long id, com.klef.sdp.enums.Status status) {  // Change String to Status
        Employee employee = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        employee.setStatus(status);  
        return repo.save(employee);
    }

	public Manager findManagerById(Long managerId) {
			// TODO Auto-generated method stub
			return mrepo.findById(managerId).orElse(null);
			
		}
	public Employee findByEmail(String email) {
	    return repo.findByEmail(email);
	}
    @Transactional(readOnly = true)
    public Optional<Employee> getEmployeeById(Long id) {
        return repo.findById(id);
    }
    
    // --- NEW METHOD: Update Employee Profile ---
    @Transactional
    public Employee updateEmployeeProfile(Long id, Employee employeeDetails) {
        Employee existingEmployee = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        
        // Update fields an employee can change
        existingEmployee.setName(employeeDetails.getName());
        
        // Only update password if a new one is provided
        if (employeeDetails.getPassword() != null && !employeeDetails.getPassword().isEmpty()) {
            existingEmployee.setPassword(employeeDetails.getPassword());
        }
        
        return repo.save(existingEmployee);
    }
    

	


	
}
