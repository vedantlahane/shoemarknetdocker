pipeline {
    agent any

    options {
        skipDefaultCheckout(true) // Prevents Jenkins from doing an automatic SCM checkout
    }

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
        stage('Debug Env') {
    steps {
        sh 'printenv | grep JWT_SECRET || echo "JWT_SECRET not set"'
    }
}

        stage('Checkout') {
            steps {
                git url: 'https://github.com/vedantlahane/shoemarknetdocker.git',
                    credentialsId: 'PAT',
                    branch: 'main'
            }
        }

        stage('Install Dependencies & Test Backend') {
            steps {
                dir('backend') {
                    sh 'npm install --verbose'
                    sh 'npm ls --depth=0'
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
                    sh 'cat .env | grep -v SECRET'
                }
            }
        }

        stage('Build & Deploy with Docker Compose') {
            steps {
                // If docker-compose.yml is in 'backend', wrap in dir('backend') { ... }
                sh 'docker-compose down || true'
                sh 'docker-compose build --no-cache'
                sh 'docker-compose up -d'
                sh 'docker-compose logs -f & sleep 30'
                sh 'docker ps -a'
            }
        }
    }

    post {
        always {
            script {
                if (getContext(hudson.FilePath)) {
                    // If docker-compose.yml is in 'backend', wrap in dir('backend') { ... }
                    sh 'docker-compose logs backend || true'
                    sh 'docker-compose logs frontend || true'
                    sh 'docker system prune -f || true'
                } else {
                    echo "No workspace available in post block."
                }
            }
        }
    }
}
