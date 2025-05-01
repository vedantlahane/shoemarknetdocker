pipeline {
    agent any

    environment {
        MONGODB_URI = credentials('MONGODB_URI')
        JWT_SECRET = credentials('JWT_SECRET')
        JWT_EXPIRATION = '1d'
        REFRESH_TOKEN_EXPIRATION = '7d'
        BACKEND_LOCAL_PORT = '5000'
        BACKEND_LOCAL_PORT_END = '5002'
        FRONTEND_LOCAL_PORT = '5173'
        NODE_ENV = 'development'
        LOG_LEVEL = 'info'
        CORS_ORIGIN = 'http://localhost:5173'
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/vedantlahane/shoemarknetdocker.git',
                    credentialsId: 'PAT',
                    branch: 'main'  // Explicit branch declaration
            }
        }

        stage('Install Dependencies & Test Backend') {
            steps {
                dir('backend') {
                    sh 'npm install --verbose'  // Added verbose flag
                    sh 'npm ls --depth=0'       // Verify installed dependencies
                    // sh 'npm test'
                }
            }
        }

        stage('Install Dependencies & Test Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install --verbose'
                    sh 'npm ls --depth=0'
                    // sh 'npm run test'
                }
            }
        }

        stage('Create .env File') {
            steps {
                dir('backend') {
                    writeFile file: '.env', text: """
MONGODB_URI=${env.MONGODB_URI}
JWT_SECRET=${env.JWT_SECRET}
JWT_EXPIRATION=${env.JWT_EXPIRATION}
REFRESH_TOKEN_EXPIRATION=${env.REFRESH_TOKEN_EXPIRATION}
BACKEND_LOCAL_PORT=${env.BACKEND_LOCAL_PORT}
BACKEND_LOCAL_PORT_END=${env.BACKEND_LOCAL_PORT_END}
FRONTEND_LOCAL_PORT=${env.FRONTEND_LOCAL_PORT}
NODE_ENV=${env.NODE_ENV}
LOG_LEVEL=${env.LOG_LEVEL}
CORS_ORIGIN=${env.CORS_ORIGIN}
"""
                    sh 'cat .env | grep -v SECRET'  // Verify .env (exclude secrets)
                }
            }
        }

        stage('Build & Deploy with Docker Compose') {
            steps {
                sh 'docker-compose down || true'
                sh 'docker-compose build --no-cache'  // Force clean rebuild
                sh 'docker-compose up -d'
                sh 'docker-compose logs -f & sleep 30'  // Stream logs for 30s
                sh 'docker ps -a'  // Verify container status
            }
        }
    }

    post {
        always {
            sh 'docker-compose logs backend'  // Capture backend logs
            sh 'docker-compose logs frontend' // Capture frontend logs
            sh 'docker system prune -f'
        }
    }
}
