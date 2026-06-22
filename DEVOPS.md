# StreamLink DevOps guide

## Local Docker Compose

The local stack contains four services:

- `frontend`: Angular production build served by Nginx on port `4200`
- `backend`: Spring Boot API on port `8080`
- `database`: PostgreSQL 16 on port `5432`
- `livekit`: local LiveKit development server on ports `7880`-`7882`

Docker Desktop may require LiveKit to advertise the computer's active LAN IPv4
address. Copy `.env.example` to `.env` and set `LIVEKIT_NODE_IP`. The `.env`
file is ignored by Git.

```powershell
Copy-Item .env.example .env
docker compose up -d --build
docker compose ps
```

Open <http://localhost:4200>. Do not run `npm start` at the same time because
both the development server and the frontend container use port `4200`.

Useful diagnostics:

```powershell
docker compose logs -f frontend backend database livekit
docker compose down
```

Use `docker compose down -v` only when intentionally deleting all local database
data.

For frontend-only development, keep the backend stack running and use the Angular
development server. `proxy.conf.json` forwards `/api` to port `8080`.

```powershell
docker compose up -d database livekit backend
cd frontend
npm.cmd start
```

## GitHub Actions and GHCR

`.github/workflows/ci-cd.yml` runs on pushes and pull requests to `main` or
`master`. It:

1. runs the backend tests;
2. builds the Angular frontend;
3. builds both Docker images;
4. publishes the images on non-PR runs to:
   - `ghcr.io/beathersppark/chatrix-backend`
   - `ghcr.io/beathersppark/chatrix-frontend`.

The workflow uses the built-in `GITHUB_TOKEN`; no Docker Hub password is needed.
After the first successful run, open each package in GitHub and set its visibility
to public if the Kubernetes cluster must pull it without an image pull secret.

The optional CD job is disabled by default. To enable it:

1. create a repository variable `ENABLE_CD` with value `true`;
2. create a repository secret `KUBE_CONFIG` containing a base64-encoded kubeconfig;
3. ensure the target cluster has an Nginx Ingress Controller.

## Kubernetes

All manifests are in `k8s/` and deploy into the `streamlink` namespace.

Before deploying, configure:

- `k8s/configmap.yaml`: public hostname, CORS origin, and a browser-reachable
  `wss://` LiveKit URL;
- `k8s/secret.yaml`: PostgreSQL password, JWT secret, and LiveKit API credentials.

The committed Secret contains placeholders only. Do not commit real secrets.
For a real environment, manage them with a secret manager, Sealed Secrets, or
apply a locally generated Secret directly to the cluster.

Apply everything:

```powershell
kubectl apply -k k8s
kubectl get all -n streamlink
kubectl get ingress -n streamlink
kubectl get pvc -n streamlink
```

Watch the rollout:

```powershell
kubectl rollout status deployment/backend -n streamlink
kubectl rollout status deployment/frontend -n streamlink
kubectl logs statefulset/postgres -n streamlink
```

For a local cluster, map the Ingress address to `streamlink.local` in the hosts
file, or use the hostname mechanism provided by the cluster distribution. Camera
and microphone access outside `localhost` requires HTTPS, so configure TLS on the
Ingress for a complete video-call deployment.

To remove the namespace and its workloads:

```powershell
kubectl delete namespace streamlink
```

Deleting the namespace also deletes the PostgreSQL PVC in most local clusters.
