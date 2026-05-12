# Dataset de Contenedores de Residuos - Morelia

Este directorio contiene los datos simulados de 300 contenedores de residuos ubicados en la ciudad de Morelia, Michoacán, así como su historial de llenado durante los últimos 60 días. Estos datos son generados para el proyecto EcoTrack.

## Archivos Generados

### 1. `contenedores.csv`
Contiene la información maestra y ubicación de los contenedores de basura.
- **id**: Identificador único del contenedor (formato: `MOR-XXXX`).
- **lat**: Latitud de ubicación (rango aproximado de la mancha urbana de Morelia: `19.65` a `19.75`).
- **lng**: Longitud de ubicación (rango aproximado: `-101.25` a `-101.10`).
- **zona**: Sector de la ciudad asignado (`Centro`, `Norte`, `Sur`, `Oriente`, `Poniente`).
- **tipo_zona**: Clasificación de la zona que determina el patrón de uso (`residencial`, `comercial`, `mercado`, `escolar`).
- **nivel_actual**: Nivel actual de llenado en porcentaje (`0-100`).

### 2. `historial.parquet`
Contiene el registro diario del nivel de llenado al final del día para cada contenedor durante los últimos 60 días.
- **id_contenedor**: Identificador del contenedor.
- **fecha**: Fecha del registro.
- **nivel_llenado**: Nivel de llenado en porcentaje (0-100) registrado ese día.

## Patrones de Llenado Simulados
El script `generador.py` inyecta comportamientos específicos según el contexto del contenedor:
- **Mercados:** Se llenan un 30% más rápido que la base general.
- **Comercial:** Presentan picos de alta generación de residuos los días viernes y sábado.
- **Residencial:** Mantienen un nivel de generación constante durante la semana.
- **Escolar:** Alta generación en días de semana y reducción drástica los fines de semana.
- **Eventos Especiales (Tianguis):** Cada domingo se selecciona aleatoriamente un contenedor cuyo nivel sube al 95%, simulando la instalación de un mercado sobre ruedas en la zona.

## Generar los Datos
Para regenerar los datos, ejecuta el script `generador.py` desde el entorno virtual con:
```bash
python generador.py
```
