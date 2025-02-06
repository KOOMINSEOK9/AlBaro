pipeline {
    agent any
    environment {
        EC2_HOST = "http://i12b105.p.ssafy.io/"  // **[필수 변경]** EC2 탄력적 IP 주소 (예: "3.123.45.67")
        GIT_REPOSITORY_URL = "lab.ssafy.com/s12-webmobile1-sub1/S12P11B105" // **[필수 변경]** Git 저장소 URL
    }
    stages {
        stage('Checkout') {
            steps {
                script {
                    // Git 사용자 이름과 토큰을 안전하게 전달하기 위해 withCredentials 사용
                    withCredentials([usernamePassword(credentialsId: 'gitlab-test', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_TOKEN')]) {
                        echo "현재 브랜치: ${env.BRANCH_NAME}"
                        
                        // Git 저장소 URL을 username과 token을 포함하여 안전하게 형성
                        def repoUrl = "https://${GIT_USERNAME}:${GIT_TOKEN}@${GIT_REPOSITORY_URL}.git"
                        
                        // Git 저장소에서 소스 코드 Checkout
                        git url: repoUrl, branch: "develop"
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // 배포 명령어를 여기에 추가하세요
                    echo "배포 중..."
                    // 예시: sh 'deploy_script.sh'
                }
            }
            post {
                success {
                    echo "✅ 배포 성공!"
                }
                failure {
                    echo "❌ 배포 실패!"
                }
            }
        }
        
        stage('Stage 1') {
            steps {
                echo "Stage 1 is running"
            }
        }
        
        stage('Stage 2') {
            steps {
                echo "Stage 2 is running"
            }
        }
        
        stage('Stage 3') {
            steps {
                echo "Stage 3 is running"
            }
        }
    }
}
