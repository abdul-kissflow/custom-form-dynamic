import { DynamicForm } from './components/DynamicForm.jsx'

function App() {
    return (
        <div className="rootDiv">
            {/* <CustomForm /> */}
            <DynamicForm
                flowType="dataform"
                flowId="Test_All_Fields_A00"
                // viewId="DT_view_A02"
                instanceId="PkD_YlNlwWEB"
                title="Dynamic Form"
                // flowType="process"
                // flowId="360_Degree_Feedback_new_A00"
                // instanceId="PkDhEXpBupLm"
                // activityInstanceId="PkDhzZnREAzL"
            />
            {/* <DefaultLandingComponent /> */}
        </div>
    )
}

export default App
