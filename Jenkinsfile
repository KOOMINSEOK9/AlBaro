pipeline {
    agent any

    environment {
        // 환경 변수 설정
        EC2_IP = 'i12b105.p.ssafy.io'  // EC2 인스턴스의 IP 주소
        SSH_KEY = 'C:/Users/SSAFY/Desktop/I12B105T.pem'  // SSH 키 경로
        PROJECT_PATH = '/home/ubuntu/S12P11B105'  // EC2 환경의 Docker Compose 파일이 위치한 경로
        GIT_REPO_URL = 'https://lab.ssafy.com/s12-webmobile1-sub1/S12P11B105.git'  // GitLab 저장소 URL
        GIT_BRANCH = 'develop'  // 사용할 브랜치
    }

    stages {
        stage('Checkout') {
            steps {
                // GitLab에서 코드 체크아웃
                git url: "${GIT_REPO_URL}", branch: "${GIT_BRANCH}", credentialsId: 'gitlab-test'
            }
        }

        // Docker Compose 버전 확인 후 빌드 하는거 확인용
        stage('Check Docker Compose Version') {
            steps {
                script {
                    sh 'docker-compose --version'
                }
            }
        }


        stage('Build') {
            steps {
                script {
                    // Docker 이미지 빌드
                    sh 'docker-compose build'
                }
            }
        }
        // stage('Test') {
        //     steps {
        //         script {
        //             // 테스트 실행 (예: 백엔드 테스트)
        //             sh 'docker-compose run backend ./gradlew test'
        //         }
        //     }
        // }
        stage('Deploy to EC2') {
            steps {
                script {
                    // EC2에 SSH로 접속하여 Docker Compose로 서비스 시작
                    sh """
                    ssh -i ${SSH_KEY} ec2-user@${EC2_IP} 'cd ${PROJECT_PATH} && docker-compose up -d'
                    """
                }
            }
        }
        
    }

    post {
        always {
            // 항상 실행되는 단계 (예: 로그 수집)
            sh 'docker-compose logs'
        }
    }
}