// ecosystem.config.js (Producción – Ubuntu)
module.exports = {
  apps: [
    // Backend Spring Boot (Producción)
    {
      name: 'api-prod',
      cwd: './backend/empoderat',
      script: './mvnw',
      args: 'spring-boot:run',
      interpreter: 'bash',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '1G',
      restart_delay: 5000,
      max_restarts: 5,
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: 'production',
        SPRING_PROFILES_ACTIVE: 'prod',
        SERVER_PORT: '8080',
        JAVA_HOME: '/usr/lib/jvm/java-17-openjdk-amd64',
        PATH: '/usr/lib/jvm/java-17-openjdk-amd64/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
        
        // === MySQL ===
        SPRING_DATASOURCE_MYSQL_JDBC_URL: 'jdbc:mysql://104.248.58.255:3306/empoderat?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true',
        SPRING_DATASOURCE_MYSQL_USERNAME: 'migrador',
        SPRING_DATASOURCE_MYSQL_PASSWORD: 'migrador',
        SPRING_DATASOURCE_MYSQL_DRIVER_CLASS_NAME: 'com.mysql.cj.jdbc.Driver',
        
        // === MongoDB ===
        SPRING_DATA_MONGODB_URI: 'mongodb+srv://root:root@empoderat.cwi1qm7.mongodb.net/empoderat?retryWrites=true&w=majority&appName=EmpoderaT',
        
        // === Neo4j ===
        SPRING_NEO4J_URI: 'bolt://104.248.58.255:7687',
        SPRING_NEO4J_AUTHENTICATION_USERNAME: 'neo4j',
        SPRING_NEO4J_AUTHENTICATION_PASSWORD: 'password',
        
        // === JWT Configuration ===
        JWT_SECRET: 'TuClaveSecretaProductionMuyLargaYSegura2024!@#$%^&*()_+=EmpoderaT_JWT_SECRET_KEY',
        JWT_EXPIRATION: '86400000',
        
        // === Keycloak ===
        KEYCLOAK_URL: 'http://104.248.58.255:8180',
        KEYCLOAK_CLIENT_SECRET: 'lA4VaiKZKaBtAz9T8YJcBIbRDU80p8oG',
        
        // === CORS ===
        CORS_ALLOWED_ORIGINS: 'http://104.248.58.255:5173,http://localhost:5173',
        
        // === URLs ===
        APP_BASE_URL: 'http://104.248.58.255:8080',
        APP_UPLOAD_DIR: '/app/uploads'
      },
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      time: true
    },
    
    // Frontend (Producción)
    {
      name: 'frontend-prod',
      cwd: './frontend',
      script: 'npm',
      args: 'run preview -- --port 5173 --host 0.0.0.0',
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '512M',
      restart_delay: 3000,
      max_restarts: 5,
      autorestart: true,
      env_production: {
        NODE_ENV: 'production',
        VITE_API_URL: 'http://104.248.58.255:8080/api'
      },
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      time: true
    }
  ]
};
