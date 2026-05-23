# Borrador de itinerario — Núremberg

> Borrador conversacional para revisión manual. **No sustituye** los JSON finales en `src/data/itinerary/`.
>
> Fuentes: `src/data/places/nuremberg.json`, `src/data/planning/nuremberg/clusters.json`

---

## Resumen ejecutivo

| Campo | Valor |
|-------|-------|
| **Fechas tentativas** | Jueves 18 de junio – Viernes 19 de junio de 2026 |
| **Días turísticos** | 1 día (Propuesta A, preferida) u 1,5 (Propuesta B) |
| **Llegada** | Miércoles 17 jun: traslado Múnich → Núremberg + trabajo |
| **Salida** | Viernes 19 jun hacia Dresde |
| **Escenario preferido** | **Propuesta A:** todo el núcleo el **jueves**, inicio **8:00 en Hauptmarkt**; viernes sin turismo en Núremberg |

**Restricciones de trabajo (entre semana):**

- Regreso al hotel **antes de las 18:00** el jueves.
- Bloque de trabajo **18:00–00:00**.
- Lunch habitual **~14:00–15:00** (reservar 1 hora).

---

## Análisis de carga

### Presupuesto de tiempo

| Ventana | Minutos útiles |
|---------|----------------|
| Jueves 8:00–18:00 | 600 |
| Menos lunch 14:00–15:00 | **540** |
| Viernes 8:30–12:00 (solo Propuesta B) | **210** |

### Demanda (catálogo acordado)

| Bloque | Minutos |
|--------|---------|
| 16 POIs núcleo (`planningMinutes`) | 465 |
| Caminata eficiente (sin contar lunch) | ~50–75 |
| 2 POIs media (trenes, Faber) | +150 (+ traslado Faber) |

### Veredicto

| Pregunta | Propuesta A (preferida) | Propuesta B |
|----------|-------------------------|-------------|
| ¿Sobrecargado? | **Ajustado** con inicio 8:00; ritmo intenso | Holgado |
| ¿Faltan días? | No para el núcleo de 16 | No |
| ¿Sobran días? | Sí el viernes AM si eliges A | No |
| Día más pesado | **Jueves** | Jueves |
| ¿Qué no verás en A? | Trenes, Faber; excluidos de planificación | Solo una media (trenes **o** Faber) |

**Prioridades anchor:** Castillo, Hauptmarkt, Lorenzkirche, Weißgerbergasse, Handwerkerhof, Ópera (ver `clusters.json` → `summary.anchorPlaceIds`).

---

## POIs excluidos (no incluir en rutas)

| placeId | Nombre | Motivo |
|---------|--------|--------|
| `casa-de-alberto-durero-nuremberg` | Casa de Alberto Durero (Museo) | Prioridad baja |
| `museo-del-juguete-nuremberg` | Museo del Juguete | Prioridad baja |
| `centro-documentacion-nazismo` | Centro de Documentación del Nazismo | Prioridad baja |
| `juicio-nuremberg` | Juicio de Nuremberg | Prioridad baja |

---

## Prioridades del viaje (referencia)

| Nivel | Lugares |
|-------|---------|
| **Imperdible** | Castillo, Handwerkerhof, Hauptmarkt, Frauenkirche, Fuente, Ayuntamiento, Weißgerbergasse, San Lorenzo, San Sebaldo, Ópera |
| **Importante** | Mazmorras, 3 puentes, Santa Isabel, San Jacobo |
| **Media** (opcional / día 2) | Museo de trenes, Faber-Castell Castle |
| **Baja** | Excluidos arriba |

---

## Miércoles 17 de junio — Llegada

**Rol:** traslado desde Múnich + trabajo. Sin bloque turístico planificado.

**Nota opcional:** si el hotel o la ruta desde la estación pasan por el sur, un vistazo rápido al Handwerkerhof (35 min) el miércoles podría aliviar el cierre del jueves — solo si es de paso, sin rodeo.

---

## Propuesta A (preferida) — Jueves único + viernes salida temprana a Dresde

### Visión del día

- **Zonas principales:** Altstadt (exterior 8:00) → Burgberg (castillo 9:00) → Altstadt interior → sur (Weißgerbergasse, Lorenz, iglesias oeste) → Pegnitz de paso → zona estación.
- **Anchor activities:** `hauptmarkt-nuremberg` (arranque) + `castillo-de-nuremberg` (9:00).
- **Viernes:** sin actividades en Núremberg; traslado temprano a Dresde.

