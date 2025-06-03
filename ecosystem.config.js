module.exports = {
  apps: [
    // Docker compose (Este parece estar funcionando bien)
    {
      name: 'empoderat-containers',
      script: 'docker-compose', // PM2 debería encontrar docker-compose si está en el PATH
      args: 'up',
      cwd: './backend/empoderat', // Asegúrate que docker-compose.yml está aquí
      interpreter: 'none',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      // Las rutas de log son relativas al CWD de este proceso si PM2 no puede crearlas donde se especifica,
      // o relativas a donde ejecutas 'pm2 start'.
      // Es buena idea crear la carpeta './logs' en la raíz de tu proyecto manualmente primero.
      error_file: './logs/docker-error.log',
      out_file: './logs/docker-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      kill_timeout: 5000
      // Eliminamos 'wait_ready' y 'listen_timeout' para docker-compose
    },

    // Backend Spring Boot - Usando cmd.exe para mayor fiabilidad en Windows
    {
      name: 'empoderat-api',
      script: 'cmd.exe',
      args: ['/c', '.\\mvnw.cmd spring-boot:run'], // Comando completo como un solo argumento para /c después de cmd.exe
      // Asegúrate que mvnw.cmd está en cwd
      cwd: './backend/empoderat',
      interpreter: 'none', // 'none' porque el script es cmd.exe
      env: {
        NODE_ENV: 'development',
        SPRING_PROFILES_ACTIVE: 'dev',
        // Si Spring Boot necesita un puerto diferente a 8080 (usado por Keycloak):
        // SERVER_PORT: 8081 // O configúralo en application.properties
      },
      env_production: {
        NODE_ENV: 'production',
        SPRING_PROFILES_ACTIVE: 'prod',
        SERVER_PORT: 8081, // Asegúrate que este puerto no entre en conflicto
        MYSQL_URL: 'jdbc:mysql://localhost:3306/empoderat',
        MYSQL_USER: 'root',
        MYSQL_PASSWORD: 'root',
        MONGODB_URI: 'mongodb+srv://root:root@empoderat.cwi1qm7.mongodb.net/empoderat',
        NEO4J_URI: 'bolt://localhost:7687',
        NEO4J_USER: 'neo4j',
        NEO4J_PASSWORD: 'password',
        KEYCLOAK_URL: 'http://localhost:8180' // Asumiendo que Keycloak para el backend es el que corre en Docker en 8080, pero el proxy podría ser 8180. Ajusta si es necesario.
        // Si Keycloak está en Docker en 8080, y este API se comunica con él, debería ser http://localhost:8080
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      merge_logs: true,
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      start_delay: 20000 // Aumentado ligeramente para dar más tiempo a Docker si es necesario
    },

    // Frontend (Vite) - Usando cmd.exe para mayor fiabilidad
    {
      name: 'empoderat-frontend',
      cwd: './frontend',
      script: 'cmd.exe',
      args: ['/c', 'npm run dev'], // npm debería resolverse a npm.cmd a través del PATH del sistema
      interpreter: 'none', // 'none' porque el script es cmd.exe
      env: {
        NODE_ENV: 'development',
        // Si tu API Spring Boot corre en 8081:
        // VITE_API_URL: 'http://localhost:8081/api'
        // Si tu API es Keycloak directamente (lo cual es menos probable para una VITE_API_URL general):
        VITE_API_URL: 'http://localhost:8080/api' // Mantén esto si el frontend habla directamente con un gateway/Keycloak en 8080. Ajusta según tu arquitectura.
      },
      env_production: {
        NODE_ENV: 'production',
        VITE_API_URL: 'http://104.248.58.255:8080/api' // O el puerto correspondiente si cambia
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};