package com.empoderat.repository.mongobd;

import com.empoderat.model.mongodb.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    
    List<Resource> findByCourseId(Long courseId);
    
    List<Resource> findByCourseIdAndModuleId(Long courseId, Long moduleId);
    
    List<Resource> findByCourseIdAndType(Long courseId, Resource.ResourceType type);
}