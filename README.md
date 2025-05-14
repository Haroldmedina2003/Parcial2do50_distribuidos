composicion del parcial:

API: expone endpoints para subir las imagenes.
RabbitMQ: Intermediador de mensajes
ResizeWorker: redimensiona la imagen
WatermarkWorker: añade maerca de agua
DetectWorker: realiza analisis (por ejemplo, detección de objetos o metadatos).

Por ultimo clonar el repositorio 
Levantar contenedores 
Subir una imagen 
ir al puerto "http://localhost:15672"
Usuario: user
Contraseña: pass

--------------------------------------------------------------------
Ejercio por estudiante:

un producto que se llama "metrics_sender" envia mensajes con datos de metricas
Exchange de tipo "fanout" llamado "metrics_fanout"
3 colas: "influx_store", "prometheus_store", "elastic_store" enmlazadas al exchange
3 consumidores, uno por cada cola: "influx_consumer", "prometheus_consumer""elastic_consumer"

Funcionamineto:
el exchange tipo fanout se encarga de distribuir cacda mensaje enviado por el porductor a todas las colas conectadas






