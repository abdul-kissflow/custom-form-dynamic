// import KFSDK from "../lib/kfsdk/kfsdk.es"
import KFSDK from "/Users/sooryakanth/Desktop/Work/Apps/Product/kf-codebase/frontend/lcnc-sdk-js/packages/sdk/dist/kfsdk.es"
import React, { useState, useEffect } from 'react'

let kf
export function SDKWrapper(props) {
    const [kfInstance, setKfInstance] = useState(null)

    useEffect(function onLoad() {
        if (!window.kf) {
            KFSDK.initialize()
                .then((sdk) => {
                    window.kf = kf = sdk
                    setKfInstance(sdk)
                    console.info('SDK initialized successfully')
                })
                .catch((err) => {
                    setKfInstance({ isError: true })
                    console.error('Error initializing SDK:', err)
                })
        }
    }, [])

    return (
        <React.Fragment>
            {kfInstance && !kfInstance.isError && props.children}
            {kfInstance && kfInstance.isError && (
                <h3>Please use this component inside Kissflow</h3>
            )}
        </React.Fragment>
    )
}

export { kf }
