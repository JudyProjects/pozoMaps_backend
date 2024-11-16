var mongoose = require('mongoose');  

const routeMarkerSchema = new mongoose.Schema({
    position: {
        lat: {
            type: Number,
            required: true,
            min: -90,
            max: 90
        },
        lng: {
            type: Number,
            required: true,
            min: -180,
            max: 180
        }
    },
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },
    traceDistance: {
        type: Number,
        required: true,
        min: 0
    },
    traceColor: {
        type: String,
        default: 'yellow',
        required: true
    },
    metadata: {
        description: String,
        type: {
            type: String,
            enum: ['warning', 'danger', 'info'],
            default: 'warning'
        },
        severity: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        tags: [String]
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Índices para mejorar el rendimiento
routeMarkerSchema.index({ routeId: 1 });
routeMarkerSchema.index({ 'position.lat': 1, 'position.lng': 1 });

// Ejemplo de método para encontrar marcadores cercanos
routeMarkerSchema.statics.findNearby = function(lat, lng, maxDistance) {
    return this.find({
        position: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [lng, lat]
                },
                $maxDistance: maxDistance
            }
        }
    });
};


mongoose.model('RouteMarker', routeMarkerSchema);

module.exports = mongoose.model('RouteMarker');