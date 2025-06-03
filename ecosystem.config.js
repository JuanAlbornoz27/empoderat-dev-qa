module.exports = {
  apps: [
    // Backend Spring Boot
    {
      name: 'empoderat-api',
      script: './empoderat/target/empoderat-api-0.0.1-SNAPSHOT.jar',
      env: {
        NODE_ENV: 'development',
        SPRING_PROFILES_ACTIVE: 'dev'
      },
      env_production: {
        NODE_ENV: 'production',
        SPRING_PROFILES_ACTIVE: 'prod',
        SERVER_PORT: 8080,
        MYSQL_URL: 'jdbc:mysql://localhost:3306/empoderat',
        MYSQL_USER: 'root',
        MYSQL_PASSWORD: 'root',
        MONGODB_URI: 'mongodb+srv://root:root@empoderat.cwi1qm7.mongodb.net/empoderat',
        NEO4J_URI: 'bolt://localhost:7687',
        NEO4J_USER: 'neo4j',
        NEO4J_PASSWORD: 'password',
        KEYCLOAK_URL: 'http://localhost:8180'
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      merge_logs: true,
      error_file: 'logs/backend-error.log',
      out_file: 'logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    
    // Frontend React
    {
      name: 'empoderat-frontend',
      cwd: '../frontend',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        VITE_API_URL: 'http://localhost:8080/api'
      },
      env_production: {
        NODE_ENV: 'production',
        VITE_API_URL: 'http://104.248.58.255:8080/api'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      error_file: 'logs/frontend-error.log',
      out_file: 'logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },

    // Docker Compose (Keycloak y otros contenedores)
    {
      name: 'empoderat-containers',
      cwd: './',
      script: 'docker-compose',
      args: 'up',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      autorestart: true,
      watch: false,
      error_file: 'logs/docker-error.log',
      out_file: 'logs/docker-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};