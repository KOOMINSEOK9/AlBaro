pipeline {
    agent any

    environment {
        GIT_REPO = "lab.ssafy.com/s12-webmobile1-sub1/S12P11B105.git"
        GIT_BRANCH = "develop"
    }

    stages {
        stage('Clone Repository') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'Gitlab', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    script {
                        // Git Clone with HTTPS & Credentials
                        try {
                            sh '''
                            rm -rf project
                            git clone -b develop https://$GIT_USER:$GIT_PASS@lab.ssafy.com/s12-webmobile1-sub1/S12P11B105.git project
                            '''
                        } catch (Exception e) {
                            error "Failed to clone repository: ${e.message}"
                        }
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    dir('project') {  // docker-compose.yml이 위치한 디렉터리로 이동
                        try {
                            sh 'docker-compose down'
                            sh 'docker-compose up --build -d'
                        } catch (Exception e) {
                            error "Deployment failed: ${e.message}"
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Success!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}