### Orden recomendado (continuo, sin regresos grandes)

1. **8:00–8:25** — Exterior Altstadt (siempre accesible)
2. **8:25–8:55** — Caminata hacia Burgberg
3. **9:00–11:00** — Castillo (abre 9:00)
4. **11:00–13:45** — Altstadt interior (bajada desde castillo)
5. **14:00–15:00** — Lunch
6. **15:00–16:15** — Sur: Weißgerbergasse, Lorenz, iglesias oeste si caben
7. **16:15–17:45** — Puentes de paso hacia estación → Handwerkerhof → Ópera
8. **17:45–18:00** — Regreso hotel

### Tabla horaria conversacional

| Hora | Actividad | placeId | Min |
|------|-----------|---------|-----|
| 8:00–8:10 | Hauptmarkt (Plaza Principal) | `hauptmarkt-nuremberg` | 10 |
| 8:10–8:20 | Fuente Schöner Brunnen | `fuente-schoner-brunnen-nuremberg` | 10 |
| 8:20–8:25 | Altes Rathaus (exterior) | `altes-rathaus` | 5 |
| 8:25–8:55 | Caminata → castillo | — | ~30 |
| 9:00–11:00 | Castillo de Núremberg | `castillo-de-nuremberg` | 120 |
| 11:00–11:30 | Frauenkirche | `frauenkirche-nuremberg` | 30 |
| 11:30–12:10 | Mazmorras medievales | `mazmorras-medievales-nuremberg` | 40 |
| 12:10–12:55 | Iglesia de San Sebaldo | `iglesia-san-sebaldo-nuremberg` | 45 |
| 12:55–14:00 | Buffer / acercamiento a lunch | — | ~65 |
| **14:00–15:00** | **Lunch** | — | 60 |
| 15:00–15:30 | Weißgerbergasse (Calle de los Curtidores) | `weissgerbergasse-nuremberg` | 30 |
| 15:30–16:15 | Iglesia de San Lorenzo | `iglesia-san-lorenzo-nuremberg` | 45 |
| 16:15–16:45 | Santa Isabel + San Jacobo *(si caben)* | `iglesia-santa-isabel-nuremberg`, `iglesia-san-jacobo-nuremberg` | 60 |
| 16:45–17:10 | Puentes Pegnitz (de paso) | `museumbruecke-nuremberg`, `puente-del-verdugo-nuremberg`, `puente-de-las-cadenas-nuremberg` | 25 |
| 17:10–17:45 | Handwerkerhof + Ópera (exterior) | `handwerkerhof-nuremberg`, `opera-de-nuremberg-nuremberg` | 55 |
| 17:45–18:00 | Hotel | — | 15 |

*Si Isabel/Jacobo no caben a las 16:15, moverlas antes de Lorenz (15:45–16:45) y acortar buffer pre-lunch.*

### Actividades secundarias / recorte (si el día se atrasa)

| Orden de recorte | placeId | Min que liberas |
|------------------|---------|-----------------|
| 1 | `iglesia-santa-isabel-nuremberg` + `iglesia-san-jacobo-nuremberg` | 60 |
| 2 | `mazmorras-medievales-nuremberg` | 40 |
| 3 | `puente-de-las-cadenas-nuremberg` | 5 |

No recortar si puedes evitarlo: castillo, plaza/fuente, Weißgerbergasse, Lorenz, Sebald, Handwerkerhof, Ópera.

### Lunch (~14:00)

- **Zona:** Hauptmarkt, Königstraße, Breite Gasse (ya en el núcleo tras la mañana).
- **Ideas:** Bratwurst, cafés del casco, cervecerías cerca de la plaza.

### Actividades opcionales (no en Propuesta A)

| placeId | Nombre | Notas |
|---------|--------|-------|
| `museo-de-los-trenes-nuremberg` | Museo de los trenes | Media; requiere viernes AM o omitir |
| `faber-castell-castle-nuremberg` | Faber-Castell Castle | Media; Stein, traslado ~40 min |

### Observaciones estratégicas

- **Puentes al final:** solo en el tramo sur → estación; evita volver al norte después de Lorenz.
- **Exteriores a las 8:00:** plaza, fuente y ayuntamiento no dependen de horario de apertura.
- **Sin huecos >45 min** salvo lunch y caminata castillo (8:25–8:55).
- Ritmo **intenso pero realista** con 540 min útiles; cualquier cola en mazmorras o iglesias activa la tabla de recortes.

### Qué dejas fuera si solo haces Propuesta A

