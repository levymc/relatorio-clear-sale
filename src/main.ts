import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('Relatório Clear Sale API')
    .setDescription('API para gerar relatórios HTML baseados em consultas Clear Sale Credit Pro')
    .setVersion('1.0')
    .addTag('Reports', 'Endpoints para geração de relatórios')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 API rodando na porta ${port}`);
  console.log(`📚 Documentação disponível em: http://localhost:${port}/docs`);
  console.log(`📄 Swagger disponível em: http://localhost:${port}/api`);
  console.log(`🔗 Endpoint principal: http://localhost:${port}/reports/generate`);
}

bootstrap();