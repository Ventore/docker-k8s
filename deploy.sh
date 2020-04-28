docker build -t basov/docker-complex-frontend:latest -t basov/docker-complex-frontend:$SHA ./frontend
docker build -t basov/docker-complex-api:latest -t basov/docker-complex-api:$SHA ./api
docker build -t basov/docker-complex-worker:latest -t basov/docker-complex-worker:$SHA ./worker 

docker push basov/docker-complex-frontend:latest
docker push basov/docker-complex-api:latest
docker push basov/docker-complex-worker:latest

docker push basov/docker-complex-frontend:$SHA
docker push basov/docker-complex-api:$SHA
docker push basov/docker-complex-worker:$SHA

kubectl apply -f k8s
kubectl set image deployments/frontend-deplyment frontend=basov/docker-complex-frontend:$SHA
kubectl set image deployments/api-deplyment api=basov/docker-complex-api:$SHA
kubectl set image deployments/worker-deplyment worker=basov/docker-complex-worker:$SHA