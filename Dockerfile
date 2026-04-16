# GridSense — Cloud Run Deployment
# nginx:alpine serving static files on port 8080 (required by Cloud Run)

FROM nginx:alpine

# Remove default nginx config and static files
RUN rm /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy all static website files
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY gridsense_logo.svg /usr/share/nginx/html/

# Cloud Run requires the container to listen on 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
