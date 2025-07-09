FROM node:18

WORKDIR /app

# คัดลอกไฟล์ที่จำเป็น
RUN npm install

COPY . .

EXPOSE 3002

CMD ["node", "index.js"]
