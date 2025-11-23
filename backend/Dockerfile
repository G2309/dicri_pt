FROM node:18-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci --only=production

COPY . .

COPY entrypoint /usr/local/bin/entrypoint

RUN chmod +x /usr/local/bin/entrypoint

EXPOSE 4000

ENTRYPOINT ["/usr/local/bin/entrypoint"]
