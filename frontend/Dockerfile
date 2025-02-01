FROM node:18-alpine

WORKDIR /frontend

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_STRIPE_PUBLISHABLE_KEY=${VITE_STRIPE_PUBLISHABLE_KEY}

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5173

CMD ["npm", "run", "docker-dev", "--", "--host", "--strictPort"]