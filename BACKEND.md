## Descripcion General

La solución funciona como un servicio que se conecta a la base de datos de la empresa operadora. Analiza el historial de generación de basura de cada contenedor, lo cruza con eventos próximos (como el tianguis de la mañana siguiente), y mediante un modelo predictivo calcula qué tan lleno estará cada depósito. Finalmente, genera la hoja de ruta optimizada (en PDF) para el camión, asegurando que no haga viajes vacíos.

## Arquitectura

Capa de procesamiento (Backend): Python 3.11 con FastAPI para servicios REST. Pandas y NumPy para manipulación de datos, y scikit-learn para los modelos predictivos de saturación. La IA generativa se integra mediante Gemini Flash de Google. Para la generación automatizada de las hojas de ruta en PDF, se emple la librería  ReportLab garantizando la viabilidad operativa en campo.

## Entorno Virtual

```bash
python -m venv venv
```


## Iniciar servidor

```bash
uvicorn main:app --reload --port 8000
```



## Prueba de endpoints
