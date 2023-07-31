import { useEffect, useRef, useState } from 'react'
import { loadModules } from "esri-loader";

const useMap = () => {
    const [featuresList, setFeaturesList] = useState([]);
    const mapRef = useRef()
    const viewRef = useRef()

    useEffect(() => {
        loadModules(["esri/views/MapView", "esri/Map", "esri/config", "esri/layers/FeatureLayer", "esri/layers/GraphicsLayer", "esri/widgets/Sketch"], { css: true }).then(([MapView, Map, esriConfig, FeatureLayer, GraphicsLayer, Sketch]) => {
            esriConfig.apiKey = "AAPK067f59943237493b9392b1ecca51a944znvfyXOatrCHcgIVzi6QrY4siarZNIEWCut9DgbyO5-U7Y0Os3yzA9neOlm8FDZg";
            const featureLayer = new FeatureLayer({
                url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Earthquakes_Since1970/FeatureServer/0'
            })

            const featureLayer2 = new FeatureLayer({
                url: 'https://services3.arcgis.com/GVgbJbqm8hXASVYi/ArcGIS/rest/services/my_points/FeatureServer/0',
            });

            const graphicsLayer = new GraphicsLayer({})

            const map = new Map({
                basemap: "arcgis-topographic",// Basemap layer service
                layers: [featureLayer, featureLayer2, graphicsLayer]
            });
            const view = new MapView({
                map: map,
                center: [-118.805, 34.027], // Longitude, latitude
                zoom: 13, // Zoom level
                container: mapRef.current // Div element
            });
            viewRef.current = view
            const sketch = new Sketch({
                layer: graphicsLayer,
                view: view
            })
            let featureLayers = map.layers.items.filter((item) => item.type === 'feature')
            sketch.on('create', (event) => {
                if (event.state === 'complete') {
                    findFeatures(featureLayers, event)
                }
            })
            view.ui.add(sketch, 'top-right')

        });
    }, [])

    const findFeatures = async (featureLayers, event) => {
        let layersFeaturesList = []
        for (let featureLayer of featureLayers) {
            const query = featureLayer.createQuery()
            query.geometry = event.graphic.geometry;
            let selectedFeaturesIds = await featureLayer.queryObjectIds(query)
            // ḥere I can use single query for both selectedFeaturesIds & maxCountFeatures but it give sometime wrong results
            const maxCountQuery = featureLayer.createQuery()
            query.where = '1=1';
            const maxCountFeatures = await featureLayer.queryFeatures(maxCountQuery)
            const maxCount = maxCountFeatures.features.length
            let featuresArr = []
            if (selectedFeaturesIds) {
                while (selectedFeaturesIds.length !== 0) {
                    if (selectedFeaturesIds.length > maxCount) {
                        let spliceFeatures = selectedFeaturesIds.splice(0, maxCount)
                        let finalQuery = featureLayer.createQuery()
                        finalQuery.where = `objectId IN (${spliceFeatures})`;
                        let result = await featureLayer.queryFeatures(finalQuery)
                        result.features.map((feature) => {
                            featuresArr.push(feature)
                        })
                    }
                    else {
                        let finalQuery = featureLayer.createQuery()
                        finalQuery.where = `objectId IN (${selectedFeaturesIds})`;
                        let result = await featureLayer.queryFeatures(finalQuery)
                        selectedFeaturesIds = []
                        result.features.map((feature) => {
                            featuresArr.push(feature)
                        })
                    }
                }
            }
            layersFeaturesList.push(featuresArr)
        }
        setFeaturesList(layersFeaturesList)
    }
    return { mapRef, viewRef, featuresList }
}
export default useMap;
