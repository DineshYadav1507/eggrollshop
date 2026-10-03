# EggRoll Shop deployment

## Local Docker

```bash
docker compose up --build
```

Open `http://localhost`.

## GitHub Actions secrets

Configure these repository secrets before CI/CD deployment:

- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`

## VPS bootstrap

Create `/opt/eggrollshop`, copy `docker-compose.yml`, `nginx/default.conf`, and `database/init.sql` there, then run:

```bash
cd /opt/eggrollshop
docker compose pull
docker compose up -d
```

The deployment workflow then pulls the newest Docker images after every push to `main`.

## Database

MySQL data is stored in the named `mysql_data` Docker volume. Back it up before production use.

## HTTPS

Put TLS termination in front of the Nginx container (for example with a host-level Nginx/Certbot setup or a managed load balancer) before exposing the application publicly.