| Categoría | Lugares |
|-----------|---------|
| Siempre fuera | Museo trenes, Faber-Castell |
| Siempre fuera (excluidos) | Durero, museo juguete, nazismo, juicios |
| Solo si el día se atrasa | Isabel, Jacobo, mazmorras, Kettensteg |

**Objetivo realista:** **16 POIs núcleo** en un jueves con inicio 8:00.

---

## Propuesta B (alternativa) — Jueves + viernes hasta 12:00

Mismo **jueves 8:00–18:00** que Propuesta A, con estas variaciones posibles:

- Si el jueves no da para el cierre: dejar **puentes + Handwerkerhof + Ópera** para el viernes AM.
- Si el jueves va bien: viernes solo para **una** actividad media o spillover.

### Viernes 19 de junio (hasta ~12:00)

| Campo | Contenido |
|-------|-----------|
| **Zonas** | Estación / oeste / Stein (según elección) |
| **Anchor** | `handwerkerhof-nuremberg` o pendiente del jueves |
| **Tiempo útil** | ~210 min (8:30–12:00) |
| **Orden sugerido** | Pendientes jueves → Handwerkerhof + Ópera → **uno:** trenes **o** Faber |
| **Lunch** | No planificado; snack si hace falta |
| **Regla** | No intentar trenes **y** Faber el mismo viernes |

**Paquetes viables el viernes (elegir uno):**

| Paquete | Contenido | Min aprox. |
|---------|-----------|------------|
| Cierre casco | Puentes + Handwerkerhof + Ópera | ~80 |
| Cierre + media A | Lo anterior + Museo de trenes | ~140 |
| Cierre + media B | Handwerkerhof + Ópera + Faber-Castell | ~150–190 |
| Spillover iglesias | Sebald / Isabel / Jacobo pendientes + estación | ~100–160 |

### Qué recuperas vs Propuesta A

- Handwerkerhof y Ópera sin prisa el viernes.
- Posibilidad de **museo de trenes** o **Faber** (uno).
- Mazmorras o iglesias oeste si las recortaste el jueves.

---

## Comparativa rápida A vs B

| | Propuesta A | Propuesta B |
|--|-------------|-------------|
| Jueves | Núcleo completo (meta 16 POIs) | Igual o ligeramente más holgado |
| Viernes | Traslado temprano Dresde | Hasta 12:00 turismo |
| Trenes / Faber | No | Uno posible |
| Carga jueves | Alta | Alta o media |
| Riesgo 18:00 | Medio (cerrar 17:45) | Menor si spillover viernes |

---

## Checklist pre-JSON (decisiones manuales)

- [x] Arranque jueves: **8:00 Hauptmarkt** (exterior plaza, fuente, ayuntamiento).
- [x] Castillo a las **9:00**.
- [x] Puentes al **cierre**, de paso hacia estación.
- [ ] Confirmar **Propuesta A vs B** (viernes temprano vs hasta 12:00).
- [ ] Si Propuesta B: elegir **trenes** o **Faber** (no ambos).
- [ ] Si el día va lento: ¿recortar Isabel/Jacobo o mazmorras?
- [ ] Ubicación del hotel (solo afecta si reconsideras arranque; Hauptmarkt sigue siendo el preferido).

---

## Notas para la fase JSON (sin generar archivos)

**Jueves 2026-06-18 (Propuesta A) — placeIds en orden:**

```
hauptmarkt-nuremberg
fuente-schoner-brunnen-nuremberg
altes-rathaus
castillo-de-nuremberg
frauenkirche-nuremberg
mazmorras-medievales-nuremberg
iglesia-san-sebaldo-nuremberg
weissgerbergasse-nuremberg
iglesia-san-lorenzo-nuremberg
iglesia-santa-isabel-nuremberg
iglesia-san-jacobo-nuremberg
museumbruecke-nuremberg
puente-del-verdugo-nuremberg
puente-de-las-cadenas-nuremberg
handwerkerhof-nuremberg
opera-de-nuremberg-nuremberg
```

**Viernes 2026-06-19:** vacío en Propuesta A; en Propuesta B, subset de pendientes + opcional `museo-de-los-trenes-nuremberg` **o** `faber-castell-castle-nuremberg`.

**Bloques eat/work:** lunch jueves ~14:00; workBlock jueves 18:00–00:00; transfer viernes según horario real a Dresde.

---

*Generado como borrador de planificación. Revisar tiempos reales el día del viaje (colas, tickets mazmorras, misas en iglesias).*
