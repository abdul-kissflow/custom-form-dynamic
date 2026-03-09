import { DefaultLandingComponent } from './landing/index.jsx'
import { CustomForm } from './components/CustomForm.jsx'
import { useEffect } from 'react'
import { kf } from './sdk/wrapper.jsx'
import { DynamicForm } from './components/DynamicForm.jsx'

function App() {

    useEffect(() => {

        const fetchData = async () => {
        const dataform = kf.app.getDataform("Test_All_Fields_A00")
        const item = await dataform.getItems()
            console.log("Form Item Data:", item)
        }
        // fetchData()
    }, [])
    return (
        <div className="rootDiv">
            {/* This is a default placeholder component, 
					remove this and add your own component */}
                    {/* <CustomForm /> */}
            <DynamicForm
                flowType="dataform"
                flowId="Test_All_Fields_A00"
                formInstanceId="PkCjdkVu74nn"
                title="Dynamic Form"
            />
            {/* <DefaultLandingComponent /> */}

        </div>
    )
}

export default App
