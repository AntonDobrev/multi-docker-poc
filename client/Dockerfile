# build phase
FROM node:current-alpine3.18 as builder
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . . 
RUN npm run build

# run phase
FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html