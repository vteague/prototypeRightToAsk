FROM nginx:latest
COPY nginx-proxy.conf /etc/nginx/nginx.conf
EXPOSE 80
COPY delayStart.sh .
ENTRYPOINT ["/bin/bash","./delayStart.sh"]