import React, { createContext, useContext } from 'react';
import { useCambioTracker } from '../hooks/useCambioTracker';

const CambioContext = createContext(null);

export function CambioProvider({ children }) {
    const tracker = useCambioTracker();

    return (
        <CambioContext.Provider value={tracker}>
            {children}
        </CambioContext.Provider>
    );
}

export function useCambio() {
    const context = useContext(CambioContext);
    if (!context) {
        throw new Error('useCambio must be used within a CambioProvider');
    }
    return context;
}
