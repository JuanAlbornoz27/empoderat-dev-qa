// package com.empoderat.config.datasource;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.context.annotation.Profile;
// import org.springframework.data.mongodb.MongoDatabaseFactory;
// import org.springframework.data.mongodb.core.MongoTemplate;
// import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
// import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

// @Configuration
// @EnableMongoRepositories(basePackages = "com.empoderat.repository.mongodb", mongoTemplateRef = "mongoTemplate")
// @Profile("!dev")
// public class MongoDBConfig {

//     // Inyectamos aquí el valor real de application.properties
//     @org.springframework.beans.factory.annotation.Value("${spring.data.mongodb.uri}")
//     private String mongoUri;

//     @Bean
//     public MongoDatabaseFactory mongoDatabaseFactory() {
//         // Ahora "mongoUri" es, por ejemplo, "mongodb://localhost:27017/empoderat"
//         return new SimpleMongoClientDatabaseFactory(mongoUri);
//     }

//     @Bean
//     public MongoTemplate mongoTemplate() {
//         return new MongoTemplate(mongoDatabaseFactory());
//     }
// }
package com.empoderat.config.datasource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import com.mongodb.ConnectionString;

// IMPORTANTE: no tiene @EnableMongoRepositories aquí
@Configuration
@Profile("!dev")
public class MongoDBConfig {

    @Bean
    public MongoDatabaseFactory mongoDatabaseFactory() {
        // URI de Atlas (solo en perfiles != dev)
        String uri = "mongodb+srv://root:root@empoderat.cwi1qm7.mongodb.net/empoderat"
                + "?retryWrites=true&w=majority&appName=EmpoderaT";
        return new SimpleMongoClientDatabaseFactory(new ConnectionString(uri));
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoDatabaseFactory());
    }
}
