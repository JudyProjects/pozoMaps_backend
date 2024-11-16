var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
const { 
    crearRuta, 
    addMarkerToRoute, 
    getRouteMarkers, 
    updateMarker,
    deleteMarker
} = require('./../funciones');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Crear nueva ruta
router.post('/routes', async (req, res) => {
    try {
        const route = await crearRuta(req.body.name, req.body.waypoints);
        res.status(201).json(route);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Añadir marcador
router.post('/markers', async (req, res) => {
    try {
        const marker = await addMarkerToRoute(req.body.routeId, {
            position: req.body.position,
            traceDistance: req.body.traceDistance,
            traceColor: req.body.traceColor,
            metadata: req.body.metadata
        });
        res.status(201).json(marker);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener marcadores de una ruta
router.get('/routes/:routeId/markers', async (req, res) => {
    try {
        const markers = await getRouteMarkers(req.params.routeId);
        res.json(markers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar marcador
router.put('/markers/:markerId', async (req, res) => {
    try {
        const updatedMarker = await updateMarker(
            req.params.markerId,
            req.body.position,
            req.body.traceDistance,
            req.body.traceColor,
            req.body.metadata
        );
        res.json(updatedMarker);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar marcador
router.delete('/markers/:markerId', async (req, res) => {
    try {
        await deleteMarker(req.params.markerId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
