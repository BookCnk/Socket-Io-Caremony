FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3002

# คำสั่งรันเซิร์ฟเวอร์
CMD ["node", "index.js"]
