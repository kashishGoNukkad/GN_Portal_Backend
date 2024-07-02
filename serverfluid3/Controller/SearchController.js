const ServiceModel = require('../Models/ServiceModel');

const Search = async (req, res) => {
    function isWithinRadius(serviceLocation, userLocation, radius) {
        const distance = getDistanceFromLatLonInKm(
            serviceLocation.lat,
            serviceLocation.lng,
            userLocation.lat,
            userLocation.lng
        );
        return distance <= radius;
    }

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    const { query, location } = req.body;

    try {
        if (!location.lat || !location.lng || !query) {
            return res.status(400).json({ error: "Location and query are required" });
        }

        const services = await ServiceModel.find({});

        const filteredServices = services.filter(service =>
            service.name.toLowerCase().includes(query.toLowerCase()) &&
            isWithinRadius(service.location, location, 5)
        );

        const response = filteredServices.map(service => ({
            name: service.name,
            category: service.category,
            price: service.price,
            address: service.address,
            location: service.location,
        }));

        if (filteredServices.length > 0) {
            return res.status(200).json({ message: "Services found near your location:", services: response });
        } else {
            return res.status(200).json({ message: "No services found near your location", services: [] });
        }
    } catch (error) {
        console.error('Error searching for services:', error);
        return res.status(500).json({ error: "An error occurred while searching for services" });
    }
};

module.exports = Search;
