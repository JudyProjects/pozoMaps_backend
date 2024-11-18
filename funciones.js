var mongoose = require("mongoose");
var User = require("./models/User.model.js");
var Route = require("./models/Route.model.js");
var RouteMarker = require("./models/RouteMarker.model.js");
const bcrypt = require("bcryptjs");

async function crearUsuario(name, email, password) {
	var hashedPassword = bcrypt.hashSync(password, 8);
	const user = await User.create({
		name: name,
		email: email,
		password: hashedPassword,
	});
	return await user.save();
}

async function findExistingRoute(waypoints) {
	// Convertir waypoints a un formato consistente para comparación
	const normalizedWaypoints = waypoints.map((wp) => ({
		lat: parseFloat(wp.lat.toFixed(4)),
		lng: parseFloat(wp.lng.toFixed(4)),
	}));

	// Buscar todas las rutas
	const routes = await Route.find({});

	// Buscar una ruta que coincida con los waypoints
	const existingRoute = routes.find((route) => {
		if (route.waypoints.length !== waypoints.length) return false;

		return route.waypoints.every((wp, index) => {
			const normalizedWp = {
				lat: parseFloat(wp.lat.toFixed(4)),
				lng: parseFloat(wp.lng.toFixed(4)),
			};
			return (
				normalizedWp.lat === normalizedWaypoints[index].lat &&
				normalizedWp.lng === normalizedWaypoints[index].lng
			);
		});
	});
	return existingRoute;
}

async function crearRuta(name, waypoints) {
	// Buscar una ruta existente
	const existingRoute = await findExistingRoute(waypoints);

	if (existingRoute) {
		return existingRoute;
	}

	// Si no existe, crear una nueva ruta
	const route = new Route({
		name: name,
		waypoints: waypoints,
	});
	return await route.save();
}

async function addMarkerToRoute(routeId, markerData) {
	const marker = new RouteMarker({
		routeId: routeId,
		position: markerData.position,
		traceDistance: markerData.traceDistance,
		traceColor: markerData.traceColor,
		comentario: markerData.comentario,
	});

	await marker.save();

	// Actualizar la ruta para incluir el nuevo marcador
	await Route.findByIdAndUpdate(routeId, { $push: { markers: marker._id } });

	return marker;
}

async function getRouteMarkers(routeId) {
	const markers = await RouteMarker.find({ routeId: routeId });
	return markers;
}

async function getRouteWithMarkers(routeId) {
	const route = await Route.findById(routeId).populate("markers").exec();
	return route;
}

async function saveMarkerToDB(latlng, routeId, distance, color, comentario) {
	const markerData = {
		position: {
			lat: latlng.lat,
			lng: latlng.lng,
		},
		traceDistance: distance,
		traceColor: color,
		comentario: comentario,
	};

	const savedMarker = await addMarkerToRoute(routeId, markerData);
	return savedMarker;
}

async function updateMarker(
	markerId,
	position,
	traceDistance,
	traceColor,
	comentario
) {
	const updatedMarker = await RouteMarker.findByIdAndUpdate(
		markerId,
		{
			position: position,
			traceDistance: traceDistance,
			traceColor: traceColor,
			comentario: comentario,
		},
		{ new: true }
	);

	return updatedMarker;
}

async function deleteMarker(markerId) {
	await RouteMarker.findByIdAndDelete(markerId);
	return;
}

module.exports = {
	crearUsuario,
	crearRuta,
	addMarkerToRoute,
	getRouteWithMarkers,
	saveMarkerToDB,
	getRouteMarkers,
	updateMarker,
	deleteMarker,
};
