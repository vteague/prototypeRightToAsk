FROM nginx:latest
RUN mkdir /etc/nginx/ssl/
COPY nginx-proxy.conf /etc/nginx/nginx.conf
COPY fullchain.pem /etc/nginx/ssl/
COPY privkey.pem /etc/nginx/ssl/
COPY delayStart.sh .
EXPOSE 443
ENTRYPOINT ["/bin/bash","./delayStart.sh"]