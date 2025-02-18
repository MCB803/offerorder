import React, { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const transportColors = {
    FLIGHT: "red",
    BUS: "blue",
    SUBWAY: "green",
    UBER: "purple"
};

// Create a custom DivIcon for route labels.
const createLabelIcon = (label, color) => {
    return L.divIcon({
        html: `<div style="background-color: ${color}; color: white; padding: 2px 4px; border-radius: 4px; font-size: 0.75rem;">${label}</div>`,
        className: "route-label-icon",
        iconSize: [50, 20],
        iconAnchor: [25, 10]
    });
};

const MapZoomHandler = ({ route }) => {
    const map = useMap();
    useEffect(() => {
        if (route.length > 0) {
            const bounds = L.latLngBounds(
                route.flatMap(segment => [
                    [segment.origin.latitude, segment.origin.longitude],
                    [segment.destination.latitude, segment.destination.longitude]
                ])
            );
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [route, map]);
    return null;
};

const RouteMap = ({ route }) => {
    if (!route || route.length === 0) return null;

    const validRoute = route.filter(
        segment =>
            segment.origin?.latitude !== null &&
            segment.origin?.longitude !== null &&
            segment.destination?.latitude !== null &&
            segment.destination?.longitude !== null
    );

    if (validRoute.length === 0) return null;

    const getMidpoint = ([lat1, lng1], [lat2, lng2]) => {
        return [(lat1 + lat2) / 2, (lng1 + lng2) / 2];
    };

    return (
        <MapContainer
            center={[validRoute[0].origin.latitude, validRoute[0].origin.longitude]}
            zoom={6}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapZoomHandler route={validRoute} />

            {validRoute.map((segment, index) => {
                const start = [segment.origin.latitude, segment.origin.longitude];
                const end = [segment.destination.latitude, segment.destination.longitude];
                const color = transportColors[segment.type] || "black";
                const midPoint = getMidpoint(start, end);
                return (
                    <React.Fragment key={index}>
                        <Polyline
                            positions={[start, end]}
                            color={color}
                            weight={4}
                            dashArray="8,6"
                        />
                        <Marker position={midPoint} icon={createLabelIcon(segment.type.toUpperCase(), color)} />
                    </React.Fragment>
                );
            })}
        </MapContainer>
    );
};

export default RouteMap;
