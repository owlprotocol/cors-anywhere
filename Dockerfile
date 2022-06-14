# Run Image
FROM node:16
ENV NODE_ENV production

COPY package.json .
RUN npm i
COPY . .

EXPOSE 8080
CMD ["node", "cors.js"]
