import os


def detect_project_type(files):
    if 'package.json' in files:
        return 'node'
    if any(file in files for file in ['requirements.txt', 'Pipfile', 'setup.py', 'pyproject.toml']):
        return 'python'
    if any(file in files for file in ['pom.xml', 'build.gradle']):
        return 'java'
    if 'Gemfile' in files:
        return 'ruby'
    if 'composer.json' in files:
        return 'php'
    if 'go.mod' in files:
        return 'go'
    if 'Cargo.toml' in files:
        return 'rust'
    if any(file in files for file in ['CMakeLists.txt', 'Makefile']):
        return 'cpp'
    if any(file.endswith('.csproj') for file in files):
        return 'csharp'
    if any(file in files for file in ['index.html', 'webpack.config.js', 'vite.config.js']):
        return 'frontend'
    return 'unknown'


def generate_dockerfile(project_type):
    templates = {
        'node': '''
# Node.js Dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
''',
        'python': '''
# Python Dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
''',
        'java': '''
# Java Dockerfile
FROM openjdk:11
WORKDIR /app
COPY . .
RUN javac Main.java
CMD ["java", "Main"]
''',
        'ruby': '''
# Ruby Dockerfile
FROM ruby:3.0
WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle install
COPY . .
CMD ["ruby", "app.rb"]
''',
        'php': '''
# PHP Dockerfile
FROM php:8.0-apache
WORKDIR /var/www/html
COPY . .
RUN docker-php-ext-install mysqli
CMD ["apache2-foreground"]
''',
        'go': '''
# Go Dockerfile
FROM golang:1.17
WORKDIR /app
COPY . .
RUN go build -o main .
CMD ["./main"]
''',
        'rust': '''
# Rust Dockerfile
FROM rust:1.65
WORKDIR /app
COPY . .
RUN cargo build --release
CMD ["./target/release/app"]
''',
        'cpp': '''
# C++ Dockerfile
FROM gcc:11
WORKDIR /app
COPY . .
RUN make
CMD ["./app"]
''',
        'csharp': '''
# C# Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o out
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app/out .
CMD ["dotnet", "App.dll"]
''',
        'frontend': '''
# Frontend Dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npx", "serve", "-s", "build"]
''',
    }
    return templates.get(project_type, '# Unsupported project type. Please define a custom Dockerfile.')


def from_path_to_file_list(directory):
    files = []
    for root, _, filenames in os.walk(directory):
        for filename in filenames:
            files.append(os.path.relpath(os.path.join(root, filename), directory))
    return files


def auto_generate_dockerfile(repo_path):
    print(f"Generating Dockerfile for {repo_path}")
    files = from_path_to_file_list(repo_path)
    print(files)
    project_type = detect_project_type(files)
    print(f"Detected project type: {project_type}")

    dockerfile_content = generate_dockerfile(project_type)
    dockerfile_path = os.path.join(repo_path, 'Dockerfile')

    with open(dockerfile_path, 'w') as dockerfile:
        dockerfile.write(dockerfile_content)
    print(f"Dockerfile generated for {project_type} project at {dockerfile_path}")


# Example Usage
repo_path = './ServerHealthChecker'  # Replace with the actual path to the repository
auto_generate_dockerfile(repo_path)