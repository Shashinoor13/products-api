import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

function setupSwagger(app: INestApplication<any>) {
    const swaggerConfig = new DocumentBuilder()
        .setTitle('Products API')
        .setDescription('The products API description')
        .setVersion('1.0')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, documentFactory);
    return app;
}

export default setupSwagger;