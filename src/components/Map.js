import React from 'react'
import CountFeatures from './CountFeatures';
import useMap from '../assets/useMap';

const Map = () => {
    // rendering map and getting features after polygon drawn
    const { mapRef, viewRef, featuresList } = useMap()
    return (
        <div>
            <div id='container' ref={mapRef} style={{ height: 570 }}>
                <div className='card-container'>
                    {featuresList.map((features) => {
                        return features.length > 0 && (<CountFeatures key={features[0].uid} view={viewRef.current} features={features} />)
                    })}
                </div>
            </div>
        </div >
    )
}

export default Map;
