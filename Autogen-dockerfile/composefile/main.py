import os

def generate_docker_compose_from_paths(dockerfile_paths, output_path="docker-compose.yml", databases=None):
    """
    Generates a docker-compose.yml file for multiple Dockerfiles and optional database services.

    :param dockerfile_paths: A list of Dockerfile paths.
    :param output_path: Path to save the docker-compose.yml file.
    :param databases: Optional list of database configurations (each a dict with keys: image, ports, user, password).
    """
    services = []
    used_ports = set()

    for index, dockerfile_path in enumerate(dockerfile_paths):
        service_name = os.path.basename(dockerfile_path).replace("Dockerfile.", "").replace("Dockerfile", f"service{index+1}")

        # Dynamically assign ports ensuring no conflicts
        host_port = 8000 + index
        container_port = 80 + index
        while host_port in used_ports:
            host_port += 1
        used_ports.add(host_port)

        ports = f"      - \"{host_port}:{container_port}\""
        service_entry = f"""
  {service_name}:
    build:
      context: .
      dockerfile: {dockerfile_path}
    ports:
{ports}
    networks:
      - shared_network
"""
        services.append(service_entry)

    # Add database services if provided
    if databases:
        for db_index, database in enumerate(databases):
            db_service_name = database.get("name", f"database{db_index+1}")
            db_image = database.get("image", "postgres:latest")
            db_host_port = database.get("ports", {}).get("host", 5432 + db_index)
            db_container_port = database.get("ports", {}).get("container", 5432)
            db_user = database.get("user", "root")
            db_password = database.get("password", "password")

            while db_host_port in used_ports:
                db_host_port += 1
            used_ports.add(db_host_port)

            database_service = f"""
  {db_service_name}:
    image: {db_image}
    ports:
      - \"{db_host_port}:{db_container_port}\"
    environment:
      - POSTGRES_USER={db_user}
      - POSTGRES_PASSWORD={db_password}
    networks:
      - shared_network
"""
            services.append(database_service)

    compose_content = f"""
version: '3.8'
services:
{''.join(services)}

networks:
  shared_network:
    driver: bridge
"""

    with open(output_path, 'w') as compose_file:
        compose_file.write(compose_content)
    print(f"docker-compose.yml file generated at {output_path}")

# Example Usage
generate_docker_compose_from_paths(
    [
        "Dockerfile.webapp",
        "Dockerfile.api",
    ],
    databases=[
        {"name": "postgres_db", "image": "postgres:13", "ports": {"host": 5433, "container": 5432}, "user": "admin", "password": "secret"}
    ]
)
