# 전부 root로 해버리기..일단..

# jenkins/Dockerfile
FROM jenkins/jenkins:lts

USER root

# Docker 설치
RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates curl software-properties-common && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
    echo "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list && \
    apt-get update && \
    apt-get install -y docker-ce docker-ce-cli containerd.io

# Docker Compose 설치
RUN curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# Docker 그룹에 jenkins 사용자 추가 (필요 시)
RUN if ! getent group docker; then groupadd docker; fi && \
    usermod -aG docker jenkins

# USER jenkins  # 이 줄은 주석 처리하거나 삭제