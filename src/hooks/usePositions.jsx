import { useState, useEffect } from "react";
import { getPositions } from "../services/positionService";

export const usePositions = () => {
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        async function fetchPositions() {
            const fetchedPositions = await getPositions();
            setPositions(fetchedPositions);
        }
        fetchPositions();
    }, []);

    return positions;
};
