build-store-api: 
	@echo "Building Store App..."
	docker build \
		-t store-api \
		-f Dockerfile .

start-store-api:
	docker run -p 4000:4000 --env-file .env store-api \