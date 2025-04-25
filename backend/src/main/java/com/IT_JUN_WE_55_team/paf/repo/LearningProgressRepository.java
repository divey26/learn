package com.IT_JUN_WE_55_team.paf.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.IT_JUN_WE_55_team.paf.model.LearningProgressUpdate;

@Repository
public interface LearningProgressRepository extends MongoRepository<LearningProgressUpdate, String> {

}