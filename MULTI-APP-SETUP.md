# Multi-App VPS Setup Guide

## Struktura aplikacji na VPS

```
/var/www/
├── taskflow/                    # Istniejąca aplikacja
│   ├── docker-compose.yml
│   └── ...
├── crypto-market/               # Nowa aplikacja
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── ...
└── nginx/
    ├── sites-available/
    │   ├── taskflow.julianowicka.dev
    │   └── cryptomarket.julianowicka.dev
    └── sites-enabled/
```

## Porty aplikacji

| Aplikacja | Port na hoście | Port w kontenerze | Domena |
|-----------|----------------|-------------------|---------|
| taskflow | 3000 | 3000 | taskflow.julianowicka.dev |
| crypto-market | 3001 | 3000 | cryptomarket.julianowicka.dev |

## Zarządzanie aplikacjami

### Sprawdzenie statusu wszystkich aplikacji
```bash
# Sprawdź wszystkie kontenery Docker
docker ps

# Sprawdź konkretną aplikację
cd /var/www/crypto-market
docker compose ps

cd /var/www/taskflow
docker compose ps
```

### Restart aplikacji
```bash
# Restart crypto-market
cd /var/www/crypto-market
docker compose restart

# Restart taskflow
cd /var/www/taskflow
docker compose restart
```

### Logi aplikacji
```bash
# Logi crypto-market
cd /var/www/crypto-market
docker compose logs -f

# Logi taskflow
cd /var/www/taskflow
docker compose logs -f
```

### Aktualizacja aplikacji
```bash
# Aktualizacja crypto-market
cd /var/www/crypto-market
git pull
docker compose up -d --build

# Aktualizacja taskflow
cd /var/www/taskflow
git pull
docker compose up -d --build
```

## Monitoring zasobów

```bash
# Sprawdź użycie zasobów przez kontenery
docker stats

# Sprawdź użycie dysku
docker system df

# Wyczyść nieużywane obrazy
docker system prune
```

## Backup i przywracanie

```bash
# Backup konfiguracji nginx
sudo tar -czf nginx-backup.tar.gz /etc/nginx/

# Backup aplikacji
cd /var/www
tar -czf apps-backup.tar.gz taskflow/ crypto-market/
```

## Troubleshooting

### Problem z portami
```bash
# Sprawdź które porty są zajęte
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :3001
```

### Problem z nginx
```bash
# Sprawdź konfigurację nginx
sudo nginx -t

# Przeładuj nginx
sudo systemctl reload nginx

# Sprawdź logi nginx
sudo tail -f /var/log/nginx/error.log
```

### Problem z Docker
```bash
# Sprawdź logi Docker
sudo journalctl -u docker.service

# Restart Docker
sudo systemctl restart docker
```
