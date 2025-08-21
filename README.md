# AWS CI/CD Pipeline with CodePipeline, CodeBuild, and CodeDeploy  

This repository serves as both a demonstration and the companion code for my detailed tutorial blog post on setting up a fully automated CI/CD pipeline using AWS services.  

You can follow along with the blog post for step-by-step instructions or use this repository as a reference implementation.  

---

## Architecture  

![cloud architecture](AWS CodePipeline (1).jpg)  

---

## Technologies Used  

- **GitHub:** Source code repository  
- **AWS CodePipeline:** Pipeline orchestration  
- **AWS CodeBuild:** Code building and testing  
- **AWS CodeDeploy:** Automated deployment  
- **Amazon EC2:** Application hosting  
- **Amazon S3:** Build artifact storage  
- **AWS IAM:** Service permissions management  

---

## Prerequisites  

- AWS Account with administrative access  
- GitHub account  
- Basic understanding of AWS services  
- Familiarity with React/Vite applications  

---

## Benefits  

- **Automated Deployments:** Eliminate manual SSH deployments and human error  
- **Consistent Process:** Ensure every deployment follows the same tested steps  
- **Quick Rollbacks:** Easily revert to previous versions if issues arise  
- **Enhanced Security:** Remove the need for direct SSH access to production servers  
- **Faster Development:** Reduce the time between code commits and production deployment  

---

## Repository Structure  

```plaintext
├── app/              # Sample React application
├── buildspec.yml     # CodeBuild instructions
├── appspec.yml       # CodeDeploy configuration
└── scripts/          # Deployment scripts
Setup Instructions
1. IAM Role Configuration
EC2 Role
Create a new role with EC2 as trusted entity

Attach AmazonEC2RoleforAWSCodeDeploy policy

Name the role (e.g., EC2CodeDeployRole)

CodeDeploy Role
Create a new role with CodeDeploy as trusted entity

Attach AWSCodeDeployRole policy

Update trust relationship with provided policy

2. Launch Template and ASG Setup
Use Ubuntu EC2 instance for LT

Configure security group (SSH: Port 22, HTTP: Port 80)

Attach EC2CodeDeployRole

Add CodeDeploy agent installation script to user data

Create autoscaling group from the launch template

3. CodeBuild Configuration
Create CodeBuild Project

Add source – GitHub

Add Artifact – S3 (create S3 bucket)

4. CodeDeploy Configuration
Create CodeDeploy application

Set up deployment group

Configure deployment settings

Link to EC2 instances

5. CodePipeline Setup
Create new pipeline

Configure GitHub source connection

Select CodeBuild project

Link CodeDeploy deployment

Configuration Files
UserData
bash
Copy
Edit
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
buildspec.yml
yaml
Copy
Edit
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
appspec.yml
yaml
Copy
Edit
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
