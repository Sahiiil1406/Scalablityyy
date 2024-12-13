import os

def write_env_file(repo_path, env_content):
    """
    Writes the given .env content to a file in the repository.

    :param repo_path: Path to the repository
    :param env_content: String containing .env content
    """
    env_path = os.path.join(repo_path, '.env')
    with open(env_path, 'w') as env_file:
        env_file.write(env_content)
    print(f".env file created at {env_path}")



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

def generate_dockerfile(project_type, include_env=False):
    env_copy = "COPY .env ./\n" if include_env else ""
    templates = {
        'node': f'''
# Node.js Dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
{env_copy}RUN npm install
COPY . .
CMD ["npm", "start"]
''',
        'python': f'''
# Python Dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt ./
{env_copy}RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
''',
        'java': f'''
# Java Dockerfile
FROM openjdk:11
WORKDIR /app
{env_copy}COPY . .
RUN javac Main.java
CMD ["java", "Main"]
''',
        'ruby': f'''
# Ruby Dockerfile
FROM ruby:3.0
WORKDIR /app
COPY Gemfile Gemfile.lock ./
{env_copy}RUN bundle install
COPY . .
CMD ["ruby", "app.rb"]
''',
        'php': f'''
# PHP Dockerfile
FROM php:8.0-apache
WORKDIR /var/www/html
{env_copy}COPY . .
RUN docker-php-ext-install mysqli
CMD ["apache2-foreground"]
''',
        'go': f'''
# Go Dockerfile
FROM golang:1.17
WORKDIR /app
{env_copy}COPY . .
RUN go build -o main .
CMD ["./main"]
''',
        'rust': f'''
# Rust Dockerfile
FROM rust:1.65
WORKDIR /app
{env_copy}COPY . .
RUN cargo build --release
CMD ["./target/release/app"]
''',
        'cpp': f'''
# C++ Dockerfile
FROM gcc:11
WORKDIR /app
{env_copy}COPY . .
RUN make
CMD ["./app"]
''',
        'csharp': f'''
# C# Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app
{env_copy}COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o out
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app/out .
CMD ["dotnet", "App.dll"]
''',
        'frontend': f'''
# Frontend Dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
{env_copy}RUN npm install
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

def auto_generate_dockerfile(repo_path, include_env=False):
    print(f"Generating Dockerfile for {repo_path}")
    files = from_path_to_file_list(repo_path)
    print(files)
    project_type = detect_project_type(files)
    print(f"Detected project type: {project_type}")

    dockerfile_content = generate_dockerfile(project_type, include_env)
    dockerfile_path = os.path.join(repo_path, 'Dockerfile')

    with open(dockerfile_path, 'w') as dockerfile:
        dockerfile.write(dockerfile_content)
    print(f"Dockerfile generated for {project_type} project at {dockerfile_path}")

# Example Usage
repo_path = './ServerHealthChecker'  # Replace with the actual path to the repository
include_env = True  # Set to True if you want to include .env file
write_env_file(repo_path, 'PORT=3000\nDB_HOST=localhost\nDB_USER=root\nDB_PASS=password\nDB_NAME=mydb\n')
auto_generate_dockerfile(repo_path, include_env)
