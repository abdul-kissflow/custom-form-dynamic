import { useEffect } from 'react'
import { kf } from './sdk/wrapper.jsx'
import { DynamicForm } from './components/DynamicForm.jsx'

function App() {
    return (
        <div className="rootDiv">
            {/* This is a default placeholder component, 
					remove this and add your own component */}
            {/* <CustomForm /> */}
            <DynamicForm
                flowType="dataform"
                flowId="Test_All_Fields_A00"
                formInstanceId="PkD_YlNlwWEB"
                title="Dynamic Form"
            />
            {/* <DefaultLandingComponent /> */}
        </div>
    )
}

export default App
