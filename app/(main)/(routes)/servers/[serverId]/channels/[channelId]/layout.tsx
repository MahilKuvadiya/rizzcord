import { Suspense } from "react"
import LoadingChatComponent from "./loading"

const channelIdLayout = ({
    children
} : {
    children : React.ReactNode
}) => {
    return(
        <Suspense fallback={<LoadingChatComponent />}>
            <main className="bg-pastel-primary dark:bg-dark-primary flex flex-col h-full">
                {children}
            </main>
        </Suspense>
    )
}

export default channelIdLayout