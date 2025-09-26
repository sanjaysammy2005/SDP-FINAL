package com.klef.sdp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
//import java.util.Optional;


import com.klef.sdp.model.Manager;
import com.klef.sdp.service.ManagerService;

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("*")
@RestController
@RequestMapping("/manager")
public class ManagerController {
	@Autowired
	private ManagerService service;
	@PostMapping("/addManager")
	public void addManager(@RequestBody com.klef.sdp.model.Manager manager) {
		service.addManager(manager);
		
	}
    @GetMapping("/allManagers")
    public List<Manager> getManagers() {
        return service.getManagers();  
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password) {
        Manager manager = service.findByEmail(email);

        if (manager == null || !manager.getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        // Return only necessary details
        Map<String, Object> response = new HashMap<>();
        response.put("id", manager.getId());  
        response.put("name", manager.getName());
        response.put("email", manager.getEmail());

        return ResponseEntity.ok(response);
    }
    @PutMapping("/profile/{id}")
    public ResponseEntity<Manager> updateManagerProfile(
            @PathVariable Long id,
            @RequestBody Manager managerDetails) {
        
        Manager existingManager = service.findById(id);
        
        if (existingManager == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Update allowed fields
        existingManager.setName(managerDetails.getName());
        
        // Only update password if a new one is provided
        if (managerDetails.getPassword() != null && !managerDetails.getPassword().isEmpty()) {
            existingManager.setPassword(managerDetails.getPassword());
        }
        
        // Save the updated manager (reusing existing update method)
        service.updateManager(existingManager);
        
        return ResponseEntity.ok(existingManager);
    }


}
