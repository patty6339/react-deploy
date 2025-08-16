# AWS CI/CD Pipeline with CodePipeline, CodeBuild, and CodeDeploy

This repository serves as both a demonstration and the companion code for my detailed tutorial blog post on setting up a fully automated CI/CD pipeline using AWS services. You can follow along with the blog post for step-by-step instructions or use this repository as a reference implementation.

## Architecture

![cloud architecture](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3zehpnu7t8spv7gs7iny.png)

## Technologies Used

- **GitHub:** Source code repository
- **AWS CodePipeline:** Pipeline orchestration
- **AWS CodeBuild:** Code building and testing
- **AWS CodeDeploy:** Automated deployment
- **Amazon EC2:** Application hosting
- **Amazon S3:** Build artifact storage
- **AWS IAM:** Service permissions management

## Prerequisites

- AWS Account with administrative access
- GitHub account
- Basic understanding of AWS services
- Familiarity with React/Vite applications

## Benefits

- **Automated Deployments:** Eliminate manual SSH deployments and human error
- **Consistent Process:** Ensure every deployment follows the same tested steps
- **Quick Rollbacks:** Easily revert to previous versions if issues arise
- **Enhanced Security:** Remove the need for direct SSH access to production servers
- **Faster Development:** Reduce the time between code commits and production deployment

## Repository Structure

```
├── app/        # Sample React application
├── buildspec.yml        # CodeBuild instructions
├── appspec.yml         # CodeDeploy configuration
└── scripts/           # Deployment scripts
```

## Setup Instructions

### 1. IAM Role Configuration

#### EC2 Role
1. Create a new role with EC2 as trusted entity
2. Attach `AmazonEC2RoleforAWSCodeDeploy` policy
3. Name the role (e.g., `EC2CodeDeployRole`)

#### CodeDeploy Role
1. Create a new role with CodeDeploy as trusted entity
2. Attach `AWSCodeDeployRole` policy
3. Update trust relationship with provided policy

### 2. Launch Template and ASG setup

1. Use Ubuntu EC2 instance for LT
2. Configure security group (SSH: Port 22, HTTP: Port 80)
3. Attach EC2CodeDeployRole
4. Add CodeDeploy agent installation script to user data
5. Create autoscaling group from the launch template


### 3. CodeBuild Configuration

1. Create CodeBuild Project
2. Add source - Github
3. Add Artifact - S3 ( create s3 bucket)


### 4. CodeDeploy Configuration

1. Create CodeDeploy application
2. Set up deployment group
3. Configure deployment settings
4. Link to EC2 instances

### 4. CodePipeline Setup

1. Create new pipeline
2. Configure GitHub source connection
3. Select CodeBuild project
4. Link CodeDeploy deployment

## Configuration Files

### UserData
```bash
# Update system
sudo apt update -y

# Install CodeDeploy Agent
sudo apt install ruby-full -y
cd /home/ubuntu
wget https://aws-codedeploy-us-east-2.s3.us-east-2.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto

sudo systemctl enable codedeploy-agent
sudo systemctl start codedeploy-agent
```


### buildspec.yml
```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 20
    commands:
        - cd ./app
        - npm install
       
  build:
    commands:
        - npm run build
     
artifacts:
  files:
    - 'app/dist/**/*'
    - 'appspec.yml'
    - 'scripts/**/*'
  discard-paths: no
  type: zip
  name: 'app.zip'
```

### appspec.yml
```yaml
version: 0.0
os: linux
files:
  - source: /app/dist
    destination: /var/www/html/
hooks:
  BeforeInstall:
    - location: scripts/before_install.sh
      timeout: 300
      runas: root
  AfterInstall:
    - location: scripts/after_install.sh
      timeout: 300
      runas: root
  ApplicationStart:
    - location: scripts/start_application.sh
      timeout: 300
      runas: root
```

# react-deploy
