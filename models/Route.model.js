var mongoose = require('mongoose');  

const routeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    waypoints: [{
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
    }],
    markers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RouteMarker'
    }],
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Esto añade automáticamente createdAt y updatedAt
});

mongoose.model('Route', routeSchema);

module.exports = mongoose.model('Route');