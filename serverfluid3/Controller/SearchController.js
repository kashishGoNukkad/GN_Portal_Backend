const ServiceModel = require('../Models/ServiceModel');

const Search =async (req, res) => {
    // const services = [
    //     { name: 'Veg Restaurant Salon', location: { lat: 28.4450, lng: 77.0850 } },
    //     { name: 'Unisex Dubai Salon', location: { lat: 28.4000, lng: 77.0100 } },
    //     { name: 'Vegetarian Fruits', location: { lat: 28.4200, lng: 77.0600 } },
    //     { name: '5 Star Hotel', location: { lat: 34.0522, lng: -118.2437 } },
    //     { name: 'Dubai Restaurant', location: { lat: 34.0522, lng: -118.2437 } },
    //     { name: 'Hotel Paradise', location: { lat: 28.4300, lng: 77.0500 } },
    //     { name: 'Unisex Salon Restaurant', location: { lat: 34.0522, lng: -118.2437 } },
    //     { name: 'Gurugram best Salon', location: { lat: 28.3900, lng: 77.0700 } },
    // ];

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
            address: service.address,
            location: service.location
        }));


        if (filteredServices.length > 0) {
            return res.status(200).json({ message: "Services found near your location:", services: response });
        } else {
            return res.status(404).json({ message: "No services found near your location" });
        }
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while searching for services" });
    }
};

module.exports = Search;
