# Etapa 1: Construcción (Build)
FROM node:18-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código y construir la aplicación (Vite)
COPY . .
RUN npm run build

# Etapa 2: Servidor (Nginx)
FROM nginx:alpine

# Copiar los archivos estáticos construidos desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